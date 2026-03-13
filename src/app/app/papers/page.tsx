export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { signOut } from "@/lib/auth";

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const mine = sp.mine === "1";
  const category = typeof sp.category === "string" ? sp.category : "";

  const user = await requireUser();

  const where: import("@prisma/client").Prisma.PaperWhereInput = {};
  if (!mine) {
    where.isActive = true;
    if (!user || !user.isAdmin) where.status = "APPROVED";
  }
  if (mine) {
    if (!user) {
      where.authorId = "__none__";
    } else {
      where.authorId = user.id;
    }
  }
  if (category) {
    where.category = { slug: category };
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const papers = await prisma.paper.findMany({
    where,
    orderBy: mine ? { createdAt: "desc" } : { viewCount: "desc" },
    take: 50,
    include: {
      category: true,
      file: true,
      reviews: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-900 tracking-tight">
                FaultJournal
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/app/papers" className="text-blue-900 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-blue-900">
                  Publications
                </Link>
                {user && (
                  <Link href="/app/papers?mine=1" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                    My Papers
                  </Link>
                )}
                {user?.isAdmin && (
                  <>
                    <Link href="/app/papers/new" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                      Upload Paper
                    </Link>
                    <Link href="/admin" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                      Admin
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-blue-900">
                    Log in
                  </Link>
                  <Link href="/auth/signup" className="text-sm font-medium bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-600">
                    {user.email} {user.isAdmin && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Admin</span>}
                  </div>
                  <form action={async () => { "use server"; await signOut(); }}>
                    <button type="submit" className="text-sm font-medium text-slate-600 hover:text-blue-900">
                      Log out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-900">{mine ? "My Papers" : "Popular Papers"}</h1>
          {user?.isAdmin && (
            <Link href="/app/papers/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Upload New Paper
            </Link>
          )}
        </header>

        {/* Filters */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Filter by Subject</h3>
          <div className="flex flex-wrap gap-2">
            <Link href={mine ? "/app/papers?mine=1" : "/app/papers"} className={`px-3 py-1.5 rounded-full text-sm font-medium ${!category ? 'bg-blue-900 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}>
              All Subjects
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`${mine ? "/app/papers?mine=1&" : "/app/papers?"}category=${encodeURIComponent(c.slug)}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${category === c.slug ? 'bg-blue-900 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Papers List */}
        <div className="space-y-6">
          {papers.map((p) => {
            const latest = p.reviews[0];
            const statusCn: Record<string, string> = {
              SUBMITTED: "Submitted",
              UNDER_REVIEW: "Under Review",
              APPROVED: "Approved",
              REJECTED: "Rejected",
            };

            return (
              <div key={p.id} className="flex flex-col md:flex-row bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-bold tracking-wide uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {p.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Views: {p.viewCount}</span>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      p.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      p.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      p.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {statusCn[p.status] || p.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{p.title}</h2>
                  
                  {mine && (
                    <div className="mt-4 p-3 bg-slate-50 rounded text-sm text-slate-700 border border-slate-100">
                      <strong>Latest Review: </strong>
                      {latest ? (
                        <span>
                          {statusCn[String(latest.decision)] || String(latest.decision)}
                          {latest.note ? ` (${latest.note})` : ""} · {new Date(latest.createdAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-500">No review yet</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-center min-w-[200px]">
                  {p.file ? (
                    <a href={`/api/papers/${p.id}/download`} className="inline-flex items-center justify-center w-full px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 bg-white rounded-md font-medium transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      PDF
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm text-center block w-full py-2 bg-slate-100 rounded border border-dashed border-slate-300">File Unavailable</span>
                  )}
                </div>
              </div>
            );
          })}
          
          {papers.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">No papers found</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by adjusting your filters or checking back later.</p>
            </div>
          )}
        </div>
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
