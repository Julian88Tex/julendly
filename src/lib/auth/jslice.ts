// OWNER: foundation-auth.
//
// JSlice single sign in (https://github.com/Julian88Tex/JSlice, docs/INTEGRATION.md). JSlice signs the user in with
// Google and sends them to /api/auth/jslice with a one minute ES256 token whose `sub` is the Google subject, so the
// account resolves exactly like a "Continue with Google" login. Off unless JSLICE_URL is set.
import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { OAuthProfile } from "./oauth/types";

export const JSLICE_APP_ID = "julendly";

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export function jsliceUrl(): string | null {
  return process.env.JSLICE_URL?.trim().replace(/\/$/, "") || null;
}

export async function verifyJSliceToken(token: string): Promise<OAuthProfile> {
  const issuer = jsliceUrl();
  if (!issuer) throw new Error("JSLICE_URL is not set");
  jwks ??= createRemoteJWKSet(new URL("/.well-known/jwks.json", issuer));
  const { payload } = await jwtVerify(token, jwks, { issuer, audience: JSLICE_APP_ID, algorithms: ["ES256"], maxTokenAge: "2m" });
  if (!payload.sub || typeof payload.email !== "string") throw new Error("JSlice token is missing claims");
  return {
    providerAccountId: payload.sub,
    email: payload.email,
    // JSlice only signs in Google accounts with a verified email.
    emailVerified: true,
    name: typeof payload.name === "string" ? payload.name : null,
    avatarUrl: typeof payload.picture === "string" ? payload.picture : null,
  };
}
