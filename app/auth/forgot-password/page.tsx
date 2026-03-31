import { Suspense } from "react";
import { ForgotPasswordClient } from "./forgot-password-client";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="loading-state">Loading...</div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
