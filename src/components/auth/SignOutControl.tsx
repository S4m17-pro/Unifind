"use client";

import { useRef, useState, type ReactNode } from "react";
import SignOutDialog from "@/components/auth/SignOutDialog";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";

type SignOutControlProps = {
  className?: string;
  children?: ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
};

export default function SignOutControl({
  className,
  children,
  variant = "outline",
}: SignOutControlProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children ?? "Cerrar sesión"}
      </Button>
      <SignOutDialog
        open={open}
        onCancel={() => setOpen(false)}
        restoreFocusRef={triggerRef}
      />
    </>
  );
}
