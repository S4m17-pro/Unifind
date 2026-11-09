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
    return { signedUrl: null, emptyLabel: "Sin foto" };
  }

  const signedUrl = getSignedPrivateImageUrl(publicId);
  if (signedUrl) {
    return { signedUrl, emptyLabel: "Sin foto" };
  }

  return {
    signedUrl: null,
    emptyLabel: "Foto guardada; no se pudo mostrar. Revisa la configuración del equipo.",
  };
}
