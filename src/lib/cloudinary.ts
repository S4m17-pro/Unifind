import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_PRIVATE_FOLDER = "unifind_private_items";
export const CLOUDINARY_SIGNED_URL_TTL_SECONDS = 3600;
export const PRIVATE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PRIVATE_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
] as const;

export type CloudinaryStatus =
  | { status: "ready" }
  | { status: "missing" }
  | { status: "incomplete"; missing: string[] };

const PLACEHOLDER_VALUES = new Set([
  "tu_cloud_name",
  "tu_api_key",
  "tu_api_secret",
  "your_cloud_name",
  "your_api_key",
  "your_api_secret",
  "changeme",
  "xxx",
]);

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function isUsableSecret(value: string): boolean {
  if (!value) return false;
  if (PLACEHOLDER_VALUES.has(value.toLowerCase())) return false;
  return !/^(tu_|your_|example)/i.test(value);
}

export function getCloudinaryEnv() {
  return {
    cloud_name: readEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: readEnv("CLOUDINARY_API_KEY"),
    api_secret: readEnv("CLOUDINARY_API_SECRET"),
  };
}

export function getCloudinaryStatus(): CloudinaryStatus {
  const env = getCloudinaryEnv();
  const missing: string[] = [];

  if (!isUsableSecret(env.cloud_name)) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!isUsableSecret(env.api_key)) missing.push("CLOUDINARY_API_KEY");
  if (!isUsableSecret(env.api_secret)) missing.push("CLOUDINARY_API_SECRET");

  if (missing.length === 3) return { status: "missing" };
  if (missing.length > 0) return { status: "incomplete", missing };
  return { status: "ready" };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryStatus().status === "ready";
}

export function getCloudinaryClient() {
  if (!isCloudinaryConfigured()) return null;

  const env = getCloudinaryEnv();
  cloudinary.config({
    cloud_name: env.cloud_name,
    api_key: env.api_key,
    api_secret: env.api_secret,
    secure: true,
  });

  return cloudinary;
}

export function describeCloudinarySetup(): string {
  const status = getCloudinaryStatus();

  if (status.status === "ready") {
    return `Cloudinary listo. Las fotos se suben como authenticated en ${CLOUDINARY_PRIVATE_FOLDER} y solo se firman en el panel de vigilancia.`;
  }

  if (status.status === "incomplete") {
    return `Cloudinary está incompleto (faltan ${status.missing.join(", ")}). El registro continúa; la foto no se carga ni se firma.`;
  }

  return "Cloudinary no está configurado. El registro de objetos funciona y la foto se omite.";
}

export function describeCloudinaryUploadError(error: unknown): string {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : "";

  if (/invalid.*(api|signature|authorization)/i.test(message)) {
    return "Cloudinary rechazó las credenciales. Revisa CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.";
  }

  if (/unknown cloud|cloud_name|Invalid cloud/i.test(message)) {
    return "Cloudinary no reconoce CLOUDINARY_CLOUD_NAME.";
  }

  return "No se pudo cargar la foto privada en Cloudinary. Revisa las variables CLOUDINARY_*.";
}

export async function uploadAuthenticatedItemImage(
  buffer: Buffer
): Promise<{ public_id: string; secure_url: string }> {
  const client = getCloudinaryClient();
  if (!client) {
    throw new Error("Cloudinary no está configurado.");
  }

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: CLOUDINARY_PRIVATE_FOLDER,
        type: "authenticated",
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
        use_filename: false,
      },
      (error, result) => {
        if (error || !result?.public_id) {
          reject(error ?? new Error("Cloudinary no devolvió public_id."));
          return;
        }

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url ?? "",
        });
      }
    );

    stream.end(buffer);
  });
}

export default cloudinary;
