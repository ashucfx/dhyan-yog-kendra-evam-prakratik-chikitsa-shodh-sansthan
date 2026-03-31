"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getPasswordRequirementMessage, validatePassword } from "@/lib/customer-validation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function UpdatePasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/account";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  async function handleUpdatePassword() {
    if (!validatePassword(password)) {
      setMessageTone("error");
      setMessage(getPasswordRequirementMessage());
      return;
    }

    if (password !== confirmPassword) {
      setMessageTone("error");
      setMessage("Passwords do not match.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        throw error;
      }

      setMessageTone("success");
      setMessage("Password updated successfully. Redirecting...");
      window.setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
      }, 900);
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="admin-card auth-card">
        <p className="eyebrow">Update password</p>
        <h1>Create your password</h1>
        <p className="admin-copy">
          This works for both regular password resets and Google-authenticated users who want to enable email/password sign-in.
        </p>

        <div className="auth-form-grid">
          <input type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        <p className="microcopy">{getPasswordRequirementMessage()}</p>
        {message ? <p className={`form-status form-status-${messageTone}`}>{message}</p> : null}

        <button className="button" type="button" disabled={busy} onClick={() => void handleUpdatePassword()}>
          {busy ? "Updating..." : "Update password"}
        </button>

        <p className="microcopy">
          Need to sign in instead? <Link href={`/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`}>Go to sign in</Link>
        </p>
      </div>
    </section>
  );
}
