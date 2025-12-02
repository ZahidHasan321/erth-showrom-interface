/**
 * Fatoura (Order) Stages
 * Represents the workflow stages for an entire order from receipt to completion.
 * Values match exactly with Airtable single select options.
 */
export const FatouraStage = {
  /** FATOURA RECEIVED, NOTHING DONE YET */
  FATOURA_RECEIVED: "FATOURA RECEIVED",

  /** PIECES IN WATER */
  WATER: "WATER",

  /** BROVA ON PRODUCTION */
  BROVA_ON_PRODUCTION: "BROVA ON PRODUCTION",

  /** BROVA AT SHOP WAITING APPROVAL */
  BROVA_AT_SHOP_WAITING_APPROVAL: "BROVA AT SHOP WAITING APPROVAL",

  /** BROVA OK */
  BROVA_OK: "BROVA OK",

  /** BROVA OK + ALT */
  BROVA_OK_ALT: "BROVA OK + ALT",

  /** FINAL ON PRODUCTION */
  FINAL_ON_PRODUCTION: "FINAL ON PRODUCTION",

  /** FINAL AND BROVA AT SHOP */
  FINAL_BROVA_AT_SHOP: "FINAL + BROVA AT SHOP",

  /** PIECES IN ALTERATION */
  ALTERATION: "ALTERATION",

  /** PIECES IN CANCELLED */
  CANCELLED: "CANCELLED",
} as const;

export type FatouraStage = typeof FatouraStage[keyof typeof FatouraStage];

/**
 * Piece (Garment) Stages
 * Represents the production workflow stages for individual garment pieces.
 * Values match exactly with Airtable single select options.
 */
export const PieceStage = {
  /** PIECE NOT CUT */
  WAITING_CUT: "WAITING CUT",

  /** PIECE CUTTED */
  CUTT: "CUTT",

  /** PIECE ON POST CUTTED */
  POST_CUT: "POST CUT",

  /** PIECE TASK1 FINISHED - PREP */
  TASK1_PREP: "TASK1: PREP",

  /** PIECE ON TASK2 FINISHED - JABZOUR + FRONT POCKET */
  TASK2_JABZOUR_FRONT_POCKET: "TASK2: JABZOUR+FRONT POCKET",

  /** PIECE ON TASK3 FINISHED - COLLAR */
  TASK3_COLLAR: "TASK3: COLLAR",

  /** PIECE TASK4 FINISHED - SLEEVES + SIDES + HEMMING SLEEVES */
  TASK4_SLEEVES_SIDES_HEMMING: "TASK4: SLEEVES+SIDES+HEMMING SLEEVES",

  /** PIECE TASK5 FINISHED - INTERMEDIATE OUT + MEASURE */
  TASK5_INTERMEDIATE_OUT_MEASURE: "TASK5: INTERMEDIATE OUT1+MEASURE",

  /** PIECE 6 FINISHED - SIDE POCKET + HEMMING */
  TASK6_SIDE_POCKET_HEMMING: "TASK6: SIDE POCKET+HEMMING",

  /** PIECE FINISHED FINISHING */
  FINISHING: "FINISHING",

  /** PIECE FINISHED IRONING */
  IRONING: "IRONING",

  /** QUALITY CHECK DONE AND OK */
  QC_OK: "QC OK",
} as const;

export type PieceStage = typeof PieceStage[keyof typeof PieceStage];

/**
 * Mapping from Fatoura stage codes to enum values
 */
export const FatouraStageCodeMap: Record<string, FatouraStage> = {
  "000": FatouraStage.FATOURA_RECEIVED,
  "002": FatouraStage.WATER,
  "003": FatouraStage.BROVA_ON_PRODUCTION,
  "004": FatouraStage.BROVA_AT_SHOP_WAITING_APPROVAL,
  "005": FatouraStage.BROVA_OK,
  "005A": FatouraStage.BROVA_OK_ALT,
  "006": FatouraStage.FINAL_ON_PRODUCTION,
  "007": FatouraStage.FINAL_BROVA_AT_SHOP,
  "008": FatouraStage.ALTERATION,
  "009": FatouraStage.CANCELLED,
};

/**
 * Mapping from Piece stage codes to enum values
 */
