/**
 * Compress all existing images in Supabase Storage.
 * Run once: node scripts/compress-images.mjs
 * 
 * Downloads each image, compresses to max 1200px JPEG at 85% quality,
 * uploads the new version, and updates the database.
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function compressImage(buffer) {
  return sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer()
}

async function main() {
  // Fetch all artworks with images
  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, title, image')
    .not('image', 'is', null)
    .order('id')

  if (error) {
    console.error('❌ Failed to fetch artworks:', error.message)
    process.exit(1)
  }

  console.log(`Found ${artworks.length} artworks with images\n`)

  for (const artwork of artworks) {
    const { id, title, image } = artwork
    
    if (!image) continue

    try {
      // Download image
      console.log(`[${id}] ${title}`)
      console.log(`    Downloading...`)
      
      const response = await fetch(image)
      if (!response.ok) {
        console.log(`    ⚠️ Failed to download (${response.status}), skipping`)
        continue
      }
      
      const originalBuffer = Buffer.from(await response.arrayBuffer())
      const originalKB = Math.round(originalBuffer.length / 1024)
      
      // Check if already small enough (under 500KB)
      if (originalBuffer.length < 500 * 1024) {
        console.log(`    ✓ Already small (${originalKB}KB), skipping`)
        continue
      }

      // Compress
      console.log(`    Compressing (${originalKB}KB)...`)
      const compressedBuffer = await compressImage(originalBuffer)
      const compressedKB = Math.round(compressedBuffer.length / 1024)
      
      // Upload new version
      const filename = `${id}-${Date.now()}.jpg`
      console.log(`    Uploading (${compressedKB}KB)...`)
      
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filename, compressedBuffer, {
          cacheControl: '31536000',
          upsert: true,
          contentType: 'image/jpeg'
        })

      if (uploadError) {
        console.log(`    ⚠️ Upload failed: ${uploadError.message}`)
        continue
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('artworks')
        .getPublicUrl(filename)

      // Update database
      const { error: updateError } = await supabase
        .from('artworks')
        .update({ image: urlData.publicUrl })
        .eq('id', id)

      if (updateError) {
        console.log(`    ⚠️ DB update failed: ${updateError.message}`)
        continue
      }

      const reduction = Math.round((1 - compressedBuffer.length / originalBuffer.length) * 100)
      console.log(`    ✓ Done! ${originalKB}KB → ${compressedKB}KB (-${reduction}%)`)
      
    } catch (err) {
      console.log(`    ⚠️ Error: ${err.message}`)
    }
    
    console.log()
  }

  console.log('🎉 Migration complete!')
}

main()
