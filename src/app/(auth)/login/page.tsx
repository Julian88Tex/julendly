// OWNER: foundation-auth. Stub created by foundation; the owner replaces the implementation and must keep these signatures.
//
// /login (ARCHITECTURE section 3.1, SPEC AU-04, walkthrough 3.2): "Log in to your account" card with Google and
// Microsoft (when configured), divider "or", the two-step email and password form, and the footer "Don't have an
// account? Sign up for free" (hidden when signups are closed). ?next= returns to a same-site path after login;
// ?error= shows an OAuth callback message. Signed-in visitors go straight to `next`.
import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { redirectIfSignedIn } from "@/lib/auth/guards";
import { JSLICE_APP_ID, jsliceUrl } from "@/lib/auth/jslice";
import { oauthErrorFromSearchParams, oauthErrorMessage } from "@/lib/auth/oauth/errors";
import { getSignupAvailability } from "@/lib/auth/policy";
import { getFeatures } from "@/lib/env";
import { safeNextPath } from "@/lib/url";
import { AuthShell } from "../_components/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in to your account", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LogInToYourAccountPage({ searchParams }: Props) {
  const sp = await searchParams;
  const rawNext = typeof sp.next === "string" ? sp.next : null;
  await redirectIfSignedIn(rawNext);
  const next = rawNext ? safeNextPath(rawNext, "") || null : null;
  const features = getFeatures();
  const availability = await getSignupAvailability();
  const oauthError = oauthErrorFromSearchParams(sp);
  const jslice = jsliceUrl();
  // Single sign in: quietly ask JSlice first. It sends a signed-in visitor straight back signed in, and everyone else
  // back here with ?jslice=none so the normal login shows. Errors and a fresh log out skip the attempt.
  if (jslice && !oauthError && sp.jslice !== "none") {
    redirect(`${jslice}/launch/${JSLICE_APP_ID}?silent=1&next=${encodeURIComponent(next ?? "/app/scheduling")}` as Route);
  }
  return (
    <AuthShell
      title="Log in to your account"
      footer={
        availability.open ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary-text hover:underline">
              Sign up for free
            </Link>
          </p>
        ) : null
      }
    >
      {jslice && (
        <a
          href={`${jslice}/?app=${JSLICE_APP_ID}&next=${encodeURIComponent(next ?? "/app/scheduling")}`}
          className={buttonClassName({ variant: "secondary", fullWidth: true, className: "mb-3" })}
        >
          Continue with JSlice
        </a>
      )}
      <LoginForm
        next={next}
        showSignupLink={availability.open}
        providers={{ google: features.googleOAuth, microsoft: features.microsoftOAuth }}
        initialError={oauthError ? oauthErrorMessage(oauthError.code, { provider: oauthError.provider }) : null}
      />
    </AuthShell>
  );
}
