import type { ApiResponse } from "../types/api";
import type { Garment } from "../types/garment";
import {
  createRecord,
  getRecords,
  searchAllRecords,
  searchRecords,
  updateRecord,
} from "./baseApi";

const TABLE_NAME = "GARMENTS";

export const createGarment = (
  garment: Partial<Garment["fields"]>
): Promise<ApiResponse<Garment>> => {
  return createRecord<Garment>(TABLE_NAME, {
    fields: garment,
  } as Partial<Garment>);
};

export const updateGarment = (
  recordId: string,
  garment: Partial<Garment["fields"]>
): Promise<ApiResponse<Garment>> => {
  return updateRecord<Garment>(TABLE_NAME, recordId, garment);
};

export const getGarments = () => getRecords<Garment>(TABLE_NAME);

export const getGarmentById = (id: string): Promise<ApiResponse<Garment>> => {
  return searchRecords<Garment>(TABLE_NAME, { id: id });
};

export const getGarmentsByField = (
  fields: Partial<Garment["fields"]>
): Promise<ApiResponse<Garment[]>> => {
  return searchAllRecords<Garment[]>(TABLE_NAME, fields);
};
