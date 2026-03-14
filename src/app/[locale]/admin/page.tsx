export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";


import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, signOut } from "@/lib/auth";
import { PaperStatus } from "@prisma/client";
import { unlink } from "node:fs/promises";
import path from "node:path";

export default async function AdminPage() {
  const t = await getTranslations("Admin");
  const user = await requireUser();
  if (!user) redirect("/auth/login");
  if (!user.isAdmin) redirect("/");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const papers = await prisma.paper.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { author: true, category: true, file: true },
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar user={user} />

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t("Admin Dashboard")}</h1>
          <p className="text-slate-500">{t("Review papers and manage categories.")}</p>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-slate-900">{t("Category Management")}</h2>
            <div className="text-sm text-slate-500">{t("Auto-create categories during paper upload using slugs")}</div>
          </div>

          <form
            className="flex flex-wrap gap-3 items-end"
            action={async (fd) => {
              "use server";
              const name = String(fd.get("name") || "").trim();
              const slugRaw = String(fd.get("slug") || "").trim();
              const slug = (slugRaw || name).toLowerCase().replace(/\s+/g, "-");
              if (!name || !slug) return;
              await prisma.category.upsert({
                where: { slug },
                update: { name },
                create: { name, slug },
              });
            }}
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("Category Name")}</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" name="name" placeholder="e.g. Artificial Intelligence" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("Slug (Optional)")}</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" name="slug" placeholder="e.g. ai" />
            </div>
            <button className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors" type="submit">
              {t("Add / Update")}
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-4">
            {categories.length === 0 ? (
              <span className="text-slate-500 text-sm italic">{t("No categories found.")}</span>
            ) : (
              categories.map((c) => (
                <form
                  key={c.id}
                  action={async () => {
                    "use server";
                    await prisma.category.delete({ where: { id: c.id } });
                  }}
                >
                  <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors group" type="submit">
                    {c.slug} <span className="text-slate-400 group-hover:text-red-500">&times;</span>
                  </button>
                </form>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t("Papers Pending Review")}</h2>
          {papers.map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{p.title}</h3>
                  <div className="text-sm text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span><span className="font-medium">{t("Author")}:</span> {p.author.email}</span>
                    <span className="text-slate-300">|</span>
                    <span><span className="font-medium">{t("Category")}:</span> {p.category?.slug || "-"}</span>
                    <span className="text-slate-300">|</span>
                    <span>
                      <span className="font-medium mr-1">{t("Status")}:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        {p.status}
                      </span>
                    </span>
                    <span className="text-slate-300">|</span>
                    {p.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">{t("Active")}</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{t("Inactive")}</span>
                    )}
                  </div>
                </div>
                {p.file ? (
                  <a className="inline-flex items-center justify-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shrink-0" href={`/api/papers/${p.id}/download`} target="_blank" rel="noopener noreferrer">
                    {t("Download PDF")}
                  </a>
                ) : (
                  <span className="text-sm text-slate-400 italic shrink-0 px-4 py-2">{t("No File")}</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center">
                <form
                  className="flex flex-wrap items-center gap-2 flex-1"
                  action={async (fd) => {
                    "use server";
                    const decision = String(fd.get("decision") || "");
                    const note = String(fd.get("note") || "").trim();
                    const paperId = String(fd.get("paperId") || "");

                    if (!paperId) return;
                    if (!["UNDER_REVIEW", "APPROVED", "REJECTED"].includes(decision)) return;

                    await prisma.$transaction(async (tx) => {
                      await tx.paper.update({
                        where: { id: paperId },
                        data: { status: decision as PaperStatus },
                      });
                      await tx.paperReview.create({
                        data: {
                          paperId,
                          reviewerId: user.id,
                          decision: decision as PaperStatus,
                          note: note || null,
                        },
                      });
                    });
                  }}
                >
                  <input type="hidden" name="paperId" value={p.id} />
                  <select className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" name="decision" defaultValue="UNDER_REVIEW">
                    <option value="UNDER_REVIEW">{t("Mark: In Review")}</option>
                    <option value="APPROVED">{t("Approve")}</option>
                    <option value="REJECTED">{t("Reject")}</option>
                  </select>
                  <input
                    className="flex-1 min-w-[150px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    name="note"
                    placeholder={t("Optional note for author...")}
                  />
                  <button className="bg-blue-900 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors" type="submit">
                    {t("Submit Decision")}
                  </button>
                </form>

                <form
                  action={async () => {
                    "use server";
                    await prisma.paper.update({ where: { id: p.id }, data: { isActive: false } });
                  }}
                >
                  <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm font-medium transition-colors" type="submit">
                    {t("Hide (Inactive)")}
                  </button>
                </form>

                <form
                  action={async () => {
                    "use server";
                    const paper = await prisma.paper.findUnique({ where: { id: p.id }, include: { file: true } });
                    if (paper?.file?.path) {
                      const abs = path.join(process.cwd(), "uploads", paper.file.path);
                      await unlink(abs).catch(() => null);
                      await prisma.paperFile.delete({ where: { paperId: p.id } }).catch(() => null);
                    }
                    await prisma.paper.update({ where: { id: p.id }, data: { isActive: false, status: "REJECTED" } });
                    await prisma.paperReview.create({
                      data: { paperId: p.id, reviewerId: user.id, decision: "REJECTED", note: "admin_removed" },
                    });
                  }}
                >
                  <button className="bg-white border border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 px-4 py-2 rounded-md text-sm font-medium transition-colors" type="submit">
                    {t("Delete PDF & Hide")}
                  </button>
                </form>
              </div>
            </div>
          ))}
          {papers.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
              <p className="text-slate-500">{t("No papers currently pending review.")}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
