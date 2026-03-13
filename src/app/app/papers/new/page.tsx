export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UploadPaperForm from "./UploadPaperForm";

export default async function NewPaperPage() {
  const user = await requireUser();
  if (!user || !user.isAdmin) redirect("/");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

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
                <Link href="/app/papers" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                  Publications
                </Link>
                {user && (
                  <Link href="/app/papers?mine=1" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors">
                    My Papers
                  </Link>
                )}
                {user?.isAdmin && (
                  <>
                    <Link href="/app/papers/new" className="text-blue-900 px-3 py-2 text-sm font-medium transition-colors border-b-2 border-blue-900">
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
                  <Link href="/auth/login" className="text-slate-600 hover:text-blue-900 px-3 py-2 text-sm font-medium">
                    Log in
                  </Link>
                  <Link href="/auth/signup" className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500 hidden sm:inline-block">{user.email}</span>
                  <form action={async () => { "use server"; await signOut(); }}>
                    <button type="submit" className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors">
                      Log out
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Upload Paper</h1>
          <p className="text-slate-500">Upload a new PDF paper to the library.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <UploadPaperForm categories={categories} />
        </div>
      </main>
    </div>
  );
}
