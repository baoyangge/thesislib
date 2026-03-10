import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  const user = await requireUser();

  const paper = await prisma.paper.findUnique({
    where: { id: paperId },
    include: { file: true },
  });
  if (!paper || !paper.file) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const canDownload =
    paper.status === "APPROVED" ||
    (user && (user.isAdmin || user.id === paper.authorId));

  if (!canDownload) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const abs = path.join(process.cwd(), "uploads", paper.file.path);
  const bytes = await readFile(abs);

  // Count views (best-effort)
  prisma.paper
    .update({ where: { id: paper.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => null);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": paper.file.mimeType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
        paper.file.filename || "paper.pdf",
      )}`,
    },
  });
}
