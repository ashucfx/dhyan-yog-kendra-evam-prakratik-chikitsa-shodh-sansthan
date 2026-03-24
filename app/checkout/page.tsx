import { SiteShell } from "../components/site-shell";
import { loadCommerceSnapshot } from "@/lib/commerce";
import { CheckoutClient } from "./checkout-client";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/auth/sign-in?redirectTo=/checkout");
  }

  const snapshot = await loadCommerceSnapshot();

  return (
    <SiteShell>
      <CheckoutClient
        products={snapshot.products}
        coupons={snapshot.coupons}
        settings={snapshot.settings}
        initialName={user.name}
        initialEmail={user.email}
        initialPhone={user.phone}
      />
    </SiteShell>
  );
}
