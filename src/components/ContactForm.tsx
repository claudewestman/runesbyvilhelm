import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import siteConfig from '../config/site'
import './ContactForm.css'

// Sign up at formspree.io, create a form and paste your endpoint here:
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqeggllb'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <h2 className="contact__title">{t('contact.title')}</h2>
        <p className="contact__lead">
          {t('contact.lead')}{' '}
          <strong className="contact__price">{t('contact.price')}</strong>.
        </p>

        {status === 'success' ? (
          <div className="contact__success">
            <span className="contact__success-rune">ᛉ</span>
            <p>{t('contact.success', { artistName: siteConfig.artistName })}</p>
          </div>
        ) : (
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="form-row form-row--half">
              <div className="form-group">
                <label className="form-label" htmlFor="cf-name">{t('contact.fields.name')}</label>
                <input
                  className="form-input"
                  id="cf-name"
                  name="name"
                  type="text"
                  placeholder={t('contact.fields.namePlaceholder')}
                  required
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cf-email">{t('contact.fields.email')}</label>
                <input
                  className="form-input"
                  id="cf-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  disabled={status === 'submitting'}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cf-motif">{t('contact.fields.motif')}</label>
              <input
                className="form-input"
                id="cf-motif"
                name="motif"
                type="text"
                placeholder={t('contact.fields.motifPlaceholder')}
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-row form-row--half">
              <div className="form-group">
                <label className="form-label" htmlFor="cf-size">{t('contact.fields.size')}</label>
                <input
                  className="form-input"
                  id="cf-size"
                  name="size"
                  type="text"
                  placeholder={t('contact.fields.sizePlaceholder')}
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cf-colours">{t('contact.fields.colours')}</label>
                <input
                  className="form-input"
                  id="cf-colours"
                  name="colours"
                  type="text"
                  placeholder={t('contact.fields.coloursPlaceholder')}
                  disabled={status === 'submitting'}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cf-message">{t('contact.fields.message')}</label>
              <textarea
                className="form-input form-input--textarea"
                id="cf-message"
                name="message"
                rows={4}
                placeholder={t('contact.fields.messagePlaceholder', { artistName: siteConfig.artistName })}
                disabled={status === 'submitting'}
              />
            </div>

            {status === 'error' && (
              <p className="contact__error">{t('contact.error')}</p>
            )}

            <button
              className="contact__submit"
              type="submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? t('contact.submitting') : t('contact.submit')}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
