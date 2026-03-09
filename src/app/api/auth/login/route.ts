import { NextResponse } from "next/server";
import { z } from "zod";
import { signIn } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await signIn(parsed.data.email, parsed.data.password);
  if (!user) return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
