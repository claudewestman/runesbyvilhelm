/**
 * Generates PWA icons from favicon.svg
 * Run: npm run icons
 */
import sharp from 'sharp'
import { readFileSync } from 'fs'

const SVG = readFileSync('public/favicon.svg')
const OUTPUT_DIR = 'public'

const icons = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size, maskable } of icons) {
  let img = sharp(SVG).resize(size, size)
  
  // Maskable icons need extra padding (safe zone is ~80% of icon)
  if (maskable) {
    const padding = Math.round(size * 0.1)
    img = sharp(SVG)
      .resize(size - padding * 2, size - padding * 2)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: '#0c0a08'
      })
  }
  
  await img.png().toFile(`${OUTPUT_DIR}/${name}`)
  console.log(`✓ ${name}`)
}

console.log('\nPWA icons generated!')
