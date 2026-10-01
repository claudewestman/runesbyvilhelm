import { useTranslation } from 'react-i18next'
import siteConfig from '../config/site'
import './Footer.css'
import { RUNES_TOP } from './Hero'


export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <p className="footer__runes">{RUNES_TOP}</p>
      <nav className="footer__social" aria-label="Social media">
        <a
          className="footer__social-link"
          href={siteConfig.social.instagramUrl}
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
          href={siteConfig.social.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FacebookIcon />
          Facebook
        </a>
      </nav>
      <form
        className="footer__newsletter"
        action={siteConfig.newsletter.buttondownUrl}
        method="post"
        target="_blank"
      >
        <label className="footer__newsletter-label" htmlFor="bd-email">
          {t('footer.newsletterLabel')}
        </label>
        <div className="footer__newsletter-row">
          <input
            type="email"
            name="email"
            id="bd-email"
            placeholder={t('footer.newsletterPlaceholder')}
            required
            className="footer__newsletter-input"
          />
          <button type="submit" className="footer__newsletter-btn">
            {t('footer.newsletterButton')}
          </button>
        </div>
      </form>
      <p className="footer__copy">{t('footer.copyright', { artistName: siteConfig.artistName })}</p>
      <p className="footer__legal">
        <a href="/privacy.html">{t('footer.privacyPolicy')}</a>
      </p>
      <p className="footer__runes">{t('footer.poweredBy')}</p>
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
