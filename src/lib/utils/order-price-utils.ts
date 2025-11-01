import type { Style } from "@/types/style";
import type { StyleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import type { FabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";

/**
 * Calculate stitching price from styles data
 * Uses the Stitch field from styles table for each selected style code
 * @param styleOptions - Array of style options for all garments
 * @param styles - Array of all available styles with pricing
 * @returns Total stitching price
 */
export function calculateStitchingPrice(
  styleOptions: StyleOptionsSchema[],
  styles: Style[]
): number {
  // Create a lookup map: Code -> Stitch value
  const styleStitchMap = new Map<string, number>();
  styles.forEach((style) => {
    const stitchValue = typeof style.fields.Stitch === "string"
      ? parseFloat(style.fields.Stitch)
      : style.fields.Stitch;
    styleStitchMap.set(style.fields.Code, stitchValue || 0);
  });

  let totalStitching = 0;

  styleOptions.forEach((styleOption) => {
    // Add stitching for all selected style codes
    if (styleOption.style) {
      const code = styleOption.style === "kuwaiti" ? "STY_KUWAITI" : "STY_DESIGNER";
      totalStitching += styleStitchMap.get(code) || 0;
    }

    if (styleOption.lines) {
      totalStitching += styleStitchMap.get("STY_LINE") || 0;
    }

    if (styleOption.collar?.collarType) {
      totalStitching += styleStitchMap.get(styleOption.collar.collarType) || 0;
    }

    if (styleOption.collar?.collarButton) {
      totalStitching += styleStitchMap.get(styleOption.collar.collarButton) || 0;
    }

    if (styleOption.jabzoor?.jabzour1) {
      totalStitching += styleStitchMap.get(styleOption.jabzoor.jabzour1) || 0;
    }

    if (styleOption.sidePocket?.side_pocket_type) {
      totalStitching += styleStitchMap.get(styleOption.sidePocket.side_pocket_type) || 0;
    }

    if (styleOption.frontPocket?.front_pocket_type) {
      totalStitching += styleStitchMap.get(styleOption.frontPocket.front_pocket_type) || 0;
    }

    if (styleOption.cuffs?.cuffs_type) {
      totalStitching += styleStitchMap.get(styleOption.cuffs.cuffs_type) || 0;
    }
  });

  return totalStitching;
}

/**
 * Calculate style price from styles data
 * Uses the RatePerItem field from styles table for each selected style code
 * @param styleOptions - Array of style options for all garments
 * @param styles - Array of all available styles with pricing
 * @returns Total style price
 */
export function calculateStylePrice(
  styleOptions: StyleOptionsSchema[],
  styles: Style[]
): number {
  // Create a lookup map: Code -> RatePerItem value
  const styleRateMap = new Map<string, number>();
  styles.forEach((style) => {
    styleRateMap.set(style.fields.Code, style.fields.RatePerItem || 0);
  });

  let totalStyle = 0;

  styleOptions.forEach((styleOption) => {
    // Add RatePerItem for all selected style codes
    if (styleOption.style) {
      const code = styleOption.style === "kuwaiti" ? "STY_KUWAITI" : "STY_DESIGNER";
      totalStyle += styleRateMap.get(code) || 0;
    }

    if (styleOption.lines) {
      totalStyle += styleRateMap.get("STY_LINE") || 0;
    }

    if (styleOption.collar?.collarType) {
      totalStyle += styleRateMap.get(styleOption.collar.collarType) || 0;
    }

    if (styleOption.collar?.collarButton) {
      totalStyle += styleRateMap.get(styleOption.collar.collarButton) || 0;
    }

    if (styleOption.jabzoor?.jabzour1) {
      totalStyle += styleRateMap.get(styleOption.jabzoor.jabzour1) || 0;
    }

    if (styleOption.sidePocket?.side_pocket_type) {
      totalStyle += styleRateMap.get(styleOption.sidePocket.side_pocket_type) || 0;
    }

    if (styleOption.frontPocket?.front_pocket_type) {
      totalStyle += styleRateMap.get(styleOption.frontPocket.front_pocket_type) || 0;
    }

    if (styleOption.cuffs?.cuffs_type) {
      totalStyle += styleRateMap.get(styleOption.cuffs.cuffs_type) || 0;
    }
  });

  return totalStyle;
}

/**
 * Calculate fabric price from fabric selections
 * @param fabricSelections - Array of fabric selections
 * @returns Total fabric price
 */
export function calculateFabricPrice(fabricSelections: FabricSelectionSchema[]): number {
  let fabricPrice = 0;
  fabricSelections.forEach((fabric) => {
    if (fabric.fabricAmount) fabricPrice += fabric.fabricAmount;
  });
  return fabricPrice;
}
