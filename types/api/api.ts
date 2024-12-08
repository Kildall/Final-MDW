interface ApiResponse<T> {
  status: {
    success: boolean;
    errors: string[];
  };
  data: T;
}
