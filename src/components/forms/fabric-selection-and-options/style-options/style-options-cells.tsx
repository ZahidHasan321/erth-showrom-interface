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
  penIcon,
  phoneIcon,
  smallTabaggiImage,
  thicknessOptions as ThicknessOptions,
  topPocketTypes,
  walletIcon,
} from "../constants";
import type { CellContext } from "@tanstack/react-table";
import type { StyleOptionsSchema } from "./style-options-schema";

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
          <SelectTrigger className="min-w-[150px]">
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
            <SelectTrigger className="min-w-[140px]">
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
            <SelectTrigger className="min-w-[120px]">
              {collarType ? (
                <img
                  src={
                    collarTypes.find((c) => c.value === collarType)?.image ||
                    undefined
                  }
                  alt={collarTypes.find((c) => c.value === collarType)?.alt}
                  className="min-w-[40px] h-10 object-contain"
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
                      className="min-w-[48px] h-12 object-contain"
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
            <SelectTrigger className="min-w-[120px]">
              {collarButton ? (
                <img
                  src={
                    collarButtons.find((b) => b.value === collarButton)?.image ||
                    undefined
                  }
                  alt={
                    collarButtons.find((b) => b.value === collarButton)?.alt
                  }
                  className="min-w-[40px] h-10 object-contain"
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
                      className="min-w-[48px] h-12 object-contain"
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
                className="min-w-[32px] h-8 object-contain"
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
    if (jabzour1 !== "ZIP") {
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
            <SelectTrigger className="min-w-[120px]">
              {jabzour1 ? (
                <img
                  src={
                    jabzourTypes.find((j) => j.value === jabzour1)?.image ||
                    undefined
                  }
                  alt={jabzourTypes.find((j) => j.value === jabzour1)?.alt}
                  className="min-w-[40px] h-10 object-contain"
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
                      className="min-w-[48px] h-12 object-contain"
                    />
                    <span>{jabzourType.displayText}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Plus className="min-w-[20px] h-6 mt-2" />
      {jabzour1 === "ZIP" ? (
        <Controller
          name={`styleOptions.${row.index}.jabzoor.jabzour2`}
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value as string}
              disabled={isFormDisabled}
            >
              <SelectTrigger className="min-w-[120px]">
                {jabzour2 ? (
                  <img
                    src={
                      jabzourTypes.find((j) => j.value === jabzour2)?.image ||
                      undefined
                    }
                    alt={
                      jabzourTypes.find((j) => j.value === jabzour2)?.alt
                    }
                    className="min-w-[40px] h-10 object-contain"
                  />
                ) : (
                  <SelectValue placeholder="Select Type" />
                )}
              </SelectTrigger>
              <SelectContent>
                {jabzourTypes
                  .filter((j) => j.value !== "ZIP")
                  .map((jabzourType) => (
                    <SelectItem
                      key={jabzourType.value}
                      value={jabzourType.value}
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={jabzourType.image || undefined}
                          alt={jabzourType.alt}
                          className="min-w-[48px] h-12 object-contain"
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
            <SelectTrigger className="min-w-[60px]">
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
  return (
    <div className="min-w-[220px] flex flex-row space-x-4 justify-center items-center">
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
                className="min-w-[40px] h-14 object-contain"
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
                className="min-w-[40px] h-14 object-contain"
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
            <SelectTrigger className="min-w-[120px]">
              {frontPocketType ? (
                <img
                  src={
                    topPocketTypes.find((j) => j.value === frontPocketType)
                      ?.image || undefined
                  }
                  alt={
                    topPocketTypes.find((j) => j.value === frontPocketType)?.alt
                  }
                  className="min-w-[28px] h-7 object-contain"
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
                      className="min-w-[48px] h-12 object-contain"
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
            <SelectTrigger className="min-w-[60px]">
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
                className="min-w-[40px] h-14 object-contain"
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
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const cuffsType = useWatch({
    name: `styleOptions.${row.index}.cuffs.cuffs_type`,
  });

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
            <SelectTrigger className="min-w-[120px]">
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
                    className="min-w-[40px] h-10 object-contain"
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
                        className="min-w-[48px] h-12 object-contain"
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
            <SelectTrigger className="min-w-[60px]">
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
