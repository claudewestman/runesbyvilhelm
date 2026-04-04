import './Footer.css'

const RUNES_TOP = 'ᚠ ᚢ ᚦ ᚬ ᚱ ᚴ ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__runes">{RUNES_TOP}</p>
      <p className="footer__copy">© Vilhelm Westman — All rights reserved</p>
      <p className="footer__runes">Powered by Kattbjörn</p>
    </footer>
  )
}
