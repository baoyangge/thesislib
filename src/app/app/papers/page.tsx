export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

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
  if (mine) {
    if (!user) {
      // if not logged in, show empty mine
      where.authorId = "__none__";
    } else {
      where.authorId = user.id;
    }
  }
  if (category) {
    where.category = { slug: category };
  }

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
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{mine ? "我的论文" : "热门论文"}</h1>
          <div className="flex gap-3 text-sm">
            <Link className="underline" href="/">
              首页
            </Link>
            <Link className="underline" href="/app/papers/new">
              上传
            </Link>
            <Link className="underline" href="/app/papers?mine=1">
              我的
            </Link>
          </div>
        </header>

        <div className="rounded border border-zinc-200 bg-white p-4 text-sm">
          <div className="font-medium mb-2">筛选</div>
          <div className="flex flex-wrap gap-2">
            <Link className="underline" href={mine ? "/app/papers?mine=1" : "/app/papers"}>
              全部
            </Link>
            <span className="text-zinc-400">|</span>
            <Link className="underline" href={`${mine ? "/app/papers?mine=1&" : "/app/papers?"}category=nlp`}>
              nlp
            </Link>
            <Link
              className="underline"
              href={`${mine ? "/app/papers?mine=1&" : "/app/papers?"}category=systems`}
            >
              systems
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {papers.map((p) => {
            const latest = p.reviews[0];
            const statusCn: Record<string, string> = {
              SUBMITTED: "已提交",
              UNDER_REVIEW: "审核中",
              APPROVED: "已通过",
              REJECTED: "已拒绝",
            };

            return (
              <div key={p.id} className="rounded border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-zinc-500">
                      分类：{p.category?.slug || "-"} · 状态：{statusCn[p.status] || p.status} · 浏览：{p.viewCount}
                    </div>
                    {mine ? (
                      <div className="mt-1 text-xs text-zinc-600">
                        最近审核：
                        {latest ? (
                          <span>
                            {latest.decision ? statusCn[String(latest.decision)] || String(latest.decision) : "-"}
                            {latest.note ? `（${latest.note}）` : ""} · {new Date(latest.createdAt).toLocaleString()}
                          </span>
                        ) : (
                          <span>暂无</span>
                        )}
                      </div>
                    ) : null}
                  </div>
                <div className="text-sm">
                  {p.file ? (
                    <a className="underline" href={`/api/papers/${p.id}/download`}>
                      下载 PDF
                    </a>
                  ) : (
                    <span className="text-zinc-400">无文件</span>
                  )}
                </div>
              </div>
            </div>
          );
          })}
          {papers.length === 0 ? <div className="text-sm text-zinc-500">暂无内容</div> : null}
        </div>
      </div>
    </div>
  );
}
