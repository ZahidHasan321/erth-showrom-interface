"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

import {
  collarButtons,
  collarTypes,
  jabzourTypes,
  topPocketTypes,
  sleeveTypes,
  phoneIcon,
  walletIcon,
  smallTabaggiImage,
  penIcon,
  jabzourThicknessOptions as ThicknessOptions,
} from "../constants";
import type { StyleOptionsSchema } from "./style-options-schema";

export const columns: ColumnDef<StyleOptionsSchema>[] = [
  {
    accessorKey: "styleOptionId",
    header: "Style Option Id",
    minSize: 100,
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`styleOptions.${row.index}.styleOptionId`}
          control={control}
          defaultValue={row.original.styleOptionId}
          render={({ field }) => <span>{field.value}</span>}
        />
      );
    },
  },
  {
    accessorKey: "style",
    header: "Style",
    minSize: 150,
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`styleOptions.${row.index}.style`}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="min-w-[150px]">
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kuwaiti">Kuwaiti</SelectItem>
                <SelectItem value="saudi">Designer</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      );
    },
  },
  {
    header: "Lines",
    id: "lines",
    minSize: 180,
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="min-w-[180px] flex items-center space-x-4 px-2">
          <Controller
            name={`styleOptions.${row.index}.lines`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
    },
  },
  {
    accessorKey: "collar",
    header: "Collar",
    minSize: 350,
    cell: ({ row }) => {
      const { control } = useFormContext();
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
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="min-w-[120px]">
                  {collarType ? (
                    <img
                      src={
                        collarTypes.find((c) => c.value === collarType)?.image
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
                          src={ct.image}
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
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="min-w-[120px]">
                  {collarButton ? (
                    <img
                      src={
                        collarButtons.find((b) => b.value === collarButton)
                          ?.image
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
                          src={button.image}
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
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
    },
  },
  {
    accessorKey: "jabzoor",
    header: "Jabzoor",
    minSize: 420,
    cell: ({ row }) => {
      const { control } = useFormContext();
      const [jabzour1, jabzour2] = useWatch({
        name: [
          `styleOptions.${row.index}.jabzoor.jabzour1`,
          `styleOptions.${row.index}.jabzoor.jabzour2`,
        ],
      });

      return (
        <div className="min-w-[420px] flex flex-row space-x-2">
          <Controller
            name={`styleOptions.${row.index}.jabzoor.jabzour1`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="min-w-[120px]">
                  {jabzour1 ? (
                    <img
                      src={
                        jabzourTypes.find((j) => j.value === jabzour1)?.image
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
                          src={jabzourType.image}
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
          <Controller
            name={`styleOptions.${row.index}.jabzoor.jabzour2`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="min-w-[120px]">
                  {jabzour2 ? (
                    <img
                      src={
                        jabzourTypes.find((j) => j.value === jabzour2)?.image
                      }
                      alt={jabzourTypes.find((j) => j.value === jabzour2)?.alt}
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
                          src={jabzourType.image}
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
          <Controller
            name={`styleOptions.${row.index}.jabzoor.jabzour_thickness`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
    },
  },
  {
    accessorKey: "sidePocket",
    header: "Side Pocket",
    minSize: 220,
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="min-w-[220px] flex flex-row space-x-4 justify-center items-center">
          <Controller
            name={`styleOptions.${row.index}.sidePocket.phone`}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`side_pocket_phone-${row.index}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
    },
  },
  {
    accessorKey: "frontPocket",
    header: "Front Pocket",
    minSize: 420,
    cell: ({ row }) => {
      const { control } = useFormContext();
      const frontPocketType = useWatch({
        name: `styleOptions.${row.index}.frontPocket.front_pocket_type`,
      });

      return (
        <div className="min-w-[420px] flex flex-row space-x-2 justify-center items-center">
          <Controller
            name={`styleOptions.${row.index}.frontPocket.front_pocket_type`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="min-w-[120px]">
                  {frontPocketType ? (
                    <img
                      src={
                        topPocketTypes.find(
                          (j) => j.value === frontPocketType
                        )?.image
                      }
                      alt={
                        topPocketTypes.find(
                          (j) => j.value === frontPocketType
                        )?.alt
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
                          src={tpt.image}
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
              <Select onValueChange={field.onChange} value={field.value}>
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
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
    },
  },
  {
    accessorKey: "cuffs",
    header: "Cuffs",
    minSize: 300,
    cell: ({ row }) => {
      const { control } = useFormContext();
      const cuffsType = useWatch({
        name: `styleOptions.${row.index}.cuffs.cuffs_type`,
      });

      return (
        <div className="min-w-[300px] flex flex-row space-x-2">
          <Controller
            name={`styleOptions.${row.index}.cuffs.cuffs_type`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="min-w-[120px]">
                  {cuffsType ? (
                    <img
                      src={
                        sleeveTypes.find((c) => c.value === cuffsType)?.image
                      }
                      alt={sleeveTypes.find((c) => c.value === cuffsType)?.alt}
                      className="min-w-[40px] h-10 object-contain"
                    />
                  ) : (
                    <SelectValue placeholder="Select Type" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {sleeveTypes.map((ct) => (
                    <SelectItem key={ct.value} value={ct.value}>
                      <div className="flex items-center space-x-2">
                        <img
                          src={ct.image}
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
            name={`styleOptions.${row.index}.cuffs.cuffs_thickness`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
    },
  },
  {
    id: "delete",
    minSize: 80,
    cell: ({ row, table }) => {
      const handleDelete = () => {
        table.options.meta?.removeRow(row.index);
      };

      return (
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 size={42} color="red" />
        </Button>
      );
    },
  },
];