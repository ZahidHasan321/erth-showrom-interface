import type { Fabric } from "../types/fabric";
import { getRecords } from "./baseApi";

const TABLE_NAME = "fabric";

export const getFabrics = () =>
  getRecords<Fabric>(TABLE_NAME).then((response) => response.data);
