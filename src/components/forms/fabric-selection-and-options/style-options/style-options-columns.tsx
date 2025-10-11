"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Plus } from "lucide-react";

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
  jabzourThicknessOptions,
} from "../constants";
import type { StyleOptionsSchema } from "./style-options-schema";

export const columns: ColumnDef<StyleOptionsSchema>[] = [
  {
    accessorKey: "styleOptionId",
    header: "Style Option Id",
    cell: ({ row }) => {
      return <div className="w-20">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "style",
    header: "Style",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`styleOptions.${row.index}.style`}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kuwaiti">Kuwaiti</SelectItem>
                <SelectItem value="saudi">Saudi</SelectItem>
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
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="w-40 flex items-center space-x-4 px-2">
          <Controller
            name={`styleOptions.${row.index}.lines.line1`}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`line1-${row.index}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor={`line1-${row.index}`}>Line 1</label>
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
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor={`line2-${row.index}`}>Line 2</label>
              </div>
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "collar",
    header: "Collar",
    cell: ({ row }) => {
      const { control, watch } = useFormContext();
      const collarType = watch(`styleOptions.${row.index}.collar.collarType`);
      const collarButton = watch(
        `styleOptions.${row.index}.collar.collarButton`
      );

      return (
        <div className="w-[350px] flex flex-row space-x-2">
          <Controller
            name={`styleOptions.${row.index}.collar.collarType`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-32">
                  {collarType ? (
                    <img
                      src={
                        collarTypes.find((c) => c.value === collarType)?.image
                      }
                      alt={collarTypes.find((c) => c.value === collarType)?.alt}
                      className="w-10 h-10 object-contain"
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
                          className="w-12 h-12 object-contain"
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
                <SelectTrigger className="w-32">
                  {collarButton ? (
                    <img
                      src={
                        collarButtons.find((b) => b.value === collarButton)
                          ?.image
                      }
                      alt={
                        collarButtons.find((b) => b.value === collarButton)?.alt
                      }
                      className="w-10 h-10 object-contain"
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
                          className="w-12 h-12 object-contain"
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`smallTabaggi-${row.index}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor={`smallTabaggi-${row.index}`}>
                  <img
                    src={smallTabaggiImage}
                    alt="Small Tabaggi"
                    className="w-8 h-8 object-contain"
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
    cell: ({ row }) => {
      const { control, watch } = useFormContext();
      const jabzour1 = watch(`styleOptions.${row.index}.jabzoor.jabzour1`);
      const jabzour2 = watch(`styleOptions.${row.index}.jabzoor.jabzour2`);

      return (
        <div className="w-[450px] flex flex-row space-x-2">
          <Controller
            name={`styleOptions.${row.index}.jabzoor.jabzour1`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-32">
                  {jabzour1 ? (
                    <img
                      src={
                        jabzourTypes.find((j) => j.value === jabzour1)?.image
                      }
                      alt={jabzourTypes.find((j) => j.value === jabzour1)?.alt}
                      className="w-12 h-12 object-contain"
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
                          className="w-12 h-12 object-contain"
                        />
                        <span>{jabzourType.displayText}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Plus className="w-6 h-6 mt-2" />
          <Controller
            name={`styleOptions.${row.index}.jabzoor.jabzour2`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-32">
                  {jabzour2 ? (
                    <img
                      src={
                        jabzourTypes.find((j) => j.value === jabzour2)?.image
                      }
                      alt={jabzourTypes.find((j) => j.value === jabzour2)?.alt}
                      className="w-10 h-10 object-contain"
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
                          className="w-12 h-12 object-contain"
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
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Thickness" />
                </SelectTrigger>
                <SelectContent>
                  {jabzourThicknessOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
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
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="w-[250px] flex flex-row space-x-4 justify-center items-center">
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
                    className="w-14 h-14 object-contain"
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
                    className="w-14 h-14 object-contain"
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
    cell: ({ row }) => {
      const { control, watch } = useFormContext();
      const frontPocketType = watch(
        `styleOptions.${row.index}.frontPocket.front_pocket_type`
      );

      return (
        <div className="w-[450px] flex flex-row space-x-2 justify-center items-center">
          <Controller
            name={`styleOptions.${row.index}.frontPocket.front_pocket_type`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-32">
                  {frontPocketType ? (
                    <img
                      src={
                        topPocketTypes.find((j) => j.value === frontPocketType)
                          ?.image
                      }
                      alt={
                        topPocketTypes.find((j) => j.value === frontPocketType)
                          ?.alt
                      }
                      className="w-7 h-7 object-contain"
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
                          className="w-12 h-12 object-contain"
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
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Thickness" />
                </SelectTrigger>
                <SelectContent>
                  {jabzourThicknessOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`pen_holder-${row.index}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor={`pen_holder-${row.index}`}>
                  <img
                    src={penIcon}
                    alt="Pen Holder"
                    className="w-14 h-14 object-contain"
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
    cell: ({ row }) => {
      const { control, watch } = useFormContext();
      const cuffsType = watch(`styleOptions.${row.index}.cuffs.cuffs_type`);

      return (
        <div className="w-[300px] flex flex-row space-x-2">
          <Controller
            name={`styleOptions.${row.index}.cuffs.cuffs_type`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-32">
                  {cuffsType ? (
                    <img
                      src={
                        sleeveTypes.find((c) => c.value === cuffsType)?.image
                      }
                      alt={sleeveTypes.find((c) => c.value === cuffsType)?.alt}
                      className="w-10 h-10 object-contain"
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
                          className="w-12 h-12 object-contain"
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
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Thickness" />
                </SelectTrigger>
                <SelectContent>
                  {jabzourThicknessOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
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
    accessorKey: "extraAmount",
    header: "Extras Amount / سعر الإضافات",
    cell: () => {
      return <div className="w-40">100</div>;
    },
  },
  {
    id: "delete",
    cell: ({ row, table }) => {
      const handleDelete = () => {
        table.options.meta?.removeRow(row.index);
      };

      return (
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className={"w-10 h-10"} />
        </Button>
      );
    },
  },
];
