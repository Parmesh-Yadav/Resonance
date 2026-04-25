import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

// Validation for environment variables using zod schemas
// If .env file is missing or variables are not set, this will throw an error during development
// Use this to ensure that all required environment variables are set before the application starts
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
