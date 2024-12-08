import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export class ApiService {
  private static baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

  static async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      logger.info(`Fetching ${endpoint} with options:`, options);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });
      // TODO: Handle unauthorized correctly
      if (response.status === 401) {
        logger.error("Request failed with 401 Unauthorized", {
          endpoint,
          options,
        });
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        logger.error(`API Error: ${response.statusText}`, {
          endpoint,
          options,
        });
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();

      logger.info(`API Response for ${endpoint}: ${response.status}`);
      logger.debug(`API Response for ${endpoint}:`, result);

      return result;
    } catch (error) {
      logger.error("API request failed:", error);
      throw error;
    }
  }
}
