import type { ApiResponse } from '../types/api';
import type { Shelves } from '../types/shelve'; // Using Shelves from your provided type
import {
  getRecords,
  updateRecord,
} from './baseApi';

const TABLE_NAME = 'SHELVES'; // Assuming the table name is 'SHELVES'

export const getShelves = (): Promise<ApiResponse<Shelves[]>> => {
  return getRecords<Shelves>(TABLE_NAME);
};

export const updateShelf = (
  recordId: string,
  shelf: Partial<Shelves['fields']>,
): Promise<ApiResponse<Shelves>> => {
  return updateRecord<Shelves>(TABLE_NAME, recordId, shelf);
};
