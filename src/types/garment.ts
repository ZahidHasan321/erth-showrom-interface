export interface Garment {
  id: string;
  createdTime: string;
  fields: {
    // fabric selection fields
    orderId?: string[];
    garmentId?: string;
    brova: boolean;
    fabricSource: "" | "In" | "Out";
    fabricId?: string[];
    fabricLength: string;
    color?: string;
    measurementId: string[];
    express?: boolean;
    deliveryDate: string;
    note?: string;
    // style options fields
    styleOptionId: string;
    style: string;
    lines: string;
    collarType: string;
    collarButton: string;
    smallTabaggi: boolean;
    jabzour1?: string;
    jabzour2: string;
    jabzour_thickness?: string;
    phone: boolean;
    wallet: boolean;
    front_pocket_type: string;
    front_pocket_thickness: string;
    pen_holder: boolean;
    cuffs_type: string;
    cuffs_thickness: string;
  };
}
