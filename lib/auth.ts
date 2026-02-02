import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "nbm_admin";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");

export async function setAdminSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function clearAdminSession() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function isAdminRequest() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
