const path = require("path");

function brandImageRemotePatterns() {
  const keys = [
    "NEXT_PUBLIC_BRAND_HERO_URL",
    "NEXT_PUBLIC_BRAND_LOGO_URL",
    "NEXT_PUBLIC_BRAND_HOW_IT_WORKS_URL",
    "NEXT_PUBLIC_BRAND_CATALOG_URL",
    "NEXT_PUBLIC_BRAND_EMPTY_URL",
  ];
  const seen = new Set();
  const patterns = [];

  for (const key of keys) {
    const raw = process.env[key];
    if (!raw || !/^https?:\/\//i.test(raw.trim())) continue;
    try {
      const url = new URL(raw.trim());
      const id = `${url.protocol}//${url.hostname}`;
      if (seen.has(id)) continue;
      seen.add(id);
      patterns.push({
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
      });
    } catch {
      // ignore invalid brand URLs
    }
  }

  return patterns;
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      ...brandImageRemotePatterns(),
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
