import type { ApiResponse, UpsertResponseData, UpsertApiResponse } from '../types/api';
import type { Measurement } from '../types/measurement';
import { getRecords, searchAllRecords, upsertRecords } from './baseApi';

const TABLE_NAME = 'MEASUREMENT'; // New table name for measurements

export const getMeasurements = () => getRecords<Measurement>(TABLE_NAME);

export const getMeasurementsByCustomerId = async (customerId: string): Promise<ApiResponse<Measurement[]>> => {
  return await searchAllRecords<Measurement[]>(TABLE_NAME, { CustomerID: Number(customerId) });
};

export const upsertMeasurement = (
  measurements: Array<{ id?: string; fields: Partial<Measurement['fields']> }>,
  keyFields: string[] = ['CustomerID', 'MeasurementID'], // Key fields for measurements
): Promise<UpsertApiResponse<Measurement>> => {
  return upsertRecords<Measurement>(TABLE_NAME, measurements, keyFields) as Promise<UpsertApiResponse<Measurement>>;
};
