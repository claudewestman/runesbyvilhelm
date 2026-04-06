import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoginForm from '../components/LoginForm'
import { supabase } from '../lib/supabase'
import type { Artwork } from '../data/artworks'
import './AdminPage.css'

type EditableArtwork = Artwork & { _dirty?: boolean }

export default function AdminPage() {
  const { user, loading: authLoading, signIn, signOut } = useAuth()
  const [artworks, setArtworks] = useState<EditableArtwork[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [saving, setSaving] = useState<number | null>(null)
  const [uploading, setUploading] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map())

  useEffect(() => {
    if (!user) return
    setDataLoading(true)
    supabase
      .from('artworks')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (error) showMsg('err', error.message)
        else setArtworks(data as EditableArtwork[])
        setDataLoading(false)
      })
  }, [user])

  function showMsg(type: 'ok' | 'err', text: string) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3500)
  }

  function updateField(id: number, field: keyof Artwork, value: string | number | boolean) {
    setArtworks(prev =>
      prev.map(a => (a.id === id ? { ...a, [field]: value, _dirty: true } : a))
    )
  }

  async function uploadImage(artworkId: number, file: File) {
    setUploading(artworkId)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const filename = `${artworkId}-${Date.now()}.${ext}`
    
    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(filename, file, { cacheControl: '31536000', upsert: true })
    
    if (uploadError) {
      showMsg('err', uploadError.message)
      setUploading(null)
      return
    }

    const { data: urlData } = supabase.storage
      .from('artworks')
      .getPublicUrl(filename)
    
    const publicUrl = urlData.publicUrl
    
    // Update in database
    const { error: dbError } = await supabase
      .from('artworks')
      .update({ image: publicUrl })
      .eq('id', artworkId)
    
    setUploading(null)
    
    if (dbError) {
      showMsg('err', dbError.message)
    } else {
      setArtworks(prev =>
        prev.map(a => (a.id === artworkId ? { ...a, image: publicUrl } : a))
      )
      showMsg('ok', 'Image uploaded!')
    }
  }

  function handleFileSelect(artworkId: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadImage(artworkId, file)
    e.target.value = ''
  }

  async function saveRow(artwork: EditableArtwork) {
    setSaving(artwork.id)
    const { _dirty, ...data } = artwork
    const { error } = await supabase
      .from('artworks')
      .update(data)
      .eq('id', artwork.id)
    setSaving(null)
    if (error) showMsg('err', error.message)
    else {
      showMsg('ok', `"${artwork.title}" saved.`)
      setArtworks(prev => prev.map(a => (a.id === artwork.id ? { ...a, _dirty: false } : a)))
    }
  }

  async function addRow() {
    const maxId = artworks.reduce((m, a) => Math.max(m, a.id), 0)
    const blank: Artwork = {
      id: maxId + 1,
      slug: `artwork-${maxId + 1}`,
      title: 'New Artwork',
      subtitle: '',
      description: '',
      translation: '',
      medium: '',
      image: '/images/placeholder.png',
      price: 0,
      forSale: true,
      stripeLink: '',
      sold: false,
    }
    const { error } = await supabase.from('artworks').insert(blank)
    if (error) showMsg('err', error.message)
    else setArtworks(prev => [...prev, blank])
  }

  async function deleteRow(id: number, title: string) {
    if (!globalThis.confirm(`Delete "${title}"?`)) return
    const { error } = await supabase.from('artworks').delete().eq('id', id)
    if (error) showMsg('err', error.message)
    else {
      showMsg('ok', `"${title}" deleted.`)
      setArtworks(prev => prev.filter(a => a.id !== id))
    }
  }

  if (authLoading) return <div className="admin-status">Loading…</div>

  if (!user) {
    return <LoginForm onSignIn={signIn} />
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <span className="admin__logo">ᚠ Admin</span>
        <div className="admin__header-right">
          {message && (
            <span className={`admin__msg admin__msg--${message.type}`}>{message.text}</span>
          )}
          <button className="admin__signout" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <main className="admin__main">
        {dataLoading ? (
          <p className="admin-status">Loading artworks…</p>
        ) : (
          <>
            <div className="admin__toolbar">
              <button className="admin__add" onClick={addRow}>+ Add artwork</button>
            </div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Slug</th>
                    <th>Title</th>
                    <th>Subtitle</th>
                    <th>Description</th>
                    <th>Translation</th>
                    <th>Medium</th>
                    <th>Image</th>
                    <th>Price&nbsp;(USD)</th>
                    <th>For&nbsp;Sale</th>
                    <th>Sold</th>
                    <th>Stripe&nbsp;Link</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map(a => (
                    <tr key={a.id} className={a._dirty ? 'admin__row--dirty' : ''}>
                      <td className="admin__cell--id">{a.id}</td>
                      <td>
                        <input
                          className="admin__input"
                          value={a.slug}
                          onChange={e => updateField(a.id, 'slug', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="admin__input"
                          value={a.title}
                          onChange={e => updateField(a.id, 'title', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="admin__input"
                          value={a.subtitle}
                          onChange={e => updateField(a.id, 'subtitle', e.target.value)}
                        />
                      </td>
                      <td>
                        <textarea
                          className="admin__input admin__textarea"
                          value={a.description}
                          onChange={e => updateField(a.id, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <textarea
                          className="admin__input admin__textarea"
                          value={a.translation}
                          onChange={e => updateField(a.id, 'translation', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="admin__input"
                          value={a.medium}
                          onChange={e => updateField(a.id, 'medium', e.target.value)}
                        />
                      </td>
                      <td>
                        <div className="admin__image-cell">
                          <img
                            className="admin__image-preview"
                            src={a.image}
                            alt={a.title}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={el => { if (el) fileInputRefs.current.set(a.id, el) }}
                            onChange={e => handleFileSelect(a.id, e)}
                          />
                          <button
                            className="admin__upload-btn"
                            disabled={uploading === a.id}
                            onClick={() => fileInputRefs.current.get(a.id)?.click()}
                          >
                            {uploading === a.id ? '…' : 'Upload'}
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          className="admin__input admin__input--num"
                          type="number"
                          value={a.price}
                          onChange={e => updateField(a.id, 'price', Number(e.target.value))}
                        />
                      </td>
                      <td className="admin__cell--center">
                        <input
                          type="checkbox"
                          checked={a.forSale}
                          onChange={e => updateField(a.id, 'forSale', e.target.checked)}
                        />
                      </td>
                      <td className="admin__cell--center">
                        <input
                          type="checkbox"
                          checked={a.sold}
                          onChange={e => updateField(a.id, 'sold', e.target.checked)}
                        />
                      </td>
                      <td>
                        <input
                          className="admin__input"
                          value={a.stripeLink}
                          onChange={e => updateField(a.id, 'stripeLink', e.target.value)}
                        />
                      </td>
                      <td className="admin__cell--actions">
                        <button
                          className="admin__save"
                          disabled={!a._dirty || saving === a.id}
                          onClick={() => saveRow(a)}
                        >
                          {saving === a.id ? '…' : 'Save'}
                        </button>
                        <button
                          className="admin__delete"
                          onClick={() => deleteRow(a.id, a.title)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
