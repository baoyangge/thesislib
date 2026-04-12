export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, signOut } from "@/lib/auth";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function EditPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const user = await requireUser();
  if (!user?.isAdmin) redirect("/");

  const paper = await prisma.paper.findUnique({
    where: { id: p.id },
  });

  if (!paper) {
    notFound();
  }

  async function updatePaper(formData: FormData) {
    "use server";
    const u = await requireUser();
    if (!u?.isAdmin) return;

    await prisma.paper.update({
      where: { id: p.id },
      data: {
        title: String(formData.get("title") || ""),
        authors: String(formData.get("authors") || ""),
        doi: String(formData.get("doi") || ""),
        abstract: String(formData.get("abstract") || ""),
      },
    });

    revalidatePath(`/app/papers/${p.id}`);
    redirect(`/app/papers/${p.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow border border-slate-200">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">Edit Paper Details</h1>
        <form action={updatePaper} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input name="title" defaultValue={paper.title} required className="w-full rounded border border-slate-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Authors</label>
            <input name="authors" defaultValue={paper.authors || ""} className="w-full rounded border border-slate-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DOI</label>
            <input name="doi" defaultValue={paper.doi || ""} className="w-full rounded border border-slate-300 p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Abstract</label>
            <textarea name="abstract" defaultValue={paper.abstract || ""} className="w-full rounded border border-slate-300 p-2 h-40" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Link href={`/app/papers/${paper.id}`} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded font-medium">
              Cancel
            </Link>
            <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 font-medium">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}