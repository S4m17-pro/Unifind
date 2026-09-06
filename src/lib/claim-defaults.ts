import { auth } from "@/auth";
import type { ClaimFormDefaults } from "@/components/public/ClaimForm";

/** Prefill de reclamo: query string gana; si no, sesión Auth.js de Back. */
export async function getClaimDefaults(query?: {
  email?: string;
  nombre?: string;
}): Promise<ClaimFormDefaults> {
  const session = await auth();
  return {
    email: query?.email || session?.user?.email || undefined,
    name: query?.nombre || session?.user?.name || undefined,
  };
}
