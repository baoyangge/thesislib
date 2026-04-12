export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function PaperDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const p = await params;
  const t = await getTranslations("Navigation");
  const tp = await getTranslations("Papers");
  
  const user = await requireUser();

  const paper = await prisma.paper.findUnique({
    where: { id: p.id },
    include: {
      category: true,
      file: true,
      author: true,
    },
  });

  if (!paper) {
    notFound();
  }

  const canEdit = user?.isAdmin;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href={`/${p.locale}`} className="text-2xl font-bold text-blue-900 tracking-tight">
                FaultJournal
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href={`/${p.locale}/app/papers`} className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                  {t("Publications")}
                </Link>
                {user && (
                  <Link href={`/${p.locale}/app/papers?mine=1`} className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                    {t("My Papers")}
                  </Link>
                )}
                {user?.isAdmin && (
                  <>
                    <Link href={`/${p.locale}/app/papers/new`} className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                      {t("Upload Paper")}
                    </Link>
                    <Link href={`/${p.locale}/admin`} className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                      {t("Admin")}
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link href={`/${p.locale}/auth/login`} className="text-sm font-medium text-slate-600 hover:text-blue-900">
                    {t("Log in")}
                  </Link>
                  <Link href={`/${p.locale}/auth/signup`} className="text-sm font-medium bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
                    {t("Register")}
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-600">
                    {user.email} {user.isAdmin && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{t("Admin")}</span>}
                  </div>
                  <form action={async () => { "use server"; await signOut(); }}>
                    <button type="submit" className="text-sm font-medium text-slate-600 hover:text-blue-900">
                      {t("Log out")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{paper.title}</h1>
            <div className="text-lg text-slate-700 mb-4">
              {paper.authors || paper.author.email || "Unknown Author"}
            </div>
            {paper.doi && (
              <div className="text-sm text-slate-600 mb-6 flex items-center">
                <span className="font-semibold mr-2">DOI:</span>
                <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {paper.doi}
                </a>
              </div>
            )}
          </div>
          
          <div className="mb-8 border-t border-slate-200 pt-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">{tp("Abstract") || "Abstract"}</h3>
            <p className="text-slate-700 leading-relaxed text-justify">
              {paper.abstract || "No abstract provided."}
            </p>
          </div>

          <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
            {paper.file ? (
              <a href={`/api/papers/${paper.id}/download`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                PDF
              </a>
            ) : (
              <span className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-500 bg-slate-100 cursor-not-allowed">
                {tp("File Unavailable") || "File Unavailable"}
              </span>
            )}

            {canEdit && (
              <Link href={`/${p.locale}/admin/papers/${paper.id}/edit`} className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                {tp("Edit") || "Edit"}
              </Link>
            )}
          </div>
        </article>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 text-center text-sm mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} FaultJournal. A Professional Scientific Library.</p>
        </div>
      </footer>
    </div>
  );
}