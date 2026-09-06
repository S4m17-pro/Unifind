export const AUTH_FLASH = {
  ingreso: "unifind-ingreso",
  sesionCerrada: "unifind-sesion-cerrada",
} as const;

export type AuthFlashKey = (typeof AUTH_FLASH)[keyof typeof AUTH_FLASH];

export function setAuthFlash(key: keyof typeof AUTH_FLASH) {
  try {
    sessionStorage.setItem(AUTH_FLASH[key], "1");
  } catch {
    // Private mode or blocked storage should not break the flow.
  }
}
