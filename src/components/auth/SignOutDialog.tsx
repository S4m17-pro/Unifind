"use client";

import type { RefObject } from "react";
import { signOutAction } from "@/actions/auth.actions";
import { setAuthFlash } from "@/components/auth/auth-flash";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type SignOutDialogProps = {
  open: boolean;
  onCancel: () => void;
  restoreFocusRef?: RefObject<HTMLElement | null>;
};

export default function SignOutDialog({
  open,
  onCancel,
  restoreFocusRef,
}: SignOutDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="¿Seguro que quieres cerrar sesión?"
      description="Vas a salir del panel de UniFind. El catálogo público sigue abierto para consultar objetos en custodia."
      cancelLabel="Cancelar"
      confirmLabel="Cerrar sesión"
      confirmPendingLabel="Cerrando sesión…"
      confirmTone="danger"
      confirmAction={signOutAction}
      onCancel={onCancel}
      onConfirmSubmit={() => setAuthFlash("sesionCerrada")}
      restoreFocusRef={restoreFocusRef}
    />
  );
}
