import { useTranslation } from 'react-i18next'
import siteConfig from '../config/site'
import './Hero.css'

export const RUNES_TOP = 'ᚠ ᚢ ᚦ ᚬ ᚱ ᚴ ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <header className="hero">
      <div className="hero__inner">
        <p className="hero__runes">{RUNES_TOP}</p>
        <h1 className="hero__title">{siteConfig.siteName}</h1>
        <p className="hero__name">{siteConfig.artistName}</p>
        <Separator />
        <p className="hero__bio">{t('hero.bio')}</p>
        <p className="hero__runes hero__runes--bottom">
          ᚢᛁᛚᚼᛁᛅᛚᛘᛦ · ᚴᛁᛅᚱᚦᛁ · ᚱᚢᚾᛅᛦ ᚦᛁᛋᛅᛦ
        </p>
      </div>
    </header>
  )
}

function Separator() {
  return (
    <div className="sep">
      <span className="sep__line" />
      <span className="sep__diamond" />
      <span className="sep__line" />
    </div>
  )
}
