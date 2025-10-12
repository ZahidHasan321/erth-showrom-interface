import { z } from "zod";
import { fabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";

export type FabricSelection = z.infer<typeof fabricSelectionSchema>;

export type Fabric = {
  id: string;
  createdTime: string;
  fields: {
    Name: string;
    Color: string;
    RealStock: number;
    Code: string;
    PricePerMeter: number;
  };
};
