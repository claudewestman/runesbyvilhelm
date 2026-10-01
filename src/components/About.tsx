import { useTranslation } from 'react-i18next'
import siteConfig from '../config/site'
import './About.css'

export default function About() {
  const { t } = useTranslation()

  return (
    <section className="about">
      <div className="about__inner">
        <h2 className="about__title">{t('about.title')}</h2>
        <p className="about__text">{t('about.paragraph1', { artistName: siteConfig.artistName })}</p>
        <p className="about__text">{t('about.paragraph2')}</p>
        <div className="about__sep">
          <span className="about__sep-line" />
          <span className="about__sep-diamond" />
          <span className="about__sep-line" />
        </div>
        <p className="about__runes">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ · ᚼ ᚾ ᛁ ᛅ ᛋ ᛏ ᛒ ᛘ ᛚ ᛦ</p>
      </div>
    </section>
  )
}
