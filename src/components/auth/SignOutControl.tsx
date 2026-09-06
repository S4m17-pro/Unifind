"use client";

import { useRef, useState, type ReactNode } from "react";
import SignOutDialog from "@/components/auth/SignOutDialog";
import { cn } from "@/lib/cn";

type SignOutControlProps = {
  className?: string;
  children?: ReactNode;
};

export default function SignOutControl({ className, children }: SignOutControlProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(className)}
        onClick={() => setOpen(true)}
      >
        {children ?? "Cerrar sesión"}
      </button>
      <SignOutDialog
        open={open}
        onCancel={() => setOpen(false)}
        restoreFocusRef={triggerRef}
      />
    </>
  );
}
