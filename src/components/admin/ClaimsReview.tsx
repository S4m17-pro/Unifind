"use client";

import { useState } from "react";
import Link from "next/link";
import { reviewClaimAction } from "@/actions/claim.actions";

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
    setMessage(result.error ?? "Reclamo actualizado.");
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Revisión de reclamos</h2>
      <p className="mb-6 text-sm text-slate-600">
        Solo el personal puede ver estas descripciones. Aprueba o rechaza antes de realizar
        la entrega.
      </p>

      {message ? (
        <div className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      ) : null}

      {claims.length === 0 ? (
        <p className="text-sm text-slate-500">No hay solicitudes pendientes.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <article key={claim.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {claim.item.category} · {claim.item.qrCode}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(claim.createdAt).toLocaleString("es-CO")}
                </p>
              </div>
              <p className="text-sm text-slate-600">
                {claim.student.name} · {claim.student.email}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {claim.item.custodyStation} · {claim.item.shelfLocation}
              </p>
              <blockquote className="mt-3 rounded-xl border-l-4 border-blue-600 bg-white px-3 py-2 text-sm text-slate-700">
                {claim.description}
              </blockquote>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/admin/objetos/${claim.item.id}`}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100"
                >
                  Ver ficha privada
                </Link>
                <button
                  type="button"
                  disabled={busyId === claim.id}
                  onClick={() => handleReview(claim.id, "APPROVED")}
                  className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  disabled={busyId === claim.id}
                  onClick={() => handleReview(claim.id, "REJECTED")}
                  className="rounded-xl bg-red-800 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
