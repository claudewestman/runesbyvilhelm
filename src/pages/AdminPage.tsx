import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import LoginForm from '../components/LoginForm'
import { supabase } from '../lib/supabase'
import { compressImage } from '../utils/compressImage'
import type { Artwork } from '../data/artworks'
import './AdminPage.css'

type EditableArtwork = Artwork & { _dirty?: boolean }

export default function AdminPage() {
  const { t } = useTranslation()
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

  function updateField(id: number, field: keyof Artwork, value: string | number | boolean | undefined) {
    setArtworks(prev =>
      prev.map(a => (a.id === id ? { ...a, [field]: value, _dirty: true } : a))
    )
  }

  async function uploadImage(artworkId: number, file: File) {
    setUploading(artworkId)

    // Compress image before upload (max 1200px, JPEG 85% quality)
    let uploadBlob: Blob
    try {
      uploadBlob = await compressImage(file, 1200, 0.85)
      const originalKB = Math.round(file.size / 1024)
      const compressedKB = Math.round(uploadBlob.size / 1024)
      console.log(`Image compressed: ${originalKB}KB → ${compressedKB}KB`)
    } catch (err) {
      showMsg('err', 'Failed to compress image')
      setUploading(null)
      return
    }

    // Always use .jpg since we compress to JPEG
    const filename = `${artworkId}-${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(filename, uploadBlob, {
        cacheControl: '31536000',
        upsert: true,
        contentType: 'image/jpeg'
      })

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
      height: undefined,
      width: undefined,
      depth: undefined,
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
    if (!globalThis.confirm(t('admin.confirmDelete', { title }))) return
    const { error } = await supabase.from('artworks').delete().eq('id', id)
    if (error) showMsg('err', error.message)
    else {
      showMsg('ok', `"${title}" deleted.`)
      setArtworks(prev => prev.filter(a => a.id !== id))
    }
  }

  if (authLoading) return <div className="admin-status">{t('admin.loading')}</div>

  if (!user) {
    return <LoginForm onSignIn={signIn} />
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <span className="admin__logo">{t('admin.header')}</span>
        <div className="admin__header-right">
          {message && (
            <span className={`admin__msg admin__msg--${message.type}`}>{message.text}</span>
          )}
          <button className="admin__signout" onClick={signOut}>{t('admin.signOut')}</button>
        </div>
      </header>

      <main className="admin__main">
        {dataLoading ? (
          <p className="admin-status">{t('admin.loadingArtworks')}</p>
        ) : (
          <>
            <div className="admin__toolbar">
              <button className="admin__add" onClick={addRow}>{t('admin.addArtwork')}</button>
            </div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>{t('admin.columns.id')}</th>
                    <th>{t('admin.columns.slug')}</th>
                    <th>{t('admin.columns.title')}</th>
                    <th>{t('admin.columns.subtitle')}</th>
                    <th>{t('admin.columns.description')}</th>
                    <th>{t('admin.columns.translation')}</th>
                    <th>{t('admin.columns.medium')}</th>
                    <th>{t('admin.columns.h')}</th>
                    <th>{t('admin.columns.w')}</th>
                    <th>{t('admin.columns.d')}</th>
                    <th>{t('admin.columns.image')}</th>
                    <th>{t('admin.columns.price')}</th>
                    <th>{t('admin.columns.forSale')}</th>
                    <th>{t('admin.columns.sold')}</th>
                    <th>{t('admin.columns.stripeLink')}</th>
                    <th>{t('admin.columns.instagramId')}</th>
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
                        <input
                          className="admin__input admin__input--num"
                          type="number"
                          value={a.height ?? ''}
                          placeholder="H"
                          onChange={e => updateField(a.id, 'height', e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </td>
                      <td>
                        <input
                          className="admin__input admin__input--num"
                          type="number"
                          value={a.width ?? ''}
                          placeholder="W"
                          onChange={e => updateField(a.id, 'width', e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </td>
                      <td>
                        <input
                          className="admin__input admin__input--num"
                          type="number"
                          value={a.depth ?? ''}
                          placeholder="D"
                          onChange={e => updateField(a.id, 'depth', e.target.value ? Number(e.target.value) : undefined)}
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
                            {uploading === a.id ? t('admin.uploading') : t('admin.upload')}
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
                      <td>
                        <input
                          className="admin__input"
                          value={a.instagramId}
                          onChange={e => updateField(a.id, 'instagramId', e.target.value)}
                        />
                      </td>
                      <td className="admin__cell--actions">
                        <button
                          className="admin__save"
                          disabled={!a._dirty || saving === a.id}
                          onClick={() => saveRow(a)}
                        >
                          {saving === a.id ? t('admin.saving') : t('admin.save')}
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
