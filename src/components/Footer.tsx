import './Footer.css'

const RUNES_TOP = 'ᚠ ᚢ ᚦ ᚬ ᚱ ᚴ ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__runes">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ · ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ</p>
      <nav className="footer__social" aria-label="Social media">
        <a
          className="footer__social-link"
          href="https://www.instagram.com/runesbyvilhelm/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <InstagramIcon />
          Instagram
        </a>
        <span className="footer__social-sep" aria-hidden="true">·</span>
        <a
          className="footer__social-link"
          href="https://www.facebook.com/runesbyvilhelm/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FacebookIcon />
          Facebook
        </a>
      </nav>
      <p className="footer__copy">© Vilhelm Westman — All rights reserved</p>
      <p className="footer__runes">Powered by Kattbjörn</p>
    </footer>
  )
}

function InstagramIcon() {
  return (
    <svg className="footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}
