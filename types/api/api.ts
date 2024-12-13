export interface ApiResponse<T> {
  status: {
    success: boolean;
    errors: ResponseError[];
  };
  data: T;
}

export interface ResponseError {
  code: number;
  message: string;
}

export interface TranslatedResponseError extends ResponseError {
  translatedMessage: string;
}

export interface AuthUser {
  id: number;
  email: string;
  permissions: string[];
  name: string;
}
