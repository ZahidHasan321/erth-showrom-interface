export interface ApiResponse<T> {
  status: string;
  table_name: string;
  count: number;
  records: T[];
}

export interface ApiSearchResponse<T> {
  status: string;
  record: T;
}
