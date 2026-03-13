export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";


import { Link } from "@/i18n/routing";
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
      <Navbar user={user} />

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
