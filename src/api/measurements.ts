import type { ApiResponse } from '../types/api';
import type { Measurement, UpsertResponseData } from '../types/customer'; // Import Measurement type
import { getRecords, searchAllRecords, upsertRecords } from './baseApi';

export interface UpsertMeasurementApiResponse extends ApiResponse<UpsertResponseData<Measurement>> {
  data?: UpsertResponseData<Measurement>;
}

const TABLE_NAME = 'Measurement'; // New table name for measurements

export const getMeasurements = () => getRecords<Measurement>(TABLE_NAME);

export const getMeasurementsByCustomerId = async (customerId: string): Promise<ApiResponse<Measurement[]>> => {
  try {
    const response = await searchAllRecords<Measurement[]>(TABLE_NAME, { CustomerID: Number(customerId) });
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("No records found")) {
      return { status: "success", message: "No records found", data: [] };
    }
    throw error;
  }
};

export const upsertMeasurement = (
  measurements: Array<{ id?: string; fields: Partial<Measurement['fields']> }>,
  keyFields: string[] = ['CustomerID', 'MeasurementID'], // Key fields for measurements
): Promise<UpsertMeasurementApiResponse> => {
  const measurementsForUpsertRecords = measurements as Array<{ id?: string; fields: Measurement['fields'] }>;
  return upsertRecords<Measurement>(TABLE_NAME, measurementsForUpsertRecords, keyFields) as Promise<UpsertMeasurementApiResponse>;
};
