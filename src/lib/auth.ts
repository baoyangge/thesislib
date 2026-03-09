import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function requireUser() {
  const session = await getSession();
  if (!session.userId) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function signUp(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });
  const session = await getSession();
  session.userId = user.id;
  await session.save();
  return user;
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  const session = await getSession();
  session.userId = user.id;
  await session.save();
  return user;
}

export async function signOut() {
  const session = await getSession();
  session.destroy();
}
