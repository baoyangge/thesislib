import type { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  userId?: string;
};

export const sessionOptions: SessionOptions = {
  cookieName: "thesislib_session",
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  if (!process.env.SESSION_PASSWORD || process.env.SESSION_PASSWORD.length < 32) {
    throw new Error("SESSION_PASSWORD must be set and at least 32 characters long");
  }
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
