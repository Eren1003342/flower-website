import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "eleanor_admin_session";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "123456";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "eleanor-admin-secret";

function sign(username: string) {
  return createHmac("sha256", ADMIN_SECRET).update(username).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyCredentials(username: string, password: string) {
  return safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);
}

export function createSessionToken(username: string) {
  return `${username}.${sign(username)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) {
    return false;
  }

  const [username, signature] = token.split(".");
  if (!username || !signature) {
    return false;
  }

  return safeEqual(signature, sign(username));
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
