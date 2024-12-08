export interface LoginResponse {
  expires: Date;
  token: string;
  verified: boolean;
}