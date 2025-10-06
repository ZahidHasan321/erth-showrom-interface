import { z } from "zod";
import { fabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/schema";

export type FabricSelection = z.infer<typeof fabricSelectionSchema>;

export type Fabric = {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    "REAL STOCK": number;
    [key: string]: any;
  };
};
