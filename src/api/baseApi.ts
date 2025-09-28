import type { ApiResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches all records from a given Airtable table.
 * @param tableName The name of the table to fetch records from.
 * @returns A promise that resolves to the full API response including metadata and records.
 */
export const getRecords = async <T>(
  tableName: string,
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${BASE_URL}/airtable/${tableName}/records`);

  if (!response.ok) {
    throw new Error(`Failed to fetch records from ${tableName}`);
  }

  const data = await response.json();
  return data as ApiResponse<T>;
};

/**
 * Fetches a single record by its ID from a given Airtable table.
 * @param tableName The name of the table to fetch the record from.
 * @param recordId The ID of the record to fetch.
 * @returns A promise that resolves to the fetched record.
 */
export const getRecordById = async <T>(tableName: string, recordId: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}/airtable/${tableName}/records/${recordId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch record ${recordId} from ${tableName}`);
  }

  const data = await response.json();
  return data as T;
};
