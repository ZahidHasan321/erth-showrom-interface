export interface Garment {
  id: string;
  createdTime: string;
  fields: {
    // fabric selection fields
    OrderId?: string[];
    GarmentId?: string;
    Brova: boolean;
    FabricSource: "" | "In" | "Out";
    FabricId?: string[];
    ShopName?: string;
    FabricLength: string;
    Color?: string;
    MeasurementId: string[];
    Express?: boolean;
    DeliveryDate: string;
    Note?: string;
    HomeDelivery?: boolean;
    // style options fields
    StyleOptionId: string;
    Style: string;
    Lines: string;
    CollarType: string;
    CollarButton: string;
    SmallTabaggi: boolean;
    Jabzour1?: string;
    Jabzour2: string;
    JabzourThickness?: string;
    SidePocketType?: string;
    Phone: boolean;
    Wallet: boolean;
    FrontPocketType: string;
    FrontPocketThickness: string;
    PenHolder: boolean;
    CuffsType: string;
    CuffsThickness: string;
  };
}
