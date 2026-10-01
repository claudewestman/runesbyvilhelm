/**
 * Returns the thumbnail URL for an image.
 * - External URLs (Supabase, etc): returns as-is
 * - Local paths: /images/01-yggdrasil.png → /images/thumbs/01-yggdrasil.webp
 */
export function thumbnailSrc(imagePath: string): string {
  // External URL (Supabase Storage, etc) - use as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Local path - use generated thumbnail
  const withoutExt = imagePath.replace(/\.[^/.]+$/, '')
  const parts = withoutExt.split('/')
  const filename = parts.pop()!
  return [...parts, 'thumbs', `${filename}.webp`].join('/')
}
