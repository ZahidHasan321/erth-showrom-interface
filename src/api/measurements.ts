import type { ApiResponse } from '../types/api';
import type { Measurement } from '../types/measurement';
import { createRecord, getRecords, searchAllRecords, updateRecord } from './baseApi';

const TABLE_NAME = 'MEASUREMENTS'; // New table name for measurements

export const getMeasurements = () => getRecords<Measurement>(TABLE_NAME);

export const getMeasurementsByCustomerId = async (customerId: string): Promise<ApiResponse<Measurement[]>> => {
  return await searchAllRecords<Measurement[]>(TABLE_NAME, { CustomerID: Number(customerId) });
};

export const createMeasurement = (
  measurement: Partial<Measurement['fields']>,
): Promise<ApiResponse<Measurement>> => {
  return createRecord<Measurement>(TABLE_NAME, { fields: measurement } as Partial<Measurement>);
};

export const updateMeasurement = (
  recordId: string,
  measurement: Partial<Measurement['fields']>,
): Promise<ApiResponse<Measurement>> => {
  return updateRecord<Measurement>(TABLE_NAME, recordId, measurement);
};