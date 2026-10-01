/**
 * Generates PWA icons from source-icon.png
 * Run: npm run icons
 */
import sharp from 'sharp'

const SOURCE = 'public/source-icon.png'
const OUTPUT_DIR = 'public'

const icons = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.png', size: 32 },
]

for (const { name, size, maskable } of icons) {
  if (maskable) {
    // Maskable icons need ~10% padding for safe zone
    const padding = Math.round(size * 0.1)
    const innerSize = size - padding * 2
    
    const resized = await sharp(SOURCE)
      .resize(innerSize, innerSize)
      .toBuffer()
    
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 128, g: 128, b: 128, alpha: 1 }
      }
    })
      .composite([{ input: resized, left: padding, top: padding }])
      .png()
      .toFile(`${OUTPUT_DIR}/${name}`)
  } else {
    await sharp(SOURCE)
      .resize(size, size)
      .png()
      .toFile(`${OUTPUT_DIR}/${name}`)
  }
  
  console.log(`✓ ${name}`)
}

console.log('\nPWA icons generated!')
