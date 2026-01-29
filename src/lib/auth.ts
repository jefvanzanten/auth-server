import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //     allowedEmails: process.env.ALLOWED_EMAILS?.split(",") || [],
  //   },
  // },
  rateLimit: {
    window: 60,
    max: 10,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    signUp: { disabled: true },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRole: "admin",
    }),
    bearer(),
  ],
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") || [],
  session: {
    expiresIn: 60 * 15,
    updateAge: 60 * 10,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
});
