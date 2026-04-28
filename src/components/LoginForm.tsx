import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import './LoginForm.css'

interface Props {
  onSignIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>
}

export default function LoginForm({ onSignIn }: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await onSignIn(email, password)
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="login">
      <div className="login__box">
        <p className="login__rune">ᚠ</p>
        <h1 className="login__title">{t('login.title')}</h1>
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__group">
            <label className="login__label" htmlFor="login-email">{t('login.email')}</label>
            <input
              className="login__input"
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="login__group">
            <label className="login__label" htmlFor="login-password">{t('login.password')}</label>
            <input
              className="login__input"
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          {error && <p className="login__error">{error}</p>}
          <button className="login__submit" type="submit" disabled={loading}>
            {loading ? t('login.submitting') : t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
