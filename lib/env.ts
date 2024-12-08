import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().min(1, "API Base URL is required"),
});

const processEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
} as const;

let parsed: z.infer<typeof envSchema>;

try {
  parsed = envSchema.parse(processEnv);
} catch (error) {
  console.error("Environment variable validation failed:", error);
  throw new Error("Required environment variables are missing");
}

export const env = parsed;
