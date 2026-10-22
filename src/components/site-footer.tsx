import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer crown-footer">
      <div className="container crown-footer-grid">
        <div>
          <Link className="brand crown-brand" href="/">
            <span className="brand-mark" aria-hidden="true">♛</span>
            <span>Crown <span className="brand-light">Cleaning Solutions</span></span>
          </Link>
          <p>Regular and deep cleaning information for customers in Aurora and Denver, Colorado.</p>
        </div>
        <div className="crown-footer-links">
          <Link href="/services">Cleaning services</Link>
          <Link href="/about">About Crown</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/#quote">Request an estimate</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Crown Cleaning Solutions.</span>
        <span>Estimate requests require team follow-up.</span>
      </div>
    </footer>
  );
}
