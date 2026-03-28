"use client";

import { useEffect, useId, useState } from "react";
import { CalendlyButton } from "./calendly";
import { MobileNavigation } from "./site-navigation";

export function MobileNavDrawer({ user }: { user: { email?: string; id?: string } | null }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className={`mobile-menu-trigger ${open ? "mobile-menu-trigger-active" : ""}`}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`mobile-menu-icon ${open ? "mobile-menu-icon-open" : ""}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="mobile-menu-trigger-label">{open ? "Close" : "Menu"}</span>
      </button>

      {open ? (
        <>
          <div className="mobile-drawer-backdrop" onClick={() => setOpen(false)} aria-hidden />
          <aside
            id="mobile-nav-drawer"
            className="mobile-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="mobile-drawer-head">
              <p id={titleId} className="mobile-drawer-title">
                Menu
              </p>
              <button type="button" className="mobile-drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="mobile-drawer-scroll">
              <MobileNavigation user={user} onLinkClick={() => setOpen(false)} />
              <div className="mobile-drawer-cta">
                <CalendlyButton
                  className="button mobile-menu-cta"
                  label="Book a free consultation"
                  source="mobile_menu_cta"
                  mode="popup"
                />
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
