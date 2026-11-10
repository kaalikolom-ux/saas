import { D1Database, User } from "../types";

export const SALT = "notabene_saas_secure_salt_2026";

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(SALT + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string, expectedHash: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === expectedHash;
}

export async function createSession(db: D1Database, userId: number): Promise<string> {
  const sessionId = "sess_" + crypto.randomUUID().replace(/-/g, "") + "_" + Date.now();
  // 30 days expiry
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await db
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, userId, expiresAt)
    .run();

  return sessionId;
}

export async function getUserFromSession(db: D1Database, sessionId: string): Promise<User | null> {
  if (!sessionId) return null;

  const res = await db
    .prepare(
      `SELECT u.* FROM users u
       JOIN sessions s ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
    .bind(sessionId)
    .first<User>();

  return res || null;
}

export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
  if (!sessionId) return;
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}
