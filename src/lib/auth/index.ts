export { MICROSOFT_ENTRA_PROVIDER_ID } from "@/lib/auth/constants";
export {
  AuthActionError,
  requireRole,
  requireSession,
  requireStaffSession,
  requireSuperuserSession,
  withStaffSession,
  isStaffRole,
  isSuperuserRole,
  type AuthedSession,
} from "@/lib/auth/guards";
export {
  createMicrosoftEntraProvider,
  getMicrosoftEntraConfig,
  isAllowedMicrosoftEmail,
  isMicrosoftEntraConfigured,
  resolveMicrosoftEmail,
  resolveMicrosoftIssuer,
  resolveMicrosoftOid,
} from "@/lib/auth/microsoft";
export { authorizeCredentials } from "@/lib/auth/credentials";
