import {
  CLOUDINARY_SIGNED_URL_TTL_SECONDS,
  PRIVATE_IMAGE_MAX_BYTES,
  PRIVATE_IMAGE_MIME_TYPES,
  describeCloudinarySetup,
  getCloudinaryClient,
  getCloudinaryStatus,
  isCloudinaryConfigured,
  type CloudinaryStatus,
} from "@/lib/cloudinary";

export {
  describeCloudinarySetup,
  getCloudinaryStatus,
  isCloudinaryConfigured,
  type CloudinaryStatus,
};

export function validatePrivateImageFile(file: File): string | null {
  if (file.size <= 0) {
    return "La foto adjunta está vacía.";
  }

  if (file.size > PRIVATE_IMAGE_MAX_BYTES) {
    return "La foto supera el límite de 5 MB.";
  }

  const mime = file.type.trim().toLowerCase();
  if (mime && !(PRIVATE_IMAGE_MIME_TYPES as readonly string[]).includes(mime)) {
    return "Formato de foto no permitido. Usa JPG, PNG, WEBP o GIF.";
  }

  return null;
}

export function getSignedPrivateImageUrl(
  cloudinaryId: string,
  expiresInSeconds = CLOUDINARY_SIGNED_URL_TTL_SECONDS
): string | null {
  const client = getCloudinaryClient();
  const publicId = cloudinaryId.trim();

  if (!client || !publicId) return null;

  try {
    return client.url(publicId, {
      type: "authenticated",
      resource_type: "image",
      sign_url: true,
      secure: true,
      expire_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    });
  } catch (error) {
    console.error("No se pudo firmar la URL privada de Cloudinary:", error);
    return null;
  }
}
