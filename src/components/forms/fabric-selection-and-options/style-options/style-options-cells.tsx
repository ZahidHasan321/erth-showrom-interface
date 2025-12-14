"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import {
  collarButtons,
  collarTypes,
  cuffTypes,
  jabzourTypes,
  penIcon,
  phoneIcon,
  walletIcon,
  smallTabaggiImage,
  thicknessOptions as ThicknessOptions,
  topPocketTypes,
} from "../constants";
import type { CellContext } from "@tanstack/react-table";
import type { StyleOptionsSchema } from "./style-options-schema";
import { calculateStylePrice } from "@/lib/utils/style-utils";
import type { Style } from "@/types/style";

export const GarmentIdCell = ({
  row,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={`styleOptions.${row.index}.garmentId`}
      control={control}
      render={({ field }) => <span>{field.value}</span>}
    />
  );
};

export const StyleOptionIdCell = ({
  row,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={`styleOptions.${row.index}.styleOptionId`}
      control={control}
      defaultValue={row.original.styleOptionId}
      render={({ field }) => <span>{field.value}</span>}
    />
  );
};

export const StyleCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  return (
    <Controller
      name={`styleOptions.${row.index}.style`}
      control={control}
      render={({ field }) => (
        <Select
          onValueChange={field.onChange}
          value={field.value as string}
          disabled={isFormDisabled}
        >
          <SelectTrigger className="bg-background border-border/60 min-w-[150px]">
            <SelectValue placeholder="Select Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kuwaiti">Kuwaiti</SelectItem>
            <SelectItem value="design">Design</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  );
};

export const LinesCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control, setValue } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;

  const [line1, line2] = useWatch({
    name: [
      `styleOptions.${row.index}.lines.line1`,
      `styleOptions.${row.index}.lines.line2`,
    ],
  });

  return (
    <div className="min-w-[180px] flex items-center space-x-6 px-2">
      <Controller
        name={`styleOptions.${row.index}.lines.line1`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`line1-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={(checked) => {
                // Prevent unchecking if it's the only one checked
                if (!checked && !line2) {
                  return; // Don't allow unchecking
                }
                field.onChange(checked);
                // When line1 is checked, uncheck line2
                if (checked) {
                  setValue(`styleOptions.${row.index}.lines.line2`, false);
                }
              }}
              disabled={isFormDisabled}
            />
            <label
              htmlFor={`line1-${row.index}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              1 Line
            </label>
          </div>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.lines.line2`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`line2-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={(checked) => {
                // Prevent unchecking if it's the only one checked
                if (!checked && !line1) {
                  return; // Don't allow unchecking
                }
                field.onChange(checked);
                // When line2 is checked, uncheck line1
                if (checked) {
                  setValue(`styleOptions.${row.index}.lines.line1`, false);
                }
              }}
              disabled={isFormDisabled}
            />
            <label
              htmlFor={`line2-${row.index}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              2 Lines
            </label>
          </div>
        )}
      />
    </div>
  );
};

export const CollarCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const [collarType, collarButton] = useWatch({
    name: [
      `styleOptions.${row.index}.collar.collarType`,
      `styleOptions.${row.index}.collar.collarButton`,
    ],
  });

  return (
    <div className="min-w-[350px] flex flex-row space-x-2">
      <Controller
        name={`styleOptions.${row.index}.collar.collarType`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[120px]">
              {collarType ? (
                <img
                  src={
                    collarTypes.find((c) => c.value === collarType)?.image ||
                    undefined
                  }
                  alt={collarTypes.find((c) => c.value === collarType)?.alt}
                  className="min-w-10 h-10 object-contain"
                />
              ) : (
                <SelectValue placeholder="Select Type" />
              )}
            </SelectTrigger>
            <SelectContent>
              {collarTypes.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={ct.image || undefined}
                      alt={ct.alt}
                      className="min-w-12 h-12 object-contain"
                    />
                    <span>{ct.displayText}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.collar.collarButton`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[120px]">
              {collarButton ? (
                <img
                  src={
                    collarButtons.find((b) => b.value === collarButton)
                      ?.image || undefined
                  }
                  alt={collarButtons.find((b) => b.value === collarButton)?.alt}
                  className="min-w-10 h-10 object-contain"
                />
              ) : (
                <SelectValue placeholder="Select Button" />
              )}
            </SelectTrigger>
            <SelectContent>
              {collarButtons.map((button) => (
                <SelectItem key={button.value} value={button.value}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={button.image || undefined}
                      alt={button.alt}
                      className="min-w-12 h-12 object-contain"
                    />
                    <span>{button.displayText}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.collar.smallTabaggi`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2 min-w-[60px]">
            <Checkbox
              id={`smallTabaggi-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={isFormDisabled}
            />
            <label htmlFor={`smallTabaggi-${row.index}`}>
              <img
                src={smallTabaggiImage}
                alt="Small Tabaggi"
                className="min-w-8 h-8 object-contain"
              />
            </label>
          </div>
        )}
      />
    </div>
  );
};

export const JabzoorCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control, setValue } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const [jabzour1, jabzour2] = useWatch({
    name: [
      `styleOptions.${row.index}.jabzoor.jabzour1`,
      `styleOptions.${row.index}.jabzoor.jabzour2`,
    ],
  });

  React.useEffect(() => {
    if (jabzour1 === "JAB_SHAAB") {
      // Auto-set jabzour2 to Magfi Murabba and hashwa to DOUBLE when Shaab is selected
      if (!jabzour2) {
        setValue(
          `styleOptions.${row.index}.jabzoor.jabzour2`,
          "JAB_MAGFI_MURABBA",
        );
      }
      setValue(`styleOptions.${row.index}.jabzoor.jabzour_thickness`, "DOUBLE");
    } else {
      // Clear jabzour2 when jabzour1 is not SHAAB
      setValue(`styleOptions.${row.index}.jabzoor.jabzour2`, undefined);
    }
  }, [jabzour1, jabzour2, setValue, row.index]);

  return (
    <div className="min-w-[420px] flex flex-row space-x-2">
      <Controller
        name={`styleOptions.${row.index}.jabzoor.jabzour1`}
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col space-y-1">
            <Select
              onValueChange={field.onChange}
              value={field.value as string}
              disabled={isFormDisabled}
            >
              <SelectTrigger
                className={cn(
                  "bg-background border-border/60 min-w-[120px]",
                  fieldState.error && "border-destructive",
                )}
              >
                {jabzour1 ? (
                  <img
                    src={
                      jabzourTypes.find((j) => j.value === jabzour1)?.image ||
                      undefined
                    }
                    alt={jabzourTypes.find((j) => j.value === jabzour1)?.alt}
                    className="min-w-10 h-10 object-contain"
                  />
                ) : (
                  <SelectValue placeholder="Select Type" />
                )}
              </SelectTrigger>
              <SelectContent>
                {jabzourTypes.map((jabzourType) => (
                  <SelectItem key={jabzourType.value} value={jabzourType.value}>
                    <div className="flex items-center space-x-2">
                      <img
                        src={jabzourType.image || undefined}
                        alt={jabzourType.alt}
                        className="min-w-12 h-12 object-contain"
                      />
                      <span>{jabzourType.displayText}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
      <Plus className="min-w-5 h-6 mt-2" />
      <Controller
        name={`styleOptions.${row.index}.jabzoor.jabzour2`}
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col space-y-1">
            <Select
              onValueChange={field.onChange}
              value={field.value as string}
              disabled={isFormDisabled || jabzour1 !== "JAB_SHAAB"}
            >
              <SelectTrigger
                className={cn(
                  "bg-background border-border/60 min-w-[120px]",
                  fieldState.error && "border-destructive",
                )}
              >
                {jabzour2 ? (
                  <img
                    src={
                      jabzourTypes.find((j) => j.value === jabzour2)?.image ||
                      undefined
                    }
                    alt={jabzourTypes.find((j) => j.value === jabzour2)?.alt}
                    className="min-w-10 h-10 object-contain"
                  />
                ) : (
                  <SelectValue placeholder="Select Type" />
                )}
              </SelectTrigger>
              <SelectContent>
                {jabzourTypes
                  .filter((j) => j.value !== "JAB_SHAAB")
                  .map((jabzourType) => (
                    <SelectItem
                      key={jabzourType.value}
                      value={jabzourType.value}
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={jabzourType.image || undefined}
                          alt={jabzourType.alt}
                          className="min-w-12 h-12 object-contain"
                        />
                        <span>{jabzourType.displayText}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.jabzoor.jabzour_thickness`}
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col space-y-1">
            <Select
              onValueChange={field.onChange}
              value={field.value as string}
              disabled={isFormDisabled}
            >
              <SelectTrigger
                className={cn(
                  "bg-background border-border/60 min-w-[60px]",
                  fieldState.error && "border-destructive",
                )}
              >
                <SelectValue placeholder="Select Thickness" />
              </SelectTrigger>
              <SelectContent>
                {ThicknessOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={option.className}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export const FrontPocketCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control, setValue, getValues } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const frontPocketType = useWatch({
    name: `styleOptions.${row.index}.frontPocket.front_pocket_type`,
  });

  // Auto-change NO HASHWA to DOUBLE when Mudwwar front pocket is selected (not Magfi)
  React.useEffect(() => {
    const isMudawwar = frontPocketType === "FRO_MUDAWWAR_FRONT_POCKET";
    if (isMudawwar) {
      const currentThickness = getValues(
        `styleOptions.${row.index}.frontPocket.front_pocket_thickness`,
      );
      if (currentThickness === "NO HASHWA") {
        setValue(
          `styleOptions.${row.index}.frontPocket.front_pocket_thickness`,
          "DOUBLE",
        );
      }
    }
  }, [frontPocketType, setValue, getValues, row.index]);

  return (
    <div className="min-w-[300px] flex flex-row space-x-2 justify-center items-center">
      <Controller
        name={`styleOptions.${row.index}.frontPocket.front_pocket_type`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[120px]">
              {frontPocketType ? (
                <img
                  src={
                    topPocketTypes.find((j) => j.value === frontPocketType)
                      ?.image || undefined
                  }
                  alt={
                    topPocketTypes.find((j) => j.value === frontPocketType)?.alt
                  }
                  className="min-w-7 h-7 object-contain"
                />
              ) : (
                <SelectValue placeholder="Select Type" />
              )}
            </SelectTrigger>
            <SelectContent>
              {topPocketTypes.map((tpt) => (
                <SelectItem key={tpt.value} value={tpt.value}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={tpt.image || undefined}
                      alt={tpt.alt}
                      className="min-w-12 h-12 object-contain"
                    />
                    <span>{tpt.displayText}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.frontPocket.front_pocket_thickness`}
        control={control}
        render={({ field }) => {
          // Only filter out NO HASHWA when front pocket is Mudwwar type (not Magfi)
          const isMudawwar = frontPocketType === "FRO_MUDAWWAR_FRONT_POCKET";
          const filteredOptions = isMudawwar
            ? ThicknessOptions.filter((option) => option.value !== "NO HASHWA")
            : ThicknessOptions;

          return (
            <Select
              onValueChange={field.onChange}
              value={field.value as string}
              disabled={isFormDisabled || !frontPocketType}
            >
              <SelectTrigger className="bg-background border-border/60 min-w-[60px]">
                <SelectValue placeholder="Select Thickness" />
              </SelectTrigger>
              <SelectContent>
                {filteredOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={option.className}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
};

export const AccessoriesCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control, setValue, getValues } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;

  // Handler to update all rows when first row changes
  const handleAccessoryChange = (field: string, value: boolean) => {
    if (row.index === 0) {
      // Get all style options to determine how many rows exist
      const allStyleOptions = getValues("styleOptions") as StyleOptionsSchema[];

      // Update all rows with the new value
      allStyleOptions.forEach((_, index) => {
        setValue(`styleOptions.${index}.${field}` as any, value);
      });
    }
  };

  return (
    <div className="min-w-[280px] flex flex-row space-x-4 items-center">
      <Controller
        name={`styleOptions.${row.index}.accessories.phone`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`phone-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={(value) => {
                if (row.index === 0) {
                  handleAccessoryChange("accessories.phone", value as boolean);
                } else {
                  field.onChange(value);
                }
              }}
              disabled={isFormDisabled}
            />
            <label htmlFor={`phone-${row.index}`}>
              <img
                src={phoneIcon}
                alt="Phone Pocket"
                className="min-w-14 h-20 object-contain"
              />
            </label>
          </div>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.accessories.wallet`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`wallet-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={(value) => {
                if (row.index === 0) {
                  handleAccessoryChange("accessories.wallet", value as boolean);
                } else {
                  field.onChange(value);
                }
              }}
              disabled={isFormDisabled}
            />
            <label htmlFor={`wallet-${row.index}`}>
              <img
                src={walletIcon}
                alt="Wallet Pocket"
                className="min-w-14 h-20 object-contain"
              />
            </label>
          </div>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.accessories.pen_holder`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`pen_holder-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={(value) => {
                if (row.index === 0) {
                  handleAccessoryChange(
                    "accessories.pen_holder",
                    value as boolean,
                  );
                } else {
                  field.onChange(value);
                }
              }}
              disabled={isFormDisabled}
            />
            <label htmlFor={`pen_holder-${row.index}`}>
              <img
                src={penIcon}
                alt="Pen Holder"
                className="min-w-14 h-20 object-contain"
              />
            </label>
          </div>
        )}
      />
    </div>
  );
};

export const CuffsCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control, setValue } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const [hasCuffs, cuffsType] = useWatch({
    name: [
      `styleOptions.${row.index}.cuffs.hasCuffs`,
      `styleOptions.${row.index}.cuffs.cuffs_type`,
    ],
  });

  // When hasCuffs changes, update type and thickness accordingly
  React.useEffect(() => {
    if (!hasCuffs) {
      // No cuffs selected - set to NO CUFF
      setValue(`styleOptions.${row.index}.cuffs.cuffs_type`, "CUF_NO_CUFF");
      setValue(`styleOptions.${row.index}.cuffs.cuffs_thickness`, "NO HASHWA");
    } else {
      // Cuffs enabled - set default values if currently set to NO CUFF
      if (cuffsType === "CUF_NO_CUFF") {
        setValue(`styleOptions.${row.index}.cuffs.cuffs_type`, "CUF_FRENCH");
        setValue(`styleOptions.${row.index}.cuffs.cuffs_thickness`, "SINGLE");
      }
    }
  }, [hasCuffs, cuffsType, setValue, row.index]);

  return (
    <div className="min-w-[380px] flex flex-row space-x-2 items-center">
      <Controller
        name={`styleOptions.${row.index}.cuffs.hasCuffs`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2 min-w-20">
            <Checkbox
              id={`hasCuffs-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={isFormDisabled}
            />
            <label
              htmlFor={`hasCuffs-${row.index}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Cuffs
            </label>
          </div>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.cuffs.cuffs_type`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled || !hasCuffs}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[120px]">
              {cuffsType ? (
                cuffTypes.find((c) => c.value === cuffsType)?.image ? (
                  <img
                    src={
                      cuffTypes.find((c) => c.value === cuffsType)?.image ||
                      undefined
                    }
                    alt={
                      cuffTypes.find((c) => c.value === cuffsType)?.alt ?? ""
                    }
                    className="min-w-10 h-10 object-contain"
                  />
                ) : (
                  <span>
                    {cuffTypes.find((c) => c.value === cuffsType)?.displayText}
                  </span>
                )
              ) : (
                <SelectValue placeholder="Select Type" />
              )}
            </SelectTrigger>
            <SelectContent>
              {cuffTypes.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  <div className="flex items-center space-x-2">
                    {ct.image && (
                      <img
                        src={ct.image || undefined}
                        alt={ct.alt ?? ""}
                        className="min-w-12 h-12 object-contain"
                      />
                    )}
                    <span>{ct.displayText}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.cuffs.cuffs_thickness`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled || !hasCuffs}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[60px]">
              <SelectValue placeholder="Select Thickness" />
            </SelectTrigger>
            <SelectContent>
              {ThicknessOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={option.className}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export const ExtraAmountCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control, setValue } = useFormContext();
  const meta = table.options.meta as {
    styles?: Style[];
    stitchingPrice?: number;
  };
  const styles = meta?.styles || [];
  const stitchingPrice = meta?.stitchingPrice || 9;

  // Watch all the style option fields to recalculate when they change
  const styleOptions = useWatch({
    control,
    name: `styleOptions.${row.index}` as any,
  }) as StyleOptionsSchema;

  // Calculate the total price based on selected styles (style options only)
  const stylePrice = React.useMemo(() => {
    if (!styleOptions || !styles.length) return 0;
    return calculateStylePrice(styleOptions, styles);
  }, [styleOptions, styles]);

  // Total price including stitching (9 KWD standard stitching)
  const totalPrice = stylePrice + stitchingPrice;

  // Update the extraAmount field with total price (including stitching)
  React.useEffect(() => {
    setValue(`styleOptions.${row.index}.extraAmount`, totalPrice);
  }, [totalPrice, setValue, row.index]);

  return (
    <Controller
      name={`styleOptions.${row.index}.extraAmount`}
      control={control}
      render={() => (
        <div className="min-w-[100px] flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">
            {totalPrice > 0 ? `${totalPrice} KD` : "-"}
          </span>
        </div>
      )}
    />
  );
};
