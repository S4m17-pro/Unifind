"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createItemAction(formData: FormData) {
  const category = formData.get("category") as string;
  const foundLocation = formData.get("foundLocation") as string;
  const foundDateStr = formData.get("foundDate") as string;
  const custodyStation = formData.get("custodyStation") as string;
  const shelfLocation = formData.get("shelfLocation") as string;
  const registeredById = formData.get("registeredById") as string;
  const imageFile = formData.get("image") as File | null;

  if (!category || !foundLocation || !custodyStation || !shelfLocation || !registeredById) {
    return { error: "Faltan datos obligatorios para el registro." };
  }

  try {
    // Generar código QR / identificador único único
    const qrCode = `UNIFIND-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newItem = await prisma.item.create({
      data: {
        qrCode,
        category,
        foundLocation,
        foundDate: foundDateStr ? new Date(foundDateStr) : new Date(),
        custodyStation,
        shelfLocation,
        registeredById,
        status: "EN_BODEGA",
      },
    });

    // Carga de imagen a Cloudinary (si fue provista)
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "unifind_private_items",
            type: "authenticated", // Imagen privada accesible sólo vía SDK/firmada
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve({ public_id: result.public_id, secure_url: result.secure_url });
          }
        );
        stream.end(buffer);
      });

      await prisma.itemImage.create({
        data: {
          itemId: newItem.id,
          cloudinaryId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
        },
      });
    }

    revalidatePath("/admin/dashboard");
    return { success: true, item: newItem };
  } catch (error) {
    console.error("Error al registrar item:", error);
    return { error: "Ocurrió un error al guardar el objeto en bodega." };
  }
}
