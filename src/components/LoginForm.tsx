import { useState, type FormEvent } from 'react'
import './LoginForm.css'

interface Props {
  onSignIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>
}

export default function LoginForm({ onSignIn }: Props) {
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
        <h1 className="login__title">Admin</h1>
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__group">
            <label className="login__label" htmlFor="login-email">Email</label>
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
            <label className="login__label" htmlFor="login-password">Password</label>
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
