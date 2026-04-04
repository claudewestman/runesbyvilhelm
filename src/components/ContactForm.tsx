import { useState } from 'react'
import './ContactForm.css'

// Sign up at formspree.io, create a form and paste your endpoint here:
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
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
        <h2 className="contact__title">Commission a Custom Piece</h2>
        <p className="contact__lead">
          Every piece is unique – carved and painted by hand with your chosen motif,
          runic text and colours. Custom commissions start at{' '}
          <strong className="contact__price">3,000 kr</strong>.
        </p>

        {status === 'success' ? (
          <div className="contact__success">
            <span className="contact__success-rune">ᛉ</span>
            <p>Your message has been sent. Vilhelm will be in touch shortly.</p>
          </div>
        ) : (
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="form-row form-row--half">
              <div className="form-group">
                <label className="form-label" htmlFor="cf-name">Name</label>
                <input
                  className="form-input"
                  id="cf-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cf-email">Email</label>
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
              <label className="form-label" htmlFor="cf-motif">Motif &amp; runic text</label>
              <input
                className="form-input"
                id="cf-motif"
                name="motif"
                type="text"
                placeholder="e.g. Yggdrasil with a verse from Hávamál"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-row form-row--half">
              <div className="form-group">
                <label className="form-label" htmlFor="cf-size">Approximate size</label>
                <input
                  className="form-input"
                  id="cf-size"
                  name="size"
                  type="text"
                  placeholder="e.g. 30 × 40 cm"
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cf-colours">Colours / style</label>
                <input
                  className="form-input"
                  id="cf-colours"
                  name="colours"
                  type="text"
                  placeholder="e.g. black &amp; gold, Urnes style"
                  disabled={status === 'submitting'}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cf-message">Anything else</label>
              <textarea
                className="form-input form-input--textarea"
                id="cf-message"
                name="message"
                rows={4}
                placeholder="Tell Vilhelm anything else about your vision…"
                disabled={status === 'submitting'}
              />
            </div>

            {status === 'error' && (
              <p className="contact__error">
                Something went wrong – please try again or email directly.
              </p>
            )}

            <button
              className="contact__submit"
              type="submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
