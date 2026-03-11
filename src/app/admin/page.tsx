export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PaperStatus } from "@prisma/client";
import { unlink } from "node:fs/promises";
import path from "node:path";

export default async function AdminPage() {
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
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">管理员审核</h1>
          <div className="flex gap-3 text-sm">
            <Link className="underline" href="/">
              首页
            </Link>
            <Link className="underline" href="/app/papers">
              论文列表
            </Link>
          </div>
        </header>

        <section className="rounded border border-zinc-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">分类管理</div>
            <div className="text-xs text-zinc-500">上传论文时也可自动生成分类（按 slug）</div>
          </div>

          <form
            className="flex flex-wrap gap-2"
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
            <input className="rounded border px-2 py-1 text-sm" name="name" placeholder="分类名 (例如: NLP)" />
            <input className="rounded border px-2 py-1 text-sm" name="slug" placeholder="slug (可选: nlp)" />
            <button className="rounded bg-black px-3 py-1.5 text-sm text-white" type="submit">
              新增/更新
            </button>
          </form>

          <div className="flex flex-wrap gap-2 text-sm">
            {categories.length === 0 ? (
              <span className="text-zinc-500">暂无分类</span>
            ) : (
              categories.map((c) => (
                <form
                  key={c.id}
                  action={async () => {
                    "use server";
                    await prisma.category.delete({ where: { id: c.id } });
                  }}
                >
                  <button className="rounded border px-2 py-1" type="submit">
                    {c.slug} <span className="text-zinc-400">×</span>
                  </button>
                </form>
              ))
            )}
          </div>
        </section>

        <div className="space-y-3">
          {papers.map((p) => (
            <div key={p.id} className="rounded border border-zinc-200 bg-white p-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-zinc-500">
                    作者：{p.author.email} · 分类：{p.category?.slug || "-"} · 状态：{p.status} ·
                    {p.isActive ? (
                      <span className="ml-1 rounded bg-green-100 px-1.5 py-0.5 text-green-800">上架</span>
                    ) : (
                      <span className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-700">已下架</span>
                    )}
                  </div>
                </div>
                {p.file ? (
                  <a className="underline text-sm" href={`/api/papers/${p.id}/download`}>
                    下载PDF
                  </a>
                ) : (
                  <span className="text-sm text-zinc-400">无文件</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <form
                  className="flex flex-wrap items-center gap-2"
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
                  <select className="rounded border px-2 py-1 text-sm" name="decision" defaultValue="UNDER_REVIEW">
                    <option value="UNDER_REVIEW">标记：审核中</option>
                    <option value="APPROVED">通过</option>
                    <option value="REJECTED">拒绝</option>
                  </select>
                  <input
                    className="flex-1 min-w-48 rounded border px-2 py-1 text-sm"
                    name="note"
                    placeholder="备注（可选）"
                  />
                  <button className="rounded bg-black px-3 py-1.5 text-sm text-white" type="submit">
                    提交
                  </button>
                </form>

              <form
                action={async () => {
                  "use server";
                  await prisma.paper.update({ where: { id: p.id }, data: { isActive: false } });
                }}
              >
                <button className="rounded border px-3 py-1.5 text-sm" type="submit">
                  下架
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
                <button className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700" type="submit">
                  删除PDF并下架
                </button>
              </form>
              </div>
            </div>
          ))}
          {papers.length === 0 ? <div className="text-sm text-zinc-500">暂无待审核论文</div> : null}
        </div>
      </div>
    </div>
  );
}
