"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { validateEmail } from "@/lib/customer-validation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ForgotPasswordClient() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/account";
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  async function handleResetRequest() {
    if (!validateEmail(email)) {
      setMessageTone("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/update-password?redirectTo=${encodeURIComponent(redirectTo)}`
      });

      if (error) {
        throw error;
      }

      setMessageTone("success");
      setMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Unable to send password reset email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="admin-card auth-card">
        <p className="eyebrow">Reset password</p>
        <h1>Set or recover your password</h1>
        <p className="admin-copy">
          Use this for normal password recovery or if you signed up with Google and now want an email/password login.
        </p>

        <div className="auth-form-grid">
          <input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        {message ? <p className={`form-status form-status-${messageTone}`}>{message}</p> : null}

        <button className="button" type="button" disabled={busy} onClick={() => void handleResetRequest()}>
          {busy ? "Sending..." : "Send reset email"}
        </button>

        <p className="microcopy">
          Back to <Link href={`/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`}>Sign in</Link>
        </p>
      </div>
    </section>
  );
}
