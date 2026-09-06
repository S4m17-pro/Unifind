import cloudinary from "@/lib/cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function getSignedPrivateImageUrl(cloudinaryId: string, expiresInSeconds = 3600): string {
  return cloudinary.url(cloudinaryId, {
    type: "authenticated",
    sign_url: true,
    secure: true,
    expire_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
}
