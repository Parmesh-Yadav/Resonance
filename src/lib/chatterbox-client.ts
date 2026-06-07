import createClient from "openapi-fetch";
import type { paths } from "@/types/chatterbox-api";
import { env } from "./env";

export const chatterbox = createClient<paths>({
  baseUrl: env.CHATTERBOX_API_URL,
  headers: {
    "X-API-Key": env.CHATTERBOX_API_KEY,
  },
});
