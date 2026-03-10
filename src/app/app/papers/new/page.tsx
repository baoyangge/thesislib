export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewPaperPage() {
  const user = await requireUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto max-w-xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">上传论文（PDF）</h1>
          <Link className="underline text-sm" href="/">
            返回首页
          </Link>
        </header>

        <form className="space-y-3 rounded border border-zinc-200 bg-white p-4">
          <div className="text-sm text-zinc-600">先用下面的“浏览器提交”按钮（客户端）完成上传。</div>
          <input className="w-full rounded border p-2" name="title" placeholder="论文标题" />
          <input className="w-full rounded border p-2" name="category" placeholder="分类（可选，例如: NLP）" />
          <input className="w-full" name="file" type="file" accept="application/pdf" />

          <button
            className="rounded bg-black px-4 py-2 text-white"
            type="button"
            onClick={async () => {
              const form = document.querySelector("form") as HTMLFormElement | null;
              if (!form) return;
              const fd = new FormData(form);
              const res = await fetch("/api/papers/upload", { method: "POST", body: fd });
              const json = await res.json().catch(() => ({}));
              if (res.ok && json.paperId) window.location.href = `/app/papers?mine=1`;
              else alert(`上传失败: ${json.error || res.status}`);
            }}
          >
            提交上传
          </button>
        </form>
      </div>
    </div>
  );
}
