import { SiteShell } from "../components/site-shell";
import { loadCommerceSnapshot } from "@/lib/commerce";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const snapshot = await loadCommerceSnapshot();

  return (
    <SiteShell>
      <CheckoutClient products={snapshot.products} coupons={snapshot.coupons} settings={snapshot.settings} />
    </SiteShell>
  );
}
