export const dynamic = "force-dynamic";

import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-xl font-semibold">注册</h1>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const email = String(fd.get("email") || "");
            const password = String(fd.get("password") || "");
            const res = await fetch("/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            if (res.ok) window.location.href = "/";
            else alert("注册失败");
          }}
        >
          <input className="w-full rounded border p-2" name="email" placeholder="email" />
          <input
            className="w-full rounded border p-2"
            name="password"
            placeholder="password (>=8)"
            type="password"
          />
          <button className="w-full rounded bg-black px-4 py-2 text-white" type="submit">
            注册
          </button>
        </form>
        <div className="text-sm">
          已有账号？ <Link className="underline" href="/auth/login">去登录</Link>
        </div>
      </div>
    </div>
  );
}
