import { type ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type FabricSelection } from "@/types/fabric";
import {
  collarButtons,
  collarTypes,
  jabzourThicknessOptions,
  jabzourTypes,
  penIcon,
  phoneIcon,
  sleeveTypes,
  smallTabaggiImage,
  topPocketTypes,
  walletIcon,
} from "../constants";

export const styleGroupColumn: ColumnDef<FabricSelection>[] = [
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
                    id={`line1-${row.index}`}
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
                  <label htmlFor={`line1-${row.index}`}>Line 1</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`line2-${row.index}`}
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
                  <label htmlFor={`line2-${row.index}`}>Line 2</label>
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
                    id={`smallTabaggi-${row.index}`}
                    checked={row.original.smallTabaggi}
                    onCheckedChange={(value) =>
                      table.options.meta?.updateData(
                        row.index,
                        "smallTabaggi",
                        !!value
                      )
                    }
                  />
                  <label htmlFor={`smallTabaggi-${row.index}`}>
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
      {
        header: "Jabzour",
        id: "jabzour",
        cell: ({ row, table }) => (
          <div className="relative">
            {row.original.customize ? (
              <div className="w-[450px] flex flex-row space-x-2">
                <Select
                  disabled={!row.original.customize}
                  onValueChange={(value) =>
                    table.options.meta?.updateData(row.index, "jabzour1", value)
                  }
                  value={row.original.jabzour1}
                >
                  <SelectTrigger className="w-32">
                    {row.original.jabzour1 ? (
                      <img
                        src={
                          jabzourTypes.find(
                            (j) => j.value === row.original.jabzour1
                          )?.image
                        }
                        alt={
                          jabzourTypes.find(
                            (j) => j.value === row.original.jabzour1
                          )?.alt
                        }
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <SelectValue placeholder="Select Type" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="">
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
                <Select
                  disabled={!row.original.customize}
                  onValueChange={(value) =>
                    table.options.meta?.updateData(row.index, "jabzour2", value)
                  }
                  value={row.original.jabzour2}
                >
                  <SelectTrigger className="w-32">
                    {row.original.jabzour2 ? (
                      <img
                        src={
                          jabzourTypes.find(
                            (j) => j.value === row.original.jabzour2
                          )?.image
                        }
                        alt={
                          jabzourTypes.find(
                            (j) => j.value === row.original.jabzour2
                          )?.alt
                        }
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
                <Select
                  disabled={!row.original.customize}
                  onValueChange={(value) =>
                    table.options.meta?.updateData(
                      row.index,
                      "jabzour_thickness",
                      value
                    )
                  }
                  value={row.original.jabzour_thickness}
                >
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
              </div>
            ) : (
              <div className="w-[450px] rounded-md bg-muted h-10" />
            )}
          </div>
        ),
      },
      {
        header: "Top Pocket",
        id: "top-pocket",
        cell: ({ row, table }) => (
          <div className="relative">
            {row.original.customize ? (
              <div className="w-[450px] flex flex-row space-x-2 justify-center items-center">
                <Select
                  disabled={!row.original.customize}
                  onValueChange={(value) =>
                    table.options.meta?.updateData(
                      row.index,
                      "top_pocket_type",
                      value
                    )
                  }
                  value={row.original.top_pocket_type}
                >
                  <SelectTrigger className="w-32">
                    {row.original.top_pocket_type ? (
                      <img
                        src={
                          topPocketTypes.find(
                            (j) => j.value === row.original.top_pocket_type
                          )?.image
                        }
                        alt={
                          topPocketTypes.find(
                            (j) => j.value === row.original.top_pocket_type
                          )?.alt
                        }
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <SelectValue placeholder="Select Type" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="">
                    {topPocketTypes.map((topPocketType) => (
                      <SelectItem
                        key={topPocketType.value}
                        value={topPocketType.value}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={topPocketType.image}
                            alt={topPocketType.alt}
                            className="w-12 h-12 object-contain"
                          />
                          <span>{topPocketType.displayText}</span>
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
                      "top_pocket_thickness",
                      value
                    )
                  }
                  value={row.original.top_pocket_thickness}
                >
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    disabled={!row.original.customize}
                    id={`pen_holder-${row.index}`}
                    checked={row.original.pen_holder}
                    onCheckedChange={(value) =>
                      table.options.meta?.updateData(
                        row.index,
                        "pen_holder",
                        !!value
                      )
                    }
                  />
                  <label htmlFor={`pen_holder-${row.index}`}>
                    <img
                      src={penIcon}
                      alt="Pen Holder"
                      className="w-14 h-14 object-contain"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="w-[450px] rounded-md bg-muted h-10" />
            )}
          </div>
        ),
      },
      {
        header: "Side Pocket",
        id: "side-pocket",
        cell: ({ row, table }) => (
          <div className="relative">
            {row.original.customize ? (
              <div className="w-[250px] flex flex-row space-x-4 justify-center items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    disabled={!row.original.customize}
                    id={`side_pocket_phone-${row.index}`}
                    checked={row.original.side_pocket_phone}
                    onCheckedChange={(value) =>
                      table.options.meta?.updateData(
                        row.index,
                        "side_pocket_phone",
                        !!value
                      )
                    }
                  />
                  <label htmlFor={`side_pocket_phone-${row.index}`}>
                    <img
                      src={phoneIcon}
                      alt="Phone Pocket"
                      className="w-14 h-14 object-contain"
                    />
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    disabled={!row.original.customize}
                    id={`side_pocket_wallet-${row.index}`}
                    checked={row.original.side_pocket_wallet}
                    onCheckedChange={(value) =>
                      table.options.meta?.updateData(
                        row.index,
                        "side_pocket_wallet",
                        !!value
                      )
                    }
                  />
                  <label htmlFor={`side_pocket_wallet-${row.index}`}>
                    <img
                      src={walletIcon}
                      alt="Wallet Pocket"
                      className="w-14 h-14 object-contain"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="w-[300px] rounded-md bg-muted h-10" />
            )}
          </div>
        ),
      },
      {
        header: "Sleeves",
        id: "sleeves",
        cell: ({ row, table }) => (
          <div className="relative">
            {row.original.customize ? (
              <div className="w-[300px] flex flex-row space-x-2">
                <Select
                  disabled={!row.original.customize}
                  onValueChange={(value) =>
                    table.options.meta?.updateData(
                      row.index,
                      "sleeves_type",
                      value
                    )
                  }
                  value={row.original.sleeves_type}
                >
                  <SelectTrigger className="w-32">
                    {row.original.sleeves_type ? (
                      <img
                        src={
                          sleeveTypes.find(
                            (j) => j.value === row.original.sleeves_type
                          )?.image
                        }
                        alt={
                          sleeveTypes.find(
                            (j) => j.value === row.original.sleeves_type
                          )?.alt
                        }
                        className="w-7 h-7 object-contain"
                      />
                    ) : (
                      <SelectValue placeholder="Select Type" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="">
                    {sleeveTypes.map((sleeveType) => (
                      <SelectItem
                        key={sleeveType.value}
                        value={sleeveType.value}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={sleeveType.image}
                            alt={sleeveType.alt}
                            className="w-12 h-12 object-contain"
                          />
                          <span>{sleeveType.displayText}</span>
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
                      "sleeves_thickness",
                      value
                    )
                  }
                  value={row.original.sleeves_thickness}
                >
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
              </div>
            ) : (
              <div className="w-[300px] rounded-md bg-muted h-10" />
            )}
          </div>
        ),
      },
    ],
  },
];
