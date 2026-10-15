import Link from "next/link";
import MobileNavigation from "@/components/mobile-navigation";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label="BrightNest Cleaning home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M6 18.5 20 7l14 11.5v14H6v-14Z" fill="currentColor" />
              <path d="M15 32.5V22h10v10.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m29 7 .8 2.2L32 10l-2.2.8L29 13l-.8-2.2L26 10l2.2-.8L29 7Z" fill="#F5AE69" />
            </svg>
          </span>
          <span>brightnest<span className="brand-light">cleaning</span></span>
        </Link>
        <MobileNavigation />
      </div>
    </header>
  );
}
