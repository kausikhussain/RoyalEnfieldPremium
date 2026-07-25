const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Returns a production-safe URL for static assets in public/
 * Handles custom base paths (e.g. GitHub Pages or subfolder deployments)
 * and leaves external URLs (http/https/data/blob) unchanged.
 */
export function getAssetPath(path: string | undefined | null): string {
  if (!path) return "";
  
  // External or data URLs remain untouched
  if (/^(https?:|\/\/|data:|blob:)/i.test(path)) {
    return path;
  }
  
  // Ensure path starts with a single slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // If BASE_PATH is set and cleanPath doesn't already start with it, prepend BASE_PATH
  if (BASE_PATH && !cleanPath.startsWith(BASE_PATH)) {
    return `${BASE_PATH}${cleanPath}`;
  }
  
  return cleanPath;
}