export const PieceStageCodeMap: Record<string, PieceStage> = {
  "020": PieceStage.WAITING_CUT,
  "CUTT": PieceStage.CUTT,
  "POST CUT": PieceStage.POST_CUT,
  "TASK1": PieceStage.TASK1_PREP,
  "TASK2": PieceStage.TASK2_JABZOUR_FRONT_POCKET,
  "TASK3": PieceStage.TASK3_COLLAR,
  "TASK4": PieceStage.TASK4_SLEEVES_SIDES_HEMMING,
  "TASK5": PieceStage.TASK5_INTERMEDIATE_OUT_MEASURE,
  "TASK6": PieceStage.TASK6_SIDE_POCKET_HEMMING,
  "FINISHING": PieceStage.FINISHING,
  "IRONING": PieceStage.IRONING,
  "QC OK": PieceStage.QC_OK,
};

/**
 * Mapping from enum values back to codes
 */
export const FatouraStageToCode: Record<FatouraStage, string> = {
  [FatouraStage.FATOURA_RECEIVED]: "000",
  [FatouraStage.WATER]: "002",
  [FatouraStage.BROVA_ON_PRODUCTION]: "003",
  [FatouraStage.BROVA_AT_SHOP_WAITING_APPROVAL]: "004",
  [FatouraStage.BROVA_OK]: "005",
  [FatouraStage.BROVA_OK_ALT]: "005A",
  [FatouraStage.FINAL_ON_PRODUCTION]: "006",
  [FatouraStage.FINAL_BROVA_AT_SHOP]: "007",
  [FatouraStage.ALTERATION]: "008",
  [FatouraStage.CANCELLED]: "009",
};

/**
 * Mapping from enum values back to codes
 */
export const PieceStageToCode: Record<PieceStage, string> = {
  [PieceStage.WAITING_CUT]: "020",
  [PieceStage.CUTT]: "CUTT",
  [PieceStage.POST_CUT]: "POST CUT",
  [PieceStage.TASK1_PREP]: "TASK1",
  [PieceStage.TASK2_JABZOUR_FRONT_POCKET]: "TASK2",
  [PieceStage.TASK3_COLLAR]: "TASK3",
  [PieceStage.TASK4_SLEEVES_SIDES_HEMMING]: "TASK4",
  [PieceStage.TASK5_INTERMEDIATE_OUT_MEASURE]: "TASK5",
  [PieceStage.TASK6_SIDE_POCKET_HEMMING]: "TASK6",
  [PieceStage.FINISHING]: "FINISHING",
  [PieceStage.IRONING]: "IRONING",
  [PieceStage.QC_OK]: "QC OK",
};

/**
 * Human-readable labels for Fatoura stages (using the Airtable values directly)
 */
export const FatouraStageLabels: Record<FatouraStage, string> = {
  [FatouraStage.FATOURA_RECEIVED]: "Fatoura Received",
  [FatouraStage.WATER]: "Water",
  [FatouraStage.BROVA_ON_PRODUCTION]: "Brova on Production",
  [FatouraStage.BROVA_AT_SHOP_WAITING_APPROVAL]: "Brova at Shop Waiting Approval",
  [FatouraStage.BROVA_OK]: "Brova OK",
  [FatouraStage.BROVA_OK_ALT]: "Brova OK + Alt",
  [FatouraStage.FINAL_ON_PRODUCTION]: "Final on Production",
  [FatouraStage.FINAL_BROVA_AT_SHOP]: "Final + Brova at Shop",
  [FatouraStage.ALTERATION]: "Alteration",
  [FatouraStage.CANCELLED]: "Cancelled",
};

/**
 * Human-readable labels for Piece stages (using the Airtable values directly)
 */
export const PieceStageLabels: Record<PieceStage, string> = {
  [PieceStage.WAITING_CUT]: "Waiting Cut",
  [PieceStage.CUTT]: "Cutt",
  [PieceStage.POST_CUT]: "Post Cut",
  [PieceStage.TASK1_PREP]: "Task 1: Prep",
  [PieceStage.TASK2_JABZOUR_FRONT_POCKET]: "Task 2: Jabzour + Front Pocket",
  [PieceStage.TASK3_COLLAR]: "Task 3: Collar",
  [PieceStage.TASK4_SLEEVES_SIDES_HEMMING]: "Task 4: Sleeves + Sides + Hemming",
  [PieceStage.TASK5_INTERMEDIATE_OUT_MEASURE]: "Task 5: Intermediate OUT + Measure",
  [PieceStage.TASK6_SIDE_POCKET_HEMMING]: "Task 6: Side Pocket + Hemming",
  [PieceStage.FINISHING]: "Finishing",
  [PieceStage.IRONING]: "Ironing",
  [PieceStage.QC_OK]: "QC OK",
};
