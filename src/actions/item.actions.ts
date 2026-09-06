"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { ITEM_CATEGORIES } from "@/lib/constants";
import { requireStaffSession } from "@/lib/auth-guards";
import { isCloudinaryConfigured } from "@/lib/images";
import { truncate } from "@/lib/validation";

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

  if (!category || !foundLocation || !custodyStation || !shelfLocation) {
    return { error: "Faltan datos obligatorios para el registro." };
  }

  if (!(ITEM_CATEGORIES as readonly string[]).includes(category)) {
    return { error: "La categoría no es válida." };
  }

  try {
    const qrCode = `UNIFIND-${crypto.randomUUID()}`;
    const foundDate = foundDateStr ? new Date(foundDateStr) : new Date();

    if (Number.isNaN(foundDate.getTime())) {
      return { error: "La fecha y hora del hallazgo no es válida." };
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
      },
    });

    if (imageFile && imageFile.size > 0) {
      if (!isCloudinaryConfigured()) {
        revalidatePath("/admin/dashboard");
        return {
          success: true,
          item: newItem,
          warning: "Objeto guardado, pero Cloudinary no está configurado. La foto no se cargó.",
        };
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<{ public_id: string; secure_url: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "unifind_private_items",
              type: "authenticated",
            },
            (error, result) => {
              if (error || !result) reject(error);
              else resolve({ public_id: result.public_id, secure_url: result.secure_url });
            }
          );
          stream.end(buffer);
        }
      );

      await prisma.itemImage.create({
        data: {
          itemId: newItem.id,
          cloudinaryId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
        },
      });
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true, item: newItem };
  } catch (error) {
    console.error("Error al registrar item:", error);
    return { error: "Ocurrió un error al guardar el objeto en bodega." };
  }
}
