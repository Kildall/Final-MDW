import { APIException } from "@/services/api-service";
import { SerializableError } from "@/types/redux_types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSerializableError(error: unknown): SerializableError {
  if (error instanceof APIException) {
    return {
      type: "APIException",
      message: "API Error",
      errors: error.errors,
    };
  }
  return {
    type: "Error",
    message: error instanceof Error ? error.message : "Unknown error occurred",
  };
}
