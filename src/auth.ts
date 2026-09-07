import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { authConfig } from "@/auth.config";
import { authorizeCredentials } from "@/lib/auth/credentials";
import {
  createMicrosoftEntraProvider,
  isAllowedMicrosoftEmail,
  MICROSOFT_ENTRA_PROVIDER_ID,
  resolveMicrosoftEmail,
  resolveMicrosoftOid,
} from "@/lib/auth/microsoft";
import { linkMicrosoftUser } from "@/lib/domain/users";

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Correo institucional", type: "email" },
      password: { label: "Contraseña", type: "password" },
    },
    authorize: authorizeCredentials,
  }),
];

const microsoftProvider = createMicrosoftEntraProvider();
if (microsoftProvider) {
  providers.push(microsoftProvider);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!account) return false;
      if (account.provider === "credentials") return true;
      if (account.provider !== MICROSOFT_ENTRA_PROVIDER_ID) return false;

      const email = resolveMicrosoftEmail(user.email, profile);
      const oid = resolveMicrosoftOid(account, profile);
      if (!email || !oid) return false;
      if (!isAllowedMicrosoftEmail(email)) return false;

      const dbUser = await linkMicrosoftUser({
        email,
        name: user.name ?? (typeof profile?.name === "string" ? profile.name : null),
        image: user.image,
        oid,
      });

      user.id = dbUser.id;
      user.email = dbUser.email;
      user.name = dbUser.name;
      user.role = dbUser.role;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if (user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
  },
});
