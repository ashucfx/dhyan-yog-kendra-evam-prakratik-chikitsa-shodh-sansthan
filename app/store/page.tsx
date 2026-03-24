import { SiteShell } from "../components/site-shell";
import { loadCommerceSnapshot } from "@/lib/commerce";
import { StorefrontClient } from "./storefront-client";

export default async function StorePage() {
  const snapshot = await loadCommerceSnapshot();

  return (
    <SiteShell>
      <StorefrontClient products={snapshot.products} categories={snapshot.categories} settings={snapshot.settings} />
    </SiteShell>
  );
}
