"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-xl font-semibold">登录</h1>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const email = String(fd.get("email") || "");
            const password = String(fd.get("password") || "");
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            if (res.ok) window.location.href = "/";
            else {
              const json = await res.json().catch(() => ({}));
              alert(`登录失败：${json.error || "账号或密码不正确"}`);
            }
          }}
        >
          <input className="w-full rounded border p-2" name="email" placeholder="email" />
          <input className="w-full rounded border p-2" name="password" placeholder="password" type="password" />
          <button className="w-full rounded bg-black px-4 py-2 text-white" type="submit">
            登录
          </button>
        </form>
        <div className="text-sm">
          没有账号？ <Link className="underline" href="/auth/signup">去注册</Link>
        </div>
      </div>
    </div>
  );
}
