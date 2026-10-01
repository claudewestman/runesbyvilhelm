/**
 * Prerenders product pages with correct og:image meta tags.
 * Run after build: npm run prerender
 *
 * Generates /{productPath}/{slug}/index.html for each product with
 * proper Open Graph tags for social sharing.
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const DIST_DIR = 'dist'
const BASE_URL = process.env.VITE_BASE_URL ?? 'https://runesbyvilhelm.com'
const PRODUCT_PATH = process.env.VITE_PRODUCT_PATH ?? 'artwork'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠ Supabase credentials not found – skipping prerender.')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read the base index.html
const baseHtml = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8')

// Fetch all products
const { data: products, error } = await supabase
  .from('products')
  .select('slug, title, subtitle, description, image, material, price, forSale, sold')
  .order('id')

if (error) {
  console.error('Failed to fetch products:', error.message)
  process.exit(1)
}

if (!products || products.length === 0) {
  console.log('No products found – skipping prerender.')
  process.exit(0)
}

console.log(`Prerendering ${products.length} product pages...`)

for (const product of products) {
  // Trailing slash required! GitHub Pages redirects /{productPath}/slug to /{productPath}/slug/
  const pageUrl = `${BASE_URL}/${PRODUCT_PATH}/${product.slug}/`
  const pageTitle = `${product.title} – Runes by Vilhelm`
  const pageDesc = product.subtitle || product.description?.slice(0, 160) || ''
  const pageImage = product.image || `${BASE_URL}/og_image.jpg`

  // Create product-specific JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": product.title,
    "description": product.description || product.subtitle || '',
    "image": pageImage,
    "url": pageUrl,
    "artMedium": product.material || "Wood carving",
    "artform": "Rune carving",
    "creator": {
      "@type": "Person",
      "name": "Vilhelm Westman",
      "url": BASE_URL
    }
  }

  // Add offer if for sale
  if (product.forSale && !product.sold && product.price) {
    productJsonLd.offers = {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "SEK",
      "availability": "https://schema.org/InStock",
      "url": pageUrl
    }
  } else if (product.sold) {
    productJsonLd.offers = {
      "@type": "Offer",
      "availability": "https://schema.org/SoldOut"
    }
  }

  const productScript = `<script type="application/ld+json">${JSON.stringify(productJsonLd)}</script>`

  // Replace og tags in HTML
  let html = baseHtml
    // Insert product JSON-LD before closing head
    .replace(
      '</head>',
      `${productScript}\n  </head>`
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
      `<meta property="og:image:alt" content="${escapeHtml(product.title)}" />`
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

  // Write to /{productPath}/{slug}/index.html
  const dir = join(DIST_DIR, PRODUCT_PATH, product.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)

  console.log(`✓ /${PRODUCT_PATH}/${product.slug}/`)
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
${products.map(p => `  <url>
    <loc>${BASE_URL}/${PRODUCT_PATH}/${p.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemapXml)
console.log(`✓ sitemap.xml (${products.length + 1} URLs)`)

console.log(`\nPrerendered ${products.length} product page(s).`)

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
