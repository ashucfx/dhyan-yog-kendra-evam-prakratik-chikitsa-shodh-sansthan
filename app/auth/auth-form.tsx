"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getPasswordRequirementMessage, validateEmail, validateIndianMobile, validatePassword } from "@/lib/customer-validation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const redirectTo = searchParams.get("redirectTo") || "/account";

  async function handleSubmit() {
    if (!validateEmail(email)) {
      setMessageTone("error");
      setMessage("Enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setMessageTone("error");
      setMessage("Email and password are required.");
      return;
    }

    if (mode === "sign-up" && !fullName.trim()) {
      setMessageTone("error");
      setMessage("Full name is required for account creation.");
      return;
    }

    if (mode === "sign-up" && phone && !validateIndianMobile(phone)) {
      setMessageTone("error");
      setMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (mode === "sign-up" && !validatePassword(password)) {
      setMessageTone("error");
      setMessage(getPasswordRequirementMessage());
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            data: {
              full_name: fullName,
              phone
            }
          }
        });

        if (error) {
          throw error;
        }

        setMessageTone("success");
        setMessage("Account created. Check your email to confirm your sign-up.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Unable to continue.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        }
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Unable to continue with Google.");
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="admin-card auth-card">
        <p className="eyebrow">{mode === "sign-up" ? "Create account" : "Sign in"}</p>
        <h1>{mode === "sign-up" ? "Create your customer account" : "Welcome back"}</h1>
        <p className="admin-copy">
          {mode === "sign-up"
            ? "Use email/password or Google SSO so cart, checkout, and orders stay connected to one account."
            : "Sign in to access your cart, saved details, and order history."}
        </p>

        <div className="auth-form-grid">
          {mode === "sign-up" ? (
            <>
              <input placeholder="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
              <input placeholder="Mobile number" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </>
          ) : null}
          <input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>

        {mode === "sign-up" ? <p className="microcopy">{getPasswordRequirementMessage()}</p> : null}

        {message ? <p className={`form-status form-status-${messageTone}`}>{message}</p> : null}

        <button className="button" type="button" disabled={busy} onClick={handleSubmit}>
          {busy ? "Please wait..." : mode === "sign-up" ? "Create Account" : "Sign In"}
        </button>
        <button className="button button-secondary" type="button" disabled={busy} onClick={handleGoogle}>
          Continue with Google
        </button>

        <p className="microcopy">
          {mode === "sign-up" ? "Already have an account?" : "Need a new account?"}{" "}
          <Link href={mode === "sign-up" ? `/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}` : `/auth/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`}>
            {mode === "sign-up" ? "Sign in" : "Create one"}
          </Link>
        </p>
        {mode === "sign-in" ? (
          <p className="microcopy">
            Forgot your password or created your account with Google?{" "}
            <Link href={`/auth/forgot-password?redirectTo=${encodeURIComponent(redirectTo)}`}>Reset password</Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
