import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M6 18.5 20 7l14 11.5v14H6v-14Z" fill="currentColor" />
              <path d="M15 32.5V22h10v10.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m29 7 .8 2.2L32 10l-2.2.8L29 13l-.8-2.2L26 10l2.2-.8L29 7Z" fill="#F5AE69" />
            </svg>
          </span>
          <span>brightnest<span className="brand-light">cleaning</span></span>
        </Link>
        <p>A brighter kind of clean.<br />A demo concept for a U.S.-based service.</p>
        <Link className="footer-link" href="/contact">Contact the team <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BrightNest Cleaning. Development preview.</span>
        <span>Made with a little extra care <b>✳</b></span>
      </div>
    </footer>
  );
}
