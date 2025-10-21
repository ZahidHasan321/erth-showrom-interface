import type { PriceItem } from "@/types/prices";
import { getRecords } from "./baseApi";
import type { ApiResponse } from "@/types/api";

const TABLE_NAME = "Prices";

export const getPrices = (): Promise<ApiResponse<PriceItem[]>> => {
  return getRecords<PriceItem>(TABLE_NAME);
};
