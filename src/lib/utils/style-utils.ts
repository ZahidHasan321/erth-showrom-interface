import type { Style } from "@/types/style";
import type { StyleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";

/**
 * Calculate the total price for style options based on selected codes
 * @param styleOptions - The style options data for a single row
 * @param styles - The array of all available styles with pricing
 * @returns The total price calculated from Rate for all selected styles
 */
export function calculateStylePrice(
  styleOptions: StyleOptionsSchema,
  styles: Style[]
): number {
  if (!styles || styles.length === 0) {
    return 0;
  }

  let total = 0;

  // Create a lookup map for faster access: Code -> Rate
  const styleMap = new Map<string, number>();
  styles.forEach((style) => {
    styleMap.set(style.fields.Code, style.fields.RatePerItem || 0);
  });

  // Style (kuwaiti or design)
  if (styleOptions.style === "kuwaiti") {
    total += styleMap.get("STY_KUWAITI") || 0;
  } else if (styleOptions.style === "design") {
    total += styleMap.get("STY_DESIGNER") || 0;
  }

  // Lines (add line price for each checked line)
  if (styleOptions.lines?.line1) {
    total += styleMap.get("STY_LINE") || 0;
  }
  if (styleOptions.lines?.line2) {
    total += styleMap.get("STY_LINE") || 0;
  }

  // Collar Type
  if (styleOptions.collar?.collarType) {
    total += styleMap.get(styleOptions.collar.collarType) || 0;
  }

  // Collar Button
  if (styleOptions.collar?.collarButton) {
    total += styleMap.get(styleOptions.collar.collarButton) || 0;
  }

  // Small Tabaggi is not a separate style code, it's just a boolean flag
  // No additional price for smallTabaggi

  // Jabzour 1
  if (styleOptions.jabzoor?.jabzour1) {
    total += styleMap.get(styleOptions.jabzoor.jabzour1) || 0;
  }

  // Jabzour 2 price is never counted (included in jabzour1 price)
  // No additional price for jabzour2

  // Jabzour Thickness is not a separate style code
  // No additional price for thickness

  // Front Pocket Type
  if (styleOptions.frontPocket?.front_pocket_type) {
    total += styleMap.get(styleOptions.frontPocket.front_pocket_type) || 0;
  }

  // Front Pocket Thickness is not a separate style code
  // No additional price for thickness

  // Pen Holder is not a separate style code
  // No additional price for pen holder

  // Cuffs Type
  if (styleOptions.cuffs?.cuffs_type) {
    total += styleMap.get(styleOptions.cuffs.cuffs_type) || 0;
  }

  // Cuffs Thickness is not a separate style code
  // No additional price for thickness

  const stitchingPrice = 9;

  if(styleOptions.style === "design") return 15;

  return total + stitchingPrice;
}
