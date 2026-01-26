export function resolveImageUrl(url) {
  if (!url) return url;

  // Si viene del backend como "/uploads/.."
  if (url.startsWith("/uploads/")) {
    const origin = import.meta.env.VITE_API_ORIGIN || "http://localhost:3001";
    return `${origin}${url}`;
  }

  return url; // Cloudinary u otra URL absoluta
}
