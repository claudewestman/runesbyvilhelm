/**
 * Prerenders artwork pages with correct og:image meta tags.
 * Run after build: npm run prerender
 * 
 * Generates /artwork/{slug}/index.html for each artwork with
 * proper Open Graph tags for social sharing.
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const DIST_DIR = 'dist'
const BASE_URL = 'https://runesbyvilhelm.com'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠ Supabase credentials not found – skipping prerender.')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read the base index.html
const baseHtml = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8')

// Fetch all artworks
const { data: artworks, error } = await supabase
  .from('artworks')
  .select('slug, title, subtitle, description, image, medium, price, forSale, sold')
  .order('id')

if (error) {
  console.error('Failed to fetch artworks:', error.message)
  process.exit(1)
}

if (!artworks || artworks.length === 0) {
  console.log('No artworks found – skipping prerender.')
  process.exit(0)
}

console.log(`Prerendering ${artworks.length} artwork pages...`)

for (const artwork of artworks) {
  const pageUrl = `${BASE_URL}/artwork/${artwork.slug}`
  const pageTitle = `${artwork.title} – Runes by Vilhelm`
  const pageDesc = artwork.subtitle || artwork.description?.slice(0, 160) || ''
  const pageImage = artwork.image || `${BASE_URL}/og_image.jpg`
  
  // Create artwork-specific JSON-LD
  const artworkJsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": artwork.title,
    "description": artwork.description || artwork.subtitle || '',
    "image": pageImage,
    "url": pageUrl,
    "artMedium": artwork.medium || "Wood carving",
    "artform": "Rune carving",
    "creator": {
      "@type": "Person",
      "name": "Vilhelm Westman",
      "url": BASE_URL
    }
  }
  
  // Add offer if for sale
  if (artwork.forSale && !artwork.sold && artwork.price) {
    artworkJsonLd.offers = {
      "@type": "Offer",
      "price": artwork.price,
      "priceCurrency": "SEK",
      "availability": "https://schema.org/InStock",
      "url": pageUrl
    }
  } else if (artwork.sold) {
    artworkJsonLd.offers = {
      "@type": "Offer",
      "availability": "https://schema.org/SoldOut"
    }
  }
  
  const artworkScript = `<script type="application/ld+json">${JSON.stringify(artworkJsonLd)}</script>`
  
  // Replace og tags in HTML
  let html = baseHtml
    // Insert artwork JSON-LD before closing head
    .replace(
      '</head>',
      `${artworkScript}\n  </head>`
    )
    // Update canonical URL (fixes circular redirect)
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${pageUrl}" />`
    )
    // Update hreflang links
    .replace(
      /<link rel="alternate" hreflang="en"[^>]*>/,
      `<link rel="alternate" hreflang="en" href="${pageUrl}" />`
    )
    .replace(
      /<link rel="alternate" hreflang="x-default"[^>]*>/,
      `<link rel="alternate" hreflang="x-default" href="${pageUrl}" />`
    )
    // Update title
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(pageTitle)}</title>`
    )
    // Update og:url
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${pageUrl}" />`
    )
    // Update og:title
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`
    )
    // Update og:description
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`
    )
    // Update og:image
    .replace(
      /<meta property="og:image"[^>]*content="[^"]*"[^>]*>/,
      `<meta property="og:image" content="${pageImage}" />`
    )
    // Update og:image:alt
    .replace(
      /<meta property="og:image:alt"[^>]*>/,
      `<meta property="og:image:alt" content="${escapeHtml(artwork.title)} – handcrafted rune carving by Vilhelm Westman" />`
    )
    // Update twitter:title
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`
    )
    // Update twitter:description
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${escapeHtml(pageDesc)}" />`
    )
    // Update twitter:image
    .replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${pageImage}" />`
    )

  // Write to /artwork/{slug}/index.html
  const dir = join(DIST_DIR, 'artwork', artwork.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  
  console.log(`✓ /artwork/${artwork.slug}/`)
}

// Generate dynamic sitemap
const today = new Date().toISOString().split('T')[0]
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${artworks.map(a => `  <url>
    <loc>${BASE_URL}/artwork/${a.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemapXml)
console.log(`✓ sitemap.xml (${artworks.length + 1} URLs)`)

console.log(`\nPrerendered ${artworks.length} artwork page(s).`)

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
