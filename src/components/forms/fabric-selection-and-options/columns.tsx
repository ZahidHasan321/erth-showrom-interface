"use client";

import { type ColumnDef } from "@tanstack/react-table";

export type FabricSelection = {
  id: string;
  copyPrevious: boolean;
  garmentId: string;
  brova: boolean;
  fabricSource: "In" | "Out" | "";
  fabricCode: string;
  fabricLength: string;
  measurementId: string;
  customize: boolean;
  styleOptionId: string;
  style: "kuwaiti" | "saudi" | "bahraini" | "fashion" | "3d" | "";
  line1: boolean;
  line2: boolean;
  collarType: string;
  collarButton: string;
  smallTabaggi: boolean;
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/ui/combobox";

// Import collar assets
import japaneseCollar from "@/assets/collar-assets/collar-types/JAPANES COLLAR.png";
import qalabiCollar from "@/assets/collar-assets/collar-types/QALABI COLLAR.png";
import roundCollar from "@/assets/collar-assets/collar-types/ROUND COLLAR.png";

import multiHoles from "@/assets/collar-assets/collar-buttons/MULTI HOLES.png";
import visibleButtonWithHole from "@/assets/collar-assets/collar-buttons/VISIBLE BUTTON WITH BUTTONHOLE.png";
import visiblePushButton from "@/assets/collar-assets/collar-buttons/VISIBLE PUSH-BUTTON.png";

import smallTabaggiImage from "@/assets/collar-assets/SMALL TABAGGI.png";

// Collar type mappings
const collarTypes = [
  {
    value: "JAPANES COLLAR",
    alt: "Japanese Collar",
    displayText: "Japanese",
    image: japaneseCollar,
  },
  {
    value: "QALABI COLLAR",
    alt: "Qalabi Collar",
    displayText: "Qalabi",
    image: qalabiCollar,
  },
  {
    value: "ROUND COLLAR",
    alt: "Round Collar",
    displayText: "Round",
    image: roundCollar,
  },
];

// Collar button mappings
const collarButtons = [
  {
    value: "MULTI HOLES",
    alt: "Multi Holes",
    displayText: "Multi Holes",
    image: multiHoles,
  },
  {
    value: "VISIBLE BUTTON WITH BUTTONHOLE",
    alt: "Visible Button with Buttonhole",
    displayText: "Visible Button",
    image: visibleButtonWithHole,
  },
  {
    value: "VISIBLE PUSH-BUTTON",
    alt: "Visible Push Button",
    displayText: "Push Button",
    image: visiblePushButton,
  },
];

export const columns: ColumnDef<FabricSelection>[] = [
  {
    header: "Option/Style",
    id: "option-style",
    columns: [
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => {
                // Implement copy previous logic
                console.log("Copying previous row", row.index - 1);
              }}
            >
              Copy Previous
            </Button>
          </div>
        ),
      },
    ],
  },
  {
    header: "Garment Details",
    id: "garment-details",
    meta: { className: "px-4" },
    columns: [
      {
        accessorKey: "garmentId",
        header: "Garment ID",
        cell: ({ row, table, column }) => (
          <Input
            value={row.original.garmentId}
            onChange={(e) =>
              table.options.meta?.updateData(
                row.index,
                column.id,
                e.target.value
              )
            }
          />
        ),
      },
      {
        accessorKey: "brova",
        header: "Brova",
        cell: ({ row, table, column }) => (
          <div className="flex items-center justify-center h-full w-full">
            <Checkbox
              className="mr-2"
              checked={row.original.brova}
              onCheckedChange={(value) =>
                table.options.meta?.updateData(row.index, column.id, !!value)
              }
            />
          </div>
        ),
      },
    ],
  },
  {
    header: "Fabric Details",
    id: "fabric-details",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
      {
        accessorKey: "fabricSource",
        header: "Source",
        cell: ({ row, table, column }) => (
          <div className="flex flex-col space-y-1 w-[200px]">
            <Select
              onValueChange={(value) =>
                table.options.meta?.updateData(row.index, column.id, value)
              }
              value={row.original.fabricSource}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In">In</SelectItem>
                <SelectItem value="Out">Out</SelectItem>
              </SelectContent>
            </Select>
            {row.original.fabricSource === "In" && (
              <Combobox
                options={[
                  { value: "fabric1", label: "Fabric 1 ($10/m)" },
                  { value: "fabric2", label: "Fabric 2 ($12/m)" },
                ]}
                value={row.original.fabricCode}
                onChange={(value) =>
                  table.options.meta?.updateData(row.index, "fabricCode", value)
                }
                placeholder="Search fabric..."
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "fabricLength",
        header: "Fabric Length",
        cell: ({ row, table, column }) => (
          <Input
            value={row.original.fabricLength}
            onChange={(e) =>
              table.options.meta?.updateData(
                row.index,
                column.id,
                e.target.value
              )
            }
          />
        ),
      },
    ],
  },
  {
    header: "Measurements",
    id: "measurements",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
      {
        accessorKey: "measurementId",
        header: "Measurement ID",
        cell: ({ row, table, column }) => (
          <Select
            onValueChange={(value) =>
              table.options.meta?.updateData(row.index, column.id, value)
            }
            value={row.original.measurementId}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m1">M-001</SelectItem>
              <SelectItem value="m2">M-002</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "customize",
        header: "Customize",
        cell: ({ row, table, column }) => (
          <Switch
            checked={row.original.customize}
            onCheckedChange={(value) =>
              table.options.meta?.updateData(row.index, column.id, !!value)
            }
          />
        ),
      },
    ],
  },
  {
    header: "Style",
    id: "style-group",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
      {
        accessorKey: "styleOptionId",
        header: "Style Option ID",
        cell: ({ row, table, column }) => (
          <div className="relative">
            {row.original.customize ? (
              <Select
                disabled={!row.original.customize}
                onValueChange={(value) =>
                  table.options.meta?.updateData(row.index, column.id, value)
                }
                value={row.original.styleOptionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s1">S-01</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md bg-muted w-full h-10" />
            )}
          </div>
        ),
      },
      {
        accessorKey: "style",
        header: "Style",
        cell: ({ row, table, column }) => (
          <div className="relative">
            {row.original.customize ? (
              <Select
                disabled={!row.original.customize}
                onValueChange={(value) =>
                  table.options.meta?.updateData(row.index, column.id, value)
                }
                value={row.original.style}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kuwaiti">Kuwaiti</SelectItem>
                  <SelectItem value="saudi">Saudi</SelectItem>
                  <SelectItem value="bahraini">Bahraini</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="3d">3D</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md bg-muted w-full h-10" />
            )}
          </div>
        ),
      },
      {
        header: "Lines",
        id: "lines",
        cell: ({ row, table }) => (
          <div className="relative">
            {row.original.customize ? (
              <div className="flex items-center space-x-4 px-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="line1"
                    disabled={!row.original.customize}
                    checked={row.original.line1}
                    onCheckedChange={(value) =>
                      table.options.meta?.updateData(
                        row.index,
                        "line1",
                        !!value
                      )
                    }
                  />
                  <label htmlFor="line1">Line 1</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="line2"
                    disabled={!row.original.customize}
                    checked={row.original.line2}
                    onCheckedChange={(value) =>
                      table.options.meta?.updateData(
                        row.index,
                        "line2",
                        !!value
                      )
                    }
                  />
                  <label htmlFor="line2">Line 2</label>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-muted w-full h-10" />
            )}
          </div>
        ),
      },
      {
        header: "Collar",
        id: "collar",
        cell: ({ row, table }) => (
          <div className="relative">
            {row.original.customize ? (
              <div className="w-[350px] flex flex-row space-x-2">
                <Select
                  disabled={!row.original.customize}
                  onValueChange={(value) =>
                    table.options.meta?.updateData(
                      row.index,
                      "collarType",
                      value
                    )
                  }
                  value={row.original.collarType}
                >
                  <SelectTrigger className="w-32">
                    {row.original.collarType ? (
                      <img
                        src={
                          collarTypes.find(
                            (c) => c.value === row.original.collarType
                          )?.image
                        }
                        alt={
                          collarTypes.find(
                            (c) => c.value === row.original.collarType
                          )?.alt
                        }
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <SelectValue placeholder="Select Type" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="">
                    {collarTypes.map((collarType) => (
                      <SelectItem
                        key={collarType.value}
                        value={collarType.value}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={collarType.image}
                            alt={collarType.alt}
                            className="w-12 h-12 object-contain"
                          />
                          <span>{collarType.displayText}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  disabled={!row.original.customize}
                  onValueChange={(value) =>
                    table.options.meta?.updateData(
                      row.index,
                      "collarButton",
                      value
                    )
                  }
                  value={row.original.collarButton}
                >
                  <SelectTrigger className="w-32">
                    {row.original.collarButton ? (
                      <img
                        src={
                          collarButtons.find(
                            (b) => b.value === row.original.collarButton
                          )?.image
                        }
                        alt={
                          collarButtons.find(
                            (b) => b.value === row.original.collarButton
                          )?.alt
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    disabled={!row.original.customize}
                    id="smallTabaggi"
                    checked={row.original.smallTabaggi}
                    onCheckedChange={(value) =>
                      table.options.meta?.updateData(
                        row.index,
                        "smallTabaggi",
                        !!value
                      )
                    }
                  />
                  <label htmlFor="smallTabaggi">
                    <img
                      src={smallTabaggiImage}
                      alt="Small Tabaggi"
                      className="w-8 h-8 object-contain"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="w-[350px] rounded-md bg-muted h-10" />
            )}
          </div>
        ),
      },
    ],
  },
];
