"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);
}

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCancelRef = useRef(onCancel);
  const [mounted, setMounted] = useState(false);
  onCancelRef.current = onCancel;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !mounted) return;

    const root = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusCancel = () => {
      const cancel = root?.querySelector<HTMLElement>("[data-dialog-cancel]");
      cancel?.focus();
    };

    const frame = window.requestAnimationFrame(focusCancel);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelRef.current();
        return;
      }

      if (event.key !== "Tab" || !root) return;

      const items = getFocusable(root);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      const restoreTo = restoreFocusRef?.current ?? previouslyFocused;
      restoreTo?.focus?.();
    };
  }, [open, mounted, restoreFocusRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative w-full max-w-md rounded-lg border border-line bg-paper p-6 shadow-xl"
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
            type="button"
            data-dialog-cancel
            onClick={onCancel}
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
      </div>
    </div>,
    document.body,
  );
}
