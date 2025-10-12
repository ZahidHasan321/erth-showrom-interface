import type { Campaign } from "../types/campaign";
import { getRecords } from "./baseApi";

const TABLE_NAME = "campaign";

export const getCampaigns = () =>
  getRecords<Campaign>(TABLE_NAME);
