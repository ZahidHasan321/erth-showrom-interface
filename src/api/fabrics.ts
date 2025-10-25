import type { Fabric } from "../types/fabric";
import { getRecords, updateRecord } from "./baseApi";

const TABLE_NAME = "FABRIC";

export const getFabrics = () =>
  getRecords<Fabric>(TABLE_NAME);


export const updateFabric = (id: string, fabric: Partial<Fabric['fields']>) =>
  updateRecord<Fabric>(TABLE_NAME, id, fabric);
