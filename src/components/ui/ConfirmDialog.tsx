"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ConfirmSubmit({
  label,
  pendingLabel,
  tone,
}: {
  label: string;
  pendingLabel: string;
  tone: "brand" | "danger";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant={tone === "danger" ? "destructive" : "default"}
      className="min-w-[9rem]"
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel: string;
  confirmPendingLabel?: string;
  confirmTone?: "brand" | "danger";
  confirmAction?: (formData: FormData) => void | Promise<void>;
  onCancel: () => void;
  onConfirmSubmit?: () => void;
  restoreFocusRef?: RefObject<HTMLElement | null>;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel = "Cancelar",
  confirmLabel,
  confirmPendingLabel = "Un momento…",
  confirmTone = "brand",
  confirmAction,
  onCancel,
  onConfirmSubmit,
  restoreFocusRef,
}: ConfirmDialogProps) {
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) return;
        onCancelRef.current();
        restoreFocusRef?.current?.focus?.();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="border-line bg-paper text-ink sm:max-w-md"
      >
        <DialogHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
            UniFind · Sesión
          </p>
          <DialogTitle className="font-serif text-xl font-semibold text-ink">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-ink-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onCancelRef.current()}>
            {cancelLabel}
          </Button>
          <form action={confirmAction} onSubmit={onConfirmSubmit}>
            <ConfirmSubmit
              label={confirmLabel}
              pendingLabel={confirmPendingLabel}
              tone={confirmTone}
            />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
