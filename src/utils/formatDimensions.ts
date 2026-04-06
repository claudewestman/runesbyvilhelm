/**
 * Formats artwork dimensions as "H × W × D cm" or "H × W cm" if no depth.
 * Returns null if no dimensions are provided.
 */
export function formatDimensions(
  height?: number,
  width?: number,
  depth?: number
): string | null {
  if (!height && !width) return null
  
  const parts: string[] = []
  if (height) parts.push(String(height))
  if (width) parts.push(String(width))
  if (depth) parts.push(String(depth))
  
  if (parts.length === 0) return null
  
  return parts.join(' × ') + ' cm'
}
