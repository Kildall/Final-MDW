import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import {
  ApiResponse,
  ResponseError,
  TranslatedResponseError,
} from "@/types/api/api";

export const API_ERROR_CODE_MESSAGE: Record<number, string> = {
  1000: "Error de autenticación",
  1001: "Acceso denegado",
  1002: "Token inválido",
  1003: "Token expirado",
  1004: "Autenticación no proporcionada",
  1005: "Ya se encuentra autenticado",
  1006: "Usuario no encontrado",

  1100: "Error de usuario",
  1102: "Contraseña incorrecta",
  1103: "El usuario ya existe",
  1104: "Usuario no habilitado",

  2000: "Error de recurso",
  2001: "Recurso no encontrado",
  2002: "El recurso ya existe",
  2003: "Error al actualizar el recurso",
  2004: "Transición de estado inválida",

  3000: "Error de validación",
  3001: "Parámetros inválidos",
  3002: "Inventario insuficiente",

  5000: "Error del servidor",
  5001: "Error de base de datos",
};

export class APIException extends Error {
  public errors: TranslatedResponseError[];
  constructor(errors: ResponseError[]) {
    super();
    this.name = "APIException";
    this.errors = errors.map((error) => ({
      ...error,
      translatedMessage: API_ERROR_CODE_MESSAGE[error.code],
    }));
  }
}

export class ApiService {
  private static baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

  /**
   * Fetches data from the API and returns the response.
   * @param endpoint - The endpoint to fetch data from.
   * @param options - The request options.
   * @param token - The authentication token.
   * @returns The response data.
   * @throws APIException if the response is not successful.
   */
  static async fetch<T extends ApiResponse<unknown>>(
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
      logger.info(`Fetching ${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        logger.error(`API Error: ${response.statusText}`, {
          endpoint,
          options,
        });
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result: T = await response.json();

      logger.info(`API Response for ${endpoint}: ${response.status}`);
      logger.debug(`API Response for ${endpoint}: ${JSON.stringify(result)}`);

      if (!result.status.success && result.status.errors.length > 0) {
        throw new APIException(result.status.errors);
      } else if (!result.status.success) {
        throw new APIException([
          {
            code: 5000,
            message: "Ocurrio un error desconocido",
          },
        ]);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
