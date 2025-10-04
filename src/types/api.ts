export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  count?: number;
}
