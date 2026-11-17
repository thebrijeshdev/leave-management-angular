export interface API_Response<T = any> {
  result: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  token: string;
  tokenType: string;
  expiresAtUtc: string;
  employee: string;
}
