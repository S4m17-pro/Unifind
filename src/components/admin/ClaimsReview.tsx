"use client";

import { useState } from "react";
import Link from "next/link";
import { reviewClaimAction } from "@/actions/claim.actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isActionFailure } from "@/lib/action-result";

export type PendingClaim = {
  id: string;
  description: string;
  createdAt: Date | string;
  student: {
    name: string | null;
    email: string;
  };
  item: {
    id: string;
    category: string;
    qrCode: string;
    custodyStation: string;
    shelfLocation: string;
  };
};

export default function ClaimsReview({ claims }: { claims: PendingClaim[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const handleReview = async (claimId: string, status: "APPROVED" | "REJECTED") => {
    setBusyId(claimId);
    setMessage(null);
    const result = await reviewClaimAction(claimId, status);
    setBusyId(null);
    setMessage(
      isActionFailure(result)
        ? { type: "error", text: result.error }
        : { type: "success", text: "Reclamo actualizado." },
    );
  };

  return (
    <section className="rounded-lg border border-line bg-paper p-6 shadow-sm sm:p-8">
      {message ? (
        <Alert
          variant={message.type === "success" ? "success" : "destructive"}
          className="mb-4"
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      ) : null}

      {claims.length === 0 ? (
        <p className="text-sm text-ink-subtle">No hay solicitudes pendientes.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <article key={claim.id} className="rounded-lg border border-line bg-canvas p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">
                  {claim.item.category} · {claim.item.qrCode}
                </p>
                <p className="text-xs text-ink-subtle">
                  {new Date(claim.createdAt).toLocaleString("es-CO")}
                </p>
              </div>
              <p className="text-sm text-ink-muted">
                {claim.student.name} · {claim.student.email}
              </p>
              <p className="mt-1 text-xs text-ink-subtle">
                {claim.item.custodyStation} · {claim.item.shelfLocation}
              </p>
              <blockquote className="mt-3 rounded-md border-l-4 border-brand bg-paper px-3 py-2 text-sm text-ink">
                {claim.description}
              </blockquote>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/objetos/${claim.item.id}`}>Ver ficha privada</Link>
                </Button>
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  disabled={busyId === claim.id}
                  onClick={() => handleReview(claim.id, "APPROVED")}
                >
                  Aprobar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={busyId === claim.id}
                  onClick={() => handleReview(claim.id, "REJECTED")}
                >
                  Rechazar
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
