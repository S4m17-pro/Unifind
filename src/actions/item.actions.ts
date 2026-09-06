"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ITEM_CATEGORIES } from "@/lib/constants";
import { requireStaffSession } from "@/lib/auth-guards";
import {
  describeCloudinaryUploadError,
  uploadAuthenticatedItemImage,
} from "@/lib/cloudinary";
import {
  describeCloudinarySetup,
  isCloudinaryConfigured,
  validatePrivateImageFile,
} from "@/lib/images";
import { truncate } from "@/lib/validation";

function revalidateStaffAndCatalog() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  revalidatePath("/objetos");
}

export async function createItemAction(formData: FormData) {
  let session;

  try {
    session = await requireStaffSession();
  } catch {
    return { error: "Debes iniciar sesión como vigilante o Bienestar." };
  }

  const category = truncate(String(formData.get("category") ?? ""), 80);
  const foundLocation = truncate(String(formData.get("foundLocation") ?? ""), 160);
  const foundDateStr = String(formData.get("foundDate") ?? "");
  const custodyStation = truncate(String(formData.get("custodyStation") ?? ""), 160);
  const shelfLocation = truncate(String(formData.get("shelfLocation") ?? ""), 160);
  const imageFile = formData.get("image") as File | null;
  const hasImage = Boolean(imageFile && imageFile.size > 0);

  if (!category || !foundLocation || !custodyStation || !shelfLocation) {
    return { error: "Faltan datos obligatorios para el registro." };
  }

  if (!(ITEM_CATEGORIES as readonly string[]).includes(category)) {
    return { error: "La categoría no es válida." };
  }

  if (hasImage && imageFile) {
    const imageError = validatePrivateImageFile(imageFile);
    if (imageError) {
      return { error: imageError };
    }
  }

  try {
    const qrCode = `UNIFIND-${crypto.randomUUID()}`;
    const foundDate = foundDateStr ? new Date(foundDateStr) : new Date();

    if (Number.isNaN(foundDate.getTime())) {
      return { error: "La fecha y hora del hallazgo no es válida." };
    }

    let photoWarning: string | undefined;
    let uploadedImage: { public_id: string; secure_url: string } | null = null;

    if (hasImage && imageFile) {
      if (!isCloudinaryConfigured()) {
        photoWarning = describeCloudinarySetup();
      } else {
        try {
          const bytes = await imageFile.arrayBuffer();
          uploadedImage = await uploadAuthenticatedItemImage(Buffer.from(bytes));
        } catch (uploadError) {
          console.error("Error al subir foto privada a Cloudinary:", uploadError);
          photoWarning = describeCloudinaryUploadError(uploadError);
        }
      }
    }

    const newItem = await prisma.item.create({
      data: {
        qrCode,
        category,
        foundLocation,
        foundDate,
        custodyStation,
        shelfLocation,
        registeredById: session.user.id,
        status: "EN_BODEGA",
        ...(uploadedImage
          ? {
              images: {
                create: {
                  cloudinaryId: uploadedImage.public_id,
                  secureUrl: uploadedImage.secure_url,
                },
              },
            }
          : {}),
      },
    });

    revalidateStaffAndCatalog();
    return { success: true, item: newItem, warning: photoWarning };
  } catch (error) {
    console.error("Error al registrar item:", error);
    return { error: "Ocurrió un error al guardar el objeto en bodega." };
  }
}
