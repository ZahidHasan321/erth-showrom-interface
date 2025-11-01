"use client";

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
  sidePocketTypes,
  penIcon,
  phoneIcon,
  smallTabaggiImage,
  thicknessOptions as ThicknessOptions,
  topPocketTypes,
  walletIcon,
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
            <SelectItem value="designer">Designer</SelectItem>
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
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  return (
    <div className="min-w-[180px] flex items-center space-x-4 px-2">
      <Controller
        name={`styleOptions.${row.index}.lines`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[140px]">
              <SelectValue placeholder="Select Lines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_lines">No Lines</SelectItem>
              <SelectItem value="line1">Line 1</SelectItem>
              <SelectItem value="line2">Line 2</SelectItem>
            </SelectContent>
          </Select>
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
                    collarButtons.find((b) => b.value === collarButton)?.image ||
                    undefined
                  }
                  alt={
                    collarButtons.find((b) => b.value === collarButton)?.alt
                  }
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
    if (jabzour1 !== "JAB_SHAAB") {
      setValue(`styleOptions.${row.index}.jabzoor.jabzour2`, null);
    }
  }, [jabzour1, setValue, row.index]);

  return (
    <div className="min-w-[420px] flex flex-row space-x-2">
      <Controller
        name={`styleOptions.${row.index}.jabzoor.jabzour1`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[120px]">
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
        )}
      />
      <Plus className="min-w-5 h-6 mt-2" />
      {jabzour1 === "JAB_SHAAB" ? (
        <Controller
          name={`styleOptions.${row.index}.jabzoor.jabzour2`}
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value as string}
              disabled={isFormDisabled}
            >
              <SelectTrigger className="bg-background border-border/60 min-w-[120px]">
                {jabzour2 ? (
                  <img
                    src={
                      jabzourTypes.find((j) => j.value === jabzour2)?.image ||
                      undefined
                    }
                    alt={
                      jabzourTypes.find((j) => j.value === jabzour2)?.alt
                    }
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
          )}
        />
      ) : (
        <div className="min-w-[120px] h-10 border rounded-md bg-gray-100" />
      )}
      <Controller
        name={`styleOptions.${row.index}.jabzoor.jabzour_thickness`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
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

export const SidePocketCell = ({
  row,
  table,
}: CellContext<StyleOptionsSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const sidePocketType = useWatch({
    name: `styleOptions.${row.index}.sidePocket.side_pocket_type`,
  });

  return (
    <div className="min-w-[360px] flex flex-row space-x-2 items-center">
      <Controller
        name={`styleOptions.${row.index}.sidePocket.side_pocket_type`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
          >
            <SelectTrigger className="bg-background border-border/60 min-w-[120px]">
              {sidePocketType ? (
                <img
                  src={
                    sidePocketTypes.find((j) => j.value === sidePocketType)
                      ?.image || undefined
                  }
                  alt={
                    sidePocketTypes.find((j) => j.value === sidePocketType)?.alt
                  }
                  className="min-w-7 h-7 object-contain"
                />
              ) : (
                <SelectValue placeholder="Select Type" />
              )}
            </SelectTrigger>
            <SelectContent>
              {sidePocketTypes.map((spt) => (
                <SelectItem key={spt.value} value={spt.value}>
                  <div className="flex items-center space-x-2">
                    <img
                      src={spt.image || undefined}
                      alt={spt.alt}
                      className="min-w-12 h-12 object-contain"
                    />
                    <span>{spt.displayText}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.sidePocket.phone`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`side_pocket_phone-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={isFormDisabled}
            />
            <label htmlFor={`side_pocket_phone-${row.index}`}>
              <img
                src={phoneIcon}
                alt="Phone Pocket"
                className="min-w-10 h-14 object-contain"
              />
            </label>
          </div>
        )}
      />
      <Controller
        name={`styleOptions.${row.index}.sidePocket.wallet`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`side_pocket_wallet-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={isFormDisabled}
            />
            <label htmlFor={`side_pocket_wallet-${row.index}`}>
              <img
                src={walletIcon}
                alt="Wallet Pocket"
                className="min-w-10 h-14 object-contain"
              />
            </label>
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
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const frontPocketType = useWatch({
    name: `styleOptions.${row.index}.frontPocket.front_pocket_type`,
  });

  return (
    <div className="min-w-[420px] flex flex-row space-x-2 justify-center items-center">
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
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
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
      <Controller
        name={`styleOptions.${row.index}.frontPocket.pen_holder`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2 min-w-[60px]">
            <Checkbox
              id={`pen_holder-${row.index}`}
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={isFormDisabled}
            />
            <label htmlFor={`pen_holder-${row.index}`}>
              <img
                src={penIcon}
                alt="Pen Holder"
                className="min-w-10 h-14 object-contain"
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
  const [cuffsType, cuffsThickness] = useWatch({
    name: [
      `styleOptions.${row.index}.cuffs.cuffs_type`,
      `styleOptions.${row.index}.cuffs.cuffs_thickness`,
    ],
  });

  // Auto-set thickness to "NO HASHWA" when "NO CUFF" is selected
  React.useEffect(() => {
    if (cuffsType === "CUF_NO_CUFF" && cuffsThickness !== "NO HASHWA") {
      setValue(`styleOptions.${row.index}.cuffs.cuffs_thickness`, "NO HASHWA");
    }
    // When changing FROM "NO CUFF" to another type, reset thickness to "SINGLE"
    if (cuffsType !== "CUF_NO_CUFF" && cuffsThickness === "NO HASHWA") {
      setValue(`styleOptions.${row.index}.cuffs.cuffs_thickness`, "SINGLE");
    }
  }, [cuffsType, cuffsThickness, setValue, row.index]);

  return (
    <div className="min-w-[300px] flex flex-row space-x-2">
      <Controller
        name={`styleOptions.${row.index}.cuffs.cuffs_type`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={isFormDisabled}
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
                    {
                      cuffTypes.find((c) => c.value === cuffsType)
                        ?.displayText
                    }
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
            disabled={isFormDisabled}
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
  };
  const styles = meta?.styles || [];

  // Watch all the style option fields to recalculate when they change
  const styleOptions = useWatch({
    control,
    name: `styleOptions.${row.index}` as any,
  }) as StyleOptionsSchema;

  // Calculate the total price based on selected styles
  const totalPrice = React.useMemo(() => {
    if (!styleOptions || !styles.length) return 0;
    return calculateStylePrice(styleOptions, styles);
  }, [styleOptions, styles]);

  // Update the extraAmount field whenever the total changes
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
