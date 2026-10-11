import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// Los previews de Vercel inyectan su barra de comentarios (vercel.live); producción no.
const isProdDeploy = process.env.VERCEL_ENV === "production";
const live = isProdDeploy ? "" : " https://vercel.live";

// CSP ajustada a este sitio: fuentes propias (next/font), imágenes locales o HTTPS (portadas de Notion),
// y los scripts/estilos en línea que Next.js necesita.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${live}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${live}${isDev ? " ws: wss:" : ""}`,
  `frame-src 'self'${live}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProdDeploy ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/favicon.ico", destination: "/favicon.svg", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.notion.so" },
    ],
  },
};

export default config;
