export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UploadPaperForm from "./UploadPaperForm";

export default async function NewPaperPage() {
  const user = await requireUser();
  if (!user || !user.isAdmin) redirect("/");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900">
      <div className="mx-auto max-w-xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">上传论文（PDF）</h1>
          <Link className="underline text-sm" href="/">
            返回首页
          </Link>
        </header>

        <UploadPaperForm categories={categories} />
      </div>
    </div>
  );
}
