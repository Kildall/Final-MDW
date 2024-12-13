import { TranslatedResponseError } from "@/types/api/api";

export interface SerializableError {
  type: "APIException" | "Error";
  message: string;
  errors?: TranslatedResponseError[];
}
