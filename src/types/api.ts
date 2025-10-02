export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T | T[] | { [key: string]: any } | null; // Flexible data field
  count?: number;
}
