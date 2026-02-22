/**
 * Convert a product title to a URL-safe slug
 * Handles special characters, multiple spaces, and edge cases
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace multiple spaces with single hyphen
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]/g, '')
    // Replace multiple consecutive hyphens with a single one
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}
