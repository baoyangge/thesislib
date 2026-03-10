export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PaperStatus } from "@prisma/client";

export default async function AdminPage() {
  const user = await requireUser();
  if (!user) redirect("/auth/login");
  if (!user.isAdmin) redirect("/");

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

        <div className="space-y-3">
          {papers.map((p) => (
            <div key={p.id} className="rounded border border-zinc-200 bg-white p-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-zinc-500">
                    作者：{p.author.email} · 分类：{p.category?.slug || "-"} · 状态：{p.status}
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
                <input className="flex-1 min-w-48 rounded border px-2 py-1 text-sm" name="note" placeholder="备注（可选）" />
                <button className="rounded bg-black px-3 py-1.5 text-sm text-white" type="submit">
                  提交
                </button>
              </form>
            </div>
          ))}
          {papers.length === 0 ? <div className="text-sm text-zinc-500">暂无待审核论文</div> : null}
        </div>
      </div>
    </div>
  );
}
