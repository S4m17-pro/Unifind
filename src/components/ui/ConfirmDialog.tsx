"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

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
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex min-w-[9rem] items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60",
        tone === "danger"
          ? "bg-danger hover:bg-[#7f1616]"
          : "bg-brand hover:bg-brand-hover",
      )}
    >
      {pending ? pendingLabel : label}
    </button>
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
  confirmPendingLabel = "Un momento...",
  confirmTone = "brand",
  confirmAction,
  onCancel,
  onConfirmSubmit,
  restoreFocusRef,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    if (open) {
      if (!node.open) {
        node.showModal();
      }
      cancelRef.current?.focus();
      return;
    }

    if (node.open) {
      node.close();
    }
    restoreFocusRef?.current?.focus?.();
  }, [open, restoreFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-line bg-paper p-6 text-ink shadow-xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault();
        onCancelRef.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancelRef.current();
        }
      }}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
        UniFind · Sesión
      </p>
      <h2 id={titleId} className="font-serif text-xl font-semibold text-ink">
        {title}
      </h2>
      {description ? (
        <p id={descriptionId} className="mt-2 text-sm text-ink-muted">
          {description}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          ref={cancelRef}
          type="button"
          onClick={() => onCancelRef.current()}
          className="inline-flex items-center justify-center rounded-md border border-line bg-bar px-4 py-2.5 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
        >
          {cancelLabel}
        </button>
        <form action={confirmAction} onSubmit={onConfirmSubmit}>
          <ConfirmSubmit
            label={confirmLabel}
            pendingLabel={confirmPendingLabel}
            tone={confirmTone}
          />
        </form>
      </div>
    </dialog>
  );
}
