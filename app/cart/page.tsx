import { SiteShell } from "../components/site-shell";
import { loadCommerceSnapshot } from "@/lib/commerce";
import { CartClient } from "./cart-client";

export default async function CartPage() {
  const snapshot = await loadCommerceSnapshot();

  return (
    <SiteShell>
      <CartClient products={snapshot.products} settings={snapshot.settings} />
    </SiteShell>
  );
}
