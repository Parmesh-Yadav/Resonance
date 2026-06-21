import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

// Validation for environment variables using zod schemas
// If .env file is missing or variables are not set, this will throw an error during development
// Use this to ensure that all required environment variables are set before the application starts
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    APP_URL: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
    CHATTERBOX_API_KEY: z.string().min(1),
    CHATTERBOX_API_URL: z.url(),
    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_SERVER: z.enum(["sandbox", "production"]).default("sandbox"),
    POLAR_PRODUCT_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
