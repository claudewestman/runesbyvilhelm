/**
 * Derives the thumbnail path from the full image path.
 * /images/01-yggdrasil.png → /images/thumbs/01-yggdrasil.webp
 */
export function thumbnailSrc(imagePath: string): string {
  const withoutExt = imagePath.replace(/\.[^/.]+$/, '')
  const parts = withoutExt.split('/')
  const filename = parts.pop()!
  return [...parts, 'thumbs', `${filename}.webp`].join('/')
}
