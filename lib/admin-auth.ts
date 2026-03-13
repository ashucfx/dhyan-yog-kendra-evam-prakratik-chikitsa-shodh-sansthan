import { cookies } from "next/headers";

const adminCookieName = "dhyan_admin_session";

function getAdminSecret() {
  return process.env.ADMIN_ACCESS_KEY || "change-this-admin-key";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(adminCookieName)?.value;
  return session === getAdminSecret();
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, getAdminSecret(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function validateAdminPassword(password: string) {
  return password === getAdminSecret();
}
