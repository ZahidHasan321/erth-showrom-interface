import type { Style } from "@/types/style";
import { getRecords } from "./baseApi";
import type { ApiResponse } from "@/types/api";

const TABLE_NAME = "STYLES";

export const getStyles = (): Promise<ApiResponse<Style[]>> => {
  return getRecords<Style>(TABLE_NAME);
};
