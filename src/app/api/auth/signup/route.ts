import { NextResponse } from "next/server";
import { z } from "zod";
import { signUp } from "@/lib/auth";

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

  try {
    await signUp(parsed.data.email, parsed.data.password);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "signup_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
