export interface ApiResponse<T> {
  status: {
    success: boolean;
    errors: string[];
  };
  data: T;
}

export interface AuthUser {
  id: number;
  email: string;
  permissions: string[];
  name: string;
}
