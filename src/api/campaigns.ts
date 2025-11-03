import type { Campaign } from "../types/campaign";
import { searchAllRecords } from "./baseApi";

const TABLE_NAME = "CAMPAIGNS";

export const getCampaigns = () =>
  searchAllRecords<Campaign[]>(TABLE_NAME, {Active: true});
