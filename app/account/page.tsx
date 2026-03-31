import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteShell } from "../components/site-shell";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { getUserProfile, listAddressesForUser, listOrdersForUser } from "@/lib/commerce";
import { AccountClient } from "./account-client";

export default async function AccountPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect("/auth/sign-in?redirectTo=/account");
  }

  const [orders, profile, addresses] = await Promise.all([
    listOrdersForUser(user.id),
    getUserProfile(user.id, {
      email: user.email,
      name: user.name,
      phone: user.phone
    }),
    listAddressesForUser(user.id)
  ]);

  return (
    <SiteShell>
      <main className="account-page">
        <section className="section account-shell page-end-section">
          <div className="account-overview">
            <div>
              <p className="eyebrow">My account</p>
              <h1>{profile.fullName || user.name || user.email}</h1>
              <p className="account-subtitle">
                {profile.email}
                {profile.phone ? ` | ${profile.phone}` : ""}
              </p>
            </div>
            <div className="account-overview-actions">
              <Link className="button button-secondary button-small" href="/account/orders">
                View orders
              </Link>
            </div>
          </div>

          <section className="account-summary-grid">
            <article className="account-summary-card">
              <span>Orders</span>
              <strong>{orders.length}</strong>
              <p>Total purchases linked to this account.</p>
            </article>
            <article className="account-summary-card">
              <span>Saved addresses</span>
              <strong>{addresses.length}</strong>
              <p>Delivery addresses ready for faster checkout.</p>
            </article>
            <article className="account-summary-card">
              <span>Primary email</span>
              <strong>{profile.email}</strong>
              <p>Used for sign-in, confirmations, and updates.</p>
            </article>
          </section>

          <AccountClient initialProfile={profile} initialAddresses={addresses} />
        </section>
      </main>
    </SiteShell>
  );
}
