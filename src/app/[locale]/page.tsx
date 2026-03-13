export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";

import Navbar from "@/components/Navbar";


import { Link } from "@/i18n/routing";
import { requireUser } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const t = await getTranslations("Home");
  const user = await requireUser();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const topPapers = await prisma.paper.findMany({
    where: { status: "APPROVED", file: { isNot: null } },
    orderBy: { viewCount: "desc" },
    take: 12,
    include: { category: true },
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar user={user} />

      {/* Hero Section */}
      <div className="bg-blue-900 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{t("hero_title")}</h1>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">{t("hero_subtitle")}</p>
        <div className="max-w-xl mx-auto flex justify-center gap-2">
          <Link href="/app/papers" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-slate-50 md:py-4 md:text-lg transition-colors">{t("browse_all")}</Link>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">{t("research_subjects")}</h2>
          <div className="flex flex-wrap gap-3">
            {categories.length === 0 ? (
              <span className="text-slate-500">{t("no_categories")}</span>
            ) : (
              categories.map((c) => (
                <Link key={c.id} href={`/app/papers?category=${encodeURIComponent(c.slug)}`} className="bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  {c.name}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top Papers Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">{t("most_read")}</h2>
          {topPapers.length === 0 ? (
            <div className="text-slate-500 text-center py-12 bg-slate-50 rounded-lg border border-slate-200">{t("no_papers")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPapers.map((p) => (
                <div key={p.id} className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6 flex-grow">
                    <div className="text-xs font-semibold tracking-wide uppercase text-blue-600 mb-2">
                      {p.category?.name || "Uncategorized"}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2" title={p.title}>
                      {p.title}
                    </h3>
                    <div className="text-sm text-slate-500 flex items-center justify-between mt-auto">
                      <span>{t("views")}: {p.viewCount}</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                    <a href={`/api/papers/${p.id}/download`} className="text-blue-700 font-medium hover:text-blue-900 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>{t("download_pdf")}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 text-center text-sm mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex space-x-6 mb-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors" title="Xiaohongshu">
              <span className="sr-only">Xiaohongshu</span>
              {/* Heart icon representing Xiaohongshu */}
              <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="h-6 w-6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" title="X (Twitter)">
              <span className="sr-only">X (Twitter)</span>
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.075H5.059z" /></svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" title="Weibo">
              <span className="sr-only">Weibo</span>
              {/* Eye icon representing Weibo */}
              <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="h-6 w-6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" title="WeChat">
              <span className="sr-only">WeChat</span>
              {/* Message circle representing WeChat */}
              <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="h-6 w-6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
          <p className="mb-2">
            Contact us: <a href="mailto:faultjournal.contact@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">faultjournal.contact@gmail.com</a>
          </p>
          <p>&copy; {new Date().getFullYear()} FaultJournal. A Professional Scientific Library.</p>
        </div>
      </footer>
    </div>
  );
}
