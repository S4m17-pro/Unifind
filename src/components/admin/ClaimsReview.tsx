"use client";

import { useState } from "react";
import Link from "next/link";
import { reviewClaimAction } from "@/actions/claim.actions";
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
  const [message, setMessage] = useState<string | null>(null);

  const handleReview = async (claimId: string, status: "APPROVED" | "REJECTED") => {
    setBusyId(claimId);
    setMessage(null);
    const result = await reviewClaimAction(claimId, status);
    setBusyId(null);
    setMessage(isActionFailure(result) ? result.error : "Reclamo actualizado.");
  };

  return (
    <section className="rounded-lg border border-line bg-paper p-6 shadow-sm sm:p-8">
      <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">Revisión de reclamos</h2>
      <p className="mb-6 text-sm text-ink-muted">
        Las descripciones de pertenencia solo son visibles para vigilancia. Aprueba o rechaza antes
        de la entrega presencial con firma.
      </p>

      {message ? (
        <div className="mb-4 rounded-md border border-line bg-canvas px-4 py-3 text-sm text-ink">
          {message}
        </div>
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
                <Link
                  href={`/admin/objetos/${claim.item.id}`}
                  className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-ink hover:border-brand hover:text-brand"
                >
                  Ver ficha privada
                </Link>
                <button
                  type="button"
                  disabled={busyId === claim.id}
                  onClick={() => handleReview(claim.id, "APPROVED")}
                  className="rounded-md bg-success px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  disabled={busyId === claim.id}
                  onClick={() => handleReview(claim.id, "REJECTED")}
                  className="rounded-md bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
                >
                  Rechazar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
