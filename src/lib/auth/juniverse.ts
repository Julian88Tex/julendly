// OWNER: foundation-auth.
//
// Juniverse single sign in (https://github.com/Julian88Tex/Juniverse, docs/INTEGRATION.md). Juniverse signs the user in with
// Google and sends them to /api/auth/juniverse with a one minute ES256 token whose `sub` is the Google subject, so the
// account resolves exactly like a "Continue with Google" login. Off unless JUNIVERSE_URL is set.
import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { OAuthProfile } from "./oauth/types";

export const JUNIVERSE_APP_ID = "julendly";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export function juniverseUrl(): string | null {
  return process.env.JUNIVERSE_URL?.trim().replace(/\/$/, "") || null;
}

export async function verifyJuniverseToken(token: string): Promise<OAuthProfile> {
  const issuer = juniverseUrl();
  if (!issuer) throw new Error("JUNIVERSE_URL is not set");
  jwks ??= createRemoteJWKSet(new URL("/.well-known/jwks.json", issuer));
  const { payload } = await jwtVerify(token, jwks, { issuer, audience: JUNIVERSE_APP_ID, algorithms: ["ES256"], maxTokenAge: "2m" });
  if (!payload.sub || typeof payload.email !== "string") throw new Error("Juniverse token is missing claims");
  return {
    providerAccountId: payload.sub,
    email: payload.email,
    // Juniverse only signs in Google accounts with a verified email.
    emailVerified: true,
    name: typeof payload.name === "string" ? payload.name : null,
    avatarUrl: typeof payload.picture === "string" ? payload.picture : null,
  };
}
