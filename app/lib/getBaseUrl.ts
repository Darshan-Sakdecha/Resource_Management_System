export function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // For production (Vercel / custom host)
  return process.env.NEXT_PUBLIC_SITE_URL!;
}
