import { SiteShell } from "../components/site-shell";
import { loadCommerceSnapshot } from "@/lib/commerce";
import { CartClient } from "./cart-client";

export default async function CartPage() {
  const snapshot = await loadCommerceSnapshot();

  return (
    <SiteShell>
      <main className="cart-page-shell">
        <CartClient products={snapshot.products} settings={snapshot.settings} />
      </main>
    </SiteShell>
  );
}
