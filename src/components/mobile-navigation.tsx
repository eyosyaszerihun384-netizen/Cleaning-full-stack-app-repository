"use client";

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
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#how-it-works" onClick={closeMenu}>How it works</a>
        <a href="#about" onClick={closeMenu}>About us</a>
        <a className="button button-small button-dark nav-cta" href="#quote" onClick={closeMenu}>
          Get a free estimate <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </>
  );
}
