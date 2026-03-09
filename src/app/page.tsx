export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { signOut } from "@/lib/auth";

export default async function Home() {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">论文期刊库 (MVP)</h1>
          <p className="text-sm text-zinc-600">支持登录认证、论文上传/下载、管理员审核与状态追踪。</p>
        </header>

        {!user ? (
          <div className="flex gap-3">
            <Link className="rounded bg-black px-4 py-2 text-white" href="/auth/signup">
              注册
            </Link>
            <Link className="rounded border border-zinc-300 px-4 py-2" href="/auth/login">
              登录
            </Link>
          </div>
        ) : (
          <div className="rounded border border-zinc-200 bg-white p-4 space-y-2">
            <div className="text-sm">
              当前账号：<span className="font-medium">{user.email}</span>
            </div>
            <div className="text-sm">
              角色：
              {user.isAdmin ? (
                <span className="ml-2 rounded bg-purple-100 px-2 py-0.5 text-purple-800">管理员</span>
              ) : (
                <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-zinc-800">普通用户</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link className="rounded border border-zinc-300 px-3 py-1.5" href="/app/papers">
                浏览论文
              </Link>
              <Link className="rounded bg-black px-3 py-1.5 text-white" href="/app/papers/new">
                上传论文
              </Link>
              {user.isAdmin ? (
                <Link className="rounded border border-zinc-300 px-3 py-1.5" href="/admin">
                  管理员审核
                </Link>
              ) : null}
            </div>

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="text-sm text-zinc-500 hover:underline" type="submit">
                退出登录
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
