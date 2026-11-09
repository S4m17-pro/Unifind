"use client";

import { useState } from "react";
import ClaimForm, { type ClaimFormDefaults } from "@/components/public/ClaimForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PublicCatalogItem } from "@/lib/public-catalog";

interface Props {
  item: Pick<PublicCatalogItem, "id" | "category" | "foundLocation" | "custodyStation">;
  defaults?: ClaimFormDefaults;
  autoOpen?: boolean;
  triggerLabel?: string;
}

export default function ClaimFormModal({
  item,
  defaults,
  autoOpen = false,
  triggerLabel = "Reclamar objeto",
}: Props) {
  const [isOpen, setIsOpen] = useState(autoOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="w-full font-semibold">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="border-line bg-paper text-ink sm:max-w-lg">
        <DialogHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
            Reclamo de pertenencia
          </p>
          <DialogTitle className="font-serif text-xl font-semibold text-ink">
            Formulario de reclamo
          </DialogTitle>
          <DialogDescription className="text-ink-muted">
            Pertenencia:{" "}
            <span className="font-semibold text-brand">{item.category}</span> hallada en{" "}
            {item.foundLocation}. Custodia: {item.custodyStation}.
          </DialogDescription>
        </DialogHeader>

        <ClaimForm item={item} defaults={defaults} />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
