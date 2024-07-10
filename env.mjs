import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    AUTH_SECRET: z.string().min(1),
    // GOOGLE_CLIENT_ID: z.string().min(1),
    // GOOGLE_CLIENT_SECRET: z.string().min(1),
    // GITHUB_OAUTH_TOKEN: z.string().min(1),
    // DATABASE_URL: z.string().min(1),
    // RESEND_API_KEY: z.string().min(1),
    // STRIPE_API_KEY: z.string().min(1),
    // STRIPE_WEBHOOK_SECRET: z.string().min(1),
    PINATA_API_SECRET: z.string().min(1),
    PINATA_API_KEY: z.string().min(1),
  },
  client: {
    // NEXT_PUBLIC_APP_URL: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_ENV_ID: z.string().min(1),
    NEXT_PUBLIC_THIRDWEB_ID: z.string().min(1),
    NEXT_PUBLIC_POST_ID: z.string().min(1),
    NEXT_PUBLIC_COMMENT_ID: z.string().min(1),
    NEXT_PUBLIC_PROFILE_ID: z.string().min(1),
    NEXT_PUBLIC_CONTEXT_ID: z.string().min(1),
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),

  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    PINATA_API_SECRET: process.env.PINATA_API_SECRET,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    NEXT_PUBLIC_THIRDWEB_ID: process.env.NEXT_PUBLIC_THIRDWEB_ID,
    NEXT_PUBLIC_POST_ID: process.env.NEXT_PUBLIC_POST_ID,
    NEXT_PUBLIC_COMMENT_ID: process.env.NEXT_PUBLIC_COMMENT_ID,
    NEXT_PUBLIC_PROFILE_ID: process.env.NEXT_PUBLIC_PROFILE_ID,
    NEXT_PUBLIC_CONTEXT_ID: process.env.NEXT_PUBLIC_CONTEXT_ID,
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
    // DATABASE_URL: process.env.DATABASE_URL,
    // RESEND_API_KEY: process.env.RESEND_API_KEY,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // // Stripe
    // STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    // STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    // NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
    // NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    // NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
    // NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_ENV_ID: process.env.NEXT_PUBLIC_ENV_ID,
  },
});
