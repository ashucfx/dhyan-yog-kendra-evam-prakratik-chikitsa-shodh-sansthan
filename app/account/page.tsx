import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteShell } from "../components/site-shell";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { listOrdersForUser } from "@/lib/commerce";
import { AccountClient } from "./account-client";

export default async function AccountPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/auth/sign-in?redirectTo=/account");
  }

  const orders = await listOrdersForUser(user.id);

  return (
    <SiteShell>
      <main className="admin-page">
        <section className="admin-shell">
          <div className="admin-header">
            <div>
              <p className="eyebrow">My account</p>
              <h1>{user.name || user.email}</h1>
              <p className="admin-copy">
                {user.email}
                {user.phone ? ` | ${user.phone}` : ""}
              </p>
            </div>
            <div className="admin-actions">
              <Link className="button button-secondary button-small" href="/account/orders">
                My Orders
              </Link>
              <AccountClient />
            </div>
          </div>

          <section className="commerce-admin-grid">
            <article className="admin-insight-card">
              <p className="admin-kicker">Orders</p>
              <strong>{orders.length}</strong>
              <span>Total account-linked orders.</span>
            </article>
            <article className="admin-insight-card">
              <p className="admin-kicker">Account email</p>
              <strong>{user.email}</strong>
              <span>Used for order confirmations and sign-in.</span>
            </article>
          </section>
        </section>
      </main>
    </SiteShell>
  );
}
