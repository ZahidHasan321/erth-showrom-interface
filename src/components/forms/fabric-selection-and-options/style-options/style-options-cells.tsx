"use client";

import { useFormContext, Controller } from "react-hook-form";
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
  jabzourTypes,
  topPocketTypes,
  sleeveTypes,
  phoneIcon,
  walletIcon,
  smallTabaggiImage,
  penIcon,
  jabzourThicknessOptions as ThicknessOptions,
} from "../constants";

export function StyleOptionIdCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={`styleOptions.${rowIndex}.styleOptionId`}
      control={control}
      render={({ field }) => <span>{field.value}</span>}
    />
  );
}

export function StyleCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={`styleOptions.${rowIndex}.style`}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
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
}

export function LinesCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <div className="flex items-center space-x-4 px-2">
      <Controller
        name={`styleOptions.${rowIndex}.lines`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
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
}

export function CollarCell({ rowIndex }: { rowIndex: number }) {
  const { control, watch } = useFormContext();
  const collarType = watch(`styleOptions.${rowIndex}.collar.collarType`);
  const collarButton = watch(`styleOptions.${rowIndex}.collar.collarButton`);

  return (
    <div className="flex flex-row space-x-2">
      <Controller
        name={`styleOptions.${rowIndex}.collar.collarType`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              {collarType ? (
                <img
                  src={collarTypes.find((c) => c.value === collarType)?.image}
                  alt={collarTypes.find((c) => c.value === collarType)?.alt}
                  className="h-10 object-contain"
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
                      className="h-12 object-contain"
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
        name={`styleOptions.${rowIndex}.collar.collarButton`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              {collarButton ? (
                <img
                  src={collarButtons.find((b) => b.value === collarButton)?.image}
                  alt={collarButtons.find((b) => b.value === collarButton)?.alt}
                  className="h-10 object-contain"
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
                      className="h-12 object-contain"
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
        name={`styleOptions.${rowIndex}.collar.smallTabaggi`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`smallTabaggi-${rowIndex}`}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={`smallTabaggi-${rowIndex}`}>
              <img
                src={smallTabaggiImage}
                alt="Small Tabaggi"
                className="h-8 object-contain"
              />
            </label>
          </div>
        )}
      />
    </div>
  );
}

export function JabzoorCell({ rowIndex }: { rowIndex: number }) {
  const { control, watch } = useFormContext();
  const jabzour1 = watch(`styleOptions.${rowIndex}.jabzoor.jabzour1`);
  const jabzour2 = watch(`styleOptions.${rowIndex}.jabzoor.jabzour2`);

  return (
    <div className="flex flex-row space-x-2">
      <Controller
        name={`styleOptions.${rowIndex}.jabzoor.jabzour1`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              {jabzour1 ? (
                <img
                  src={jabzourTypes.find((j) => j.value === jabzour1)?.image}
                  alt={jabzourTypes.find((j) => j.value === jabzour1)?.alt}
                  className="h-10 object-contain"
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
                      className="h-12 object-contain"
                    />
                    <span>{jabzourType.displayText}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Plus className="h-6 mt-2" />
      <Controller
        name={`styleOptions.${rowIndex}.jabzoor.jabzour2`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              {jabzour2 ? (
                <img
                  src={jabzourTypes.find((j) => j.value === jabzour2)?.image}
                  alt={jabzourTypes.find((j) => j.value === jabzour2)?.alt}
                  className="h-10 object-contain"
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
                      className="h-12 object-contain"
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
        name={`styleOptions.${rowIndex}.jabzoor.jabzour_thickness`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select Thickness" />
            </SelectTrigger>
            <SelectContent>
              {ThicknessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className={option.className}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

export function SidePocketCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <div className="flex flex-row space-x-4 justify-center items-center">
      <Controller
        name={`styleOptions.${rowIndex}.sidePocket.phone`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`side_pocket_phone-${rowIndex}`}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={`side_pocket_phone-${rowIndex}`}>
              <img
                src={phoneIcon}
                alt="Phone Pocket"
                className="h-14 object-contain"
              />
            </label>
          </div>
        )}
      />
      <Controller
        name={`styleOptions.${rowIndex}.sidePocket.wallet`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`side_pocket_wallet-${rowIndex}`}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={`side_pocket_wallet-${rowIndex}`}>
              <img
                src={walletIcon}
                alt="Wallet Pocket"
                className="h-14 object-contain"
              />
            </label>
          </div>
        )}
      />
    </div>
  );
}

export function FrontPocketCell({ rowIndex }: { rowIndex: number }) {
  const { control, watch } = useFormContext();
  const frontPocketType = watch(
    `styleOptions.${rowIndex}.frontPocket.front_pocket_type`
  );

  return (
    <div className="flex flex-row space-x-2 justify-center items-center">
      <Controller
        name={`styleOptions.${rowIndex}.frontPocket.front_pocket_type`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              {frontPocketType ? (
                <img
                  src={
                    topPocketTypes.find((j) => j.value === frontPocketType)?.image
                  }
                  alt={
                    topPocketTypes.find((j) => j.value === frontPocketType)?.alt
                  }
                  className="h-7 object-contain"
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
                      className="h-12 object-contain"
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
        name={`styleOptions.${rowIndex}.frontPocket.front_pocket_thickness`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select Thickness" />
            </SelectTrigger>
            <SelectContent>
              {ThicknessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className={option.className}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name={`styleOptions.${rowIndex}.frontPocket.pen_holder`}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`pen_holder-${rowIndex}`}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={`pen_holder-${rowIndex}`}>
              <img
                src={penIcon}
                alt="Pen Holder"
                className="h-14 object-contain"
              />
            </label>
          </div>
        )}
      />
    </div>
  );
}

export function CuffsCell({ rowIndex }: { rowIndex: number }) {
  const { control, watch } = useFormContext();
  const cuffsType = watch(`styleOptions.${rowIndex}.cuffs.cuffs_type`);

  return (
    <div className="flex flex-row space-x-2">
      <Controller
        name={`styleOptions.${rowIndex}.cuffs.cuffs_type`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              {cuffsType ? (
                <img
                  src={sleeveTypes.find((c) => c.value === cuffsType)?.image}
                  alt={sleeveTypes.find((c) => c.value === cuffsType)?.alt}
                  className="h-10 object-contain"
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
                      className="h-12 object-contain"
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
        name={`styleOptions.${rowIndex}.cuffs.cuffs_thickness`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select Thickness" />
            </SelectTrigger>
            <SelectContent>
              {ThicknessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className={option.className}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
