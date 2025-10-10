import type { Fabric } from "../types/fabric";
import { getRecords } from "./baseApi";

const TABLE_NAME = "FABRIC";

export const getFabrics = () =>
  getRecords<Fabric>(TABLE_NAME);
