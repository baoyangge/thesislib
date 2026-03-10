import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const category = String(form.get("category") || "").trim();
  const file = form.get("file");

  if (!title) return NextResponse.json({ ok: false, error: "missing_title" }, { status: 400 });
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "missing_file" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ ok: false, error: "only_pdf" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const result = await prisma.$transaction(async (tx) => {
    const cat = category
      ? await tx.category.upsert({
          where: { slug: category.toLowerCase().replace(/\s+/g, "-") },
          update: { name: category },
          create: { name: category, slug: category.toLowerCase().replace(/\s+/g, "-") },
        })
      : null;

    const paper = await tx.paper.create({
      data: {
        title,
        authorId: user.id,
        categoryId: cat?.id,
      },
    });

    return { paper, cat };
  });

  const uploadsDir = path.join(process.cwd(), "uploads", "papers");
  await mkdir(uploadsDir, { recursive: true });
  const filename = `${result.paper.id}.pdf`;
  const relPath = path.join("papers", filename);
  const absPath = path.join(process.cwd(), "uploads", relPath);
  await writeFile(absPath, bytes);

  await prisma.paperFile.create({
    data: {
      paperId: result.paper.id,
      filename: file.name || filename,
      mimeType: file.type,
      sizeBytes: bytes.length,
      path: relPath,
    },
  });

  return NextResponse.json({ ok: true, paperId: result.paper.id });
}
