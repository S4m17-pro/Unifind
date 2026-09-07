"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { actionError } from "@/lib/action-result";
import { MICROSOFT_ENTRA_PROVIDER_ID } from "@/lib/auth/constants";
import { isMicrosoftEntraConfigured } from "@/lib/auth/microsoft";

function safeCallbackUrl(value: string): string {
  return value.startsWith("/") ? value : "/dashboard";
}

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallbackUrl(String(formData.get("callbackUrl") ?? "/dashboard"));

  if (!email.trim() || !password) {
    return actionError("Falta el correo o la contraseña.");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return actionError("Correo o contraseña incorrectos.");
    }
    throw error;
  }
}

/**
 * Front: «Continuar con Microsoft».
 * Provider id: `microsoft-entra-id`
 * Callback Entra: `{AUTH_URL}/api/auth/callback/microsoft-entra-id`
 * Campo de formulario: `callbackUrl` (igual que credentials).
 * Si faltan las env de Entra, no inicia OAuth (la UI no debe mostrar el botón).
 */
export async function microsoftSignInAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  if (!isMicrosoftEntraConfigured()) {
    return actionError("El acceso con Microsoft no está habilitado.");
  }

  const callbackUrl = safeCallbackUrl(String(formData.get("callbackUrl") ?? "/dashboard"));

  try {
    await signIn(MICROSOFT_ENTRA_PROVIDER_ID, {
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return actionError("No pudimos abrir la sesión de Microsoft. Intenta de nuevo.");
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
