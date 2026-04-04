/**
 * Generates WebP thumbnails for all images in public/images/.
 * Output: public/images/thumbs/<name>.webp
 * Run: npm run thumbnails
 */
import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'fs'
import { join, extname, basename } from 'path'

const INPUT_DIR  = 'public/images'
const OUTPUT_DIR = 'public/images/thumbs'
const THUMB_WIDTH = 600
const SUPPORTED = new Set(['.png', '.jpg', '.jpeg', '.webp'])

mkdirSync(OUTPUT_DIR, { recursive: true })

const files = readdirSync(INPUT_DIR)
  .filter(f => SUPPORTED.has(extname(f).toLowerCase()))

if (files.length === 0) {
  console.log('No images found in public/images/ – skipping thumbnail generation.')
  process.exit(0)
}

for (const file of files) {
  const name = basename(file, extname(file))
  const input  = join(INPUT_DIR, file)
  const output = join(OUTPUT_DIR, `${name}.webp`)

  await sharp(input)
    .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output)

  console.log(`✓ ${name}.webp`)
}

console.log(`\nGenerated ${files.length} thumbnail(s) → ${OUTPUT_DIR}`)
