import { getSignedPrivateImageUrl } from "@/lib/images";

export type AdminPrivatePhotoState = {
  signedUrl: string | null;
  emptyLabel: string;
};

export function resolveAdminPrivatePhoto(
  cloudinaryId?: string | null,
): AdminPrivatePhotoState {
  const publicId = cloudinaryId?.trim() ?? "";

  if (!publicId) {
    return { signedUrl: null, emptyLabel: "Sin foto privada" };
  }

  const signedUrl = getSignedPrivateImageUrl(publicId);
  if (signedUrl) {
    return { signedUrl, emptyLabel: "Sin foto privada" };
  }

  return {
    signedUrl: null,
    emptyLabel: "Foto privada almacenada; no se pudo firmar. Revisa CLOUDINARY_*.",
  };
}
