"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="primary-nav"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
      <nav
        className={`primary-nav${isOpen ? " is-open" : ""}`}
        id="primary-nav"
        aria-label="Main navigation"
      >
        <Link href="/services" onClick={closeMenu}>Services</Link>
        <Link href="/#how-it-works" onClick={closeMenu}>How it works</Link>
        <Link href="/about" onClick={closeMenu}>About us</Link>
        <Link href="/contact" onClick={closeMenu}>Contact</Link>
        <Link className="button button-small button-dark nav-cta" href="/#quote" onClick={closeMenu}>
          Get a free estimate <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </>
  );
}
