"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";
import { NavIcon } from "./nav-icons";

type SiteNavigationProps = {
  user: { email?: string; id?: string } | null;
};

const primaryNav = [
  { label: "Programs", href: "/programs" },
  { label: "Batches", href: "/batches" },
  { label: "Join", href: "/join" }
];

export function SiteNavigation({ user }: SiteNavigationProps) {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="main-nav" aria-label="Primary">
      <div className="nav-group nav-primary">
        {primaryNav.map((item) => (
          <Link 
            key={item.label} 
            href={item.href}
            className={pathname === item.href ? "active-link" : ""}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="nav-group nav-commerce">
        <Link 
          href="/store" 
          className={`nav-icon-link ${pathname === "/store" ? "active-link" : ""}`} 
          title="Store"
        >
          <NavIcon type="shop" className="nav-icon" />
          <span className="nav-icon-label">Shop</span>
        </Link>
        
        <Link 
          href="/cart" 
          className={`nav-icon-link ${pathname === "/cart" ? "active-link" : ""}`} 
          title="Cart"
        >
          <div className="cart-icon-wrapper">
            <NavIcon type="cart" className="nav-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <span className="nav-icon-label">Cart</span>
        </Link>

        <Link 
          href={user ? "/account" : "/auth/sign-in"} 
          className={`nav-icon-link ${pathname.startsWith("/account") || pathname.startsWith("/auth") ? "active-link" : ""}`} 
          title={user ? "Account" : "Sign In"}
        >
          <NavIcon type="account" className="nav-icon" />
          <span className="nav-icon-label">{user ? "Account" : "Sign In"}</span>
        </Link>
      </div>
    </nav>
  );
}

export function MobileNavigation({ user, onLinkClick }: SiteNavigationProps & { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="mobile-nav" aria-label="Mobile primary">
      <Link href="/" onClick={onLinkClick} className={pathname === "/" ? "active-link" : ""}>About DYK</Link>
      {primaryNav.map((item) => (
        <Link 
          key={item.label} 
          href={item.href} 
          onClick={onLinkClick}
          className={pathname === item.href ? "active-link" : ""}
        >
          {item.label}
        </Link>
      ))}
      <Link href="/stories" onClick={onLinkClick} className={pathname === "/stories" ? "active-link" : ""}>Stories</Link>
      
      <div className="mobile-nav-divider" />
      
      <Link href="/store" onClick={onLinkClick} className={`mobile-nav-commerce ${pathname === "/store" ? "active-link" : ""}`}>
        <NavIcon type="shop" className="nav-icon-small" />
        <span>Shop Wellness</span>
      </Link>
      <Link href="/cart" onClick={onLinkClick} className={`mobile-nav-commerce ${pathname === "/cart" ? "active-link" : ""}`}>
        <div className="cart-icon-wrapper">
          <NavIcon type="cart" className="nav-icon-small" />
          {cartCount > 0 && <span className="cart-badge-small">{cartCount}</span>}
        </div>
        <span>My Cart</span>
      </Link>
      <Link href={user ? "/account" : "/auth/sign-in"} onClick={onLinkClick} className={`mobile-nav-commerce ${pathname.startsWith("/account") || pathname.startsWith("/auth") ? "active-link" : ""}`}>
        <NavIcon type="account" className="nav-icon-small" />
        <span>{user ? "My Account" : "Sign In"}</span>
      </Link>
    </nav>
  );
}
