import { type ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type FabricSelectionSchema } from "../schema";
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
import { useFormContext, Controller } from "react-hook-form";

export const styleGroupColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    header: "Style",
    id: "style-group",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
      {
        accessorKey: "style.styleOptionId",
        header: "Style Option ID",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          return (
            <div className="relative">
              {customize ? (
                <Controller
                  name={`fabricSelections.${row.index}.style.styleOptionId`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="s1">S-01</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <div className="rounded-md bg-muted w-full h-10" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "style.style",
        header: "Style",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          return (
            <div className="relative">
              {customize ? (
                <Controller
                  name={`fabricSelections.${row.index}.style.style`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  )}
                />
              ) : (
                <div className="rounded-md bg-muted w-full h-10" />
              )}
            </div>
          );
        },
      },
      {
        header: "Lines",
        id: "lines",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          return (
            <div className="relative">
              {customize ? (
                <div className="flex items-center space-x-4 px-2">
                  <Controller
                    name={`fabricSelections.${row.index}.style.lines.line1`}
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
                    name={`fabricSelections.${row.index}.style.lines.line2`}
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
              ) : (
                <div className="rounded-md bg-muted w-full h-10" />
              )}
            </div>
          );
        },
      },
      {
        header: "Collar",
        id: "collar",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          const collarType = watch(
            `fabricSelections.${row.index}.style.collar.collarType`
          );
          const collarButton = watch(
            `fabricSelections.${row.index}.style.collar.collarButton`
          );
          return (
            <div className="relative">
              {customize ? (
                <div className="w-[350px] flex flex-row space-x-2">
                  <Controller
                    name={`fabricSelections.${row.index}.style.collar.collarType`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32">
                          {collarType ? (
                            <img
                              src={
                                collarTypes.find((c) => c.value === collarType)
                                  ?.image
                              }
                              alt={
                                collarTypes.find((c) => c.value === collarType)
                                  ?.alt
                              }
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
                    name={`fabricSelections.${row.index}.style.collar.collarButton`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32">
                          {collarButton ? (
                            <img
                              src={
                                collarButtons.find(
                                  (b) => b.value === collarButton
                                )?.image
                              }
                              alt={
                                collarButtons.find(
                                  (b) => b.value === collarButton
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
                    )}
                  />
                  <Controller
                    name={`fabricSelections.${row.index}.style.collar.smallTabaggi`}
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
              ) : (
                <div className="w-[350px] rounded-md bg-muted h-10" />
              )}
            </div>
          );
        },
      },
      {
        header: "Jabzour",
        id: "jabzour",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          const jabzour1 = watch(
            `fabricSelections.${row.index}.style.jabzour.jabzour1`
          );
          const jabzour2 = watch(
            `fabricSelections.${row.index}.style.jabzour.jabzour2`
          );
          return (
            <div className="relative">
              {customize ? (
                <div className="w-[450px] flex flex-row space-x-2">
                  <Controller
                    name={`fabricSelections.${row.index}.style.jabzour.jabzour1`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32">
                          {jabzour1 ? (
                            <img
                              src={
                                jabzourTypes.find((j) => j.value === jabzour1)
                                  ?.image
                              }
                              alt={
                                jabzourTypes.find((j) => j.value === jabzour1)
                                  ?.alt
                              }
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
                  <Controller
                    name={`fabricSelections.${row.index}.style.jabzour.jabzour2`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32">
                          {jabzour2 ? (
                            <img
                              src={
                                jabzourTypes.find((j) => j.value === jabzour2)
                                  ?.image
                              }
                              alt={
                                jabzourTypes.find((j) => j.value === jabzour2)
                                  ?.alt
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
                    )}
                  />
                  <Controller
                    name={`fabricSelections.${row.index}.style.jabzour.jabzour_thickness`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                    )}
                  />
                </div>
              ) : (
                <div className="w-[450px] rounded-md bg-muted h-10" />
              )}
            </div>
          );
        },
      },
      {
        header: "Top Pocket",
        id: "top-pocket",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          const topPocketType = watch(
            `fabricSelections.${row.index}.style.topPocket.top_pocket_type`
          );
          return (
            <div className="relative">
              {customize ? (
                <div className="w-[450px] flex flex-row space-x-2 justify-center items-center">
                  <Controller
                    name={`fabricSelections.${row.index}.style.topPocket.top_pocket_type`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32">
                          {topPocketType ? (
                            <img
                              src={
                                topPocketTypes.find(
                                  (j) => j.value === topPocketType
                                )?.image
                              }
                              alt={
                                topPocketTypes.find(
                                  (j) => j.value === topPocketType
                                )?.alt
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
                    name={`fabricSelections.${row.index}.style.topPocket.top_pocket_thickness`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                    )}
                  />
                  <Controller
                    name={`fabricSelections.${row.index}.style.topPocket.pen_holder`}
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
              ) : (
                <div className="w-[450px] rounded-md bg-muted h-10" />
              )}
            </div>
          );
        },
      },
      {
        header: "Side Pocket",
        id: "side-pocket",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          return (
            <div className="relative">
              {customize ? (
                <div className="w-[250px] flex flex-row space-x-4 justify-center items-center">
                  <Controller
                    name={`fabricSelections.${row.index}.style.sidePocket.side_pocket_phone`}
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
                    name={`fabricSelections.${row.index}.style.sidePocket.side_pocket_wallet`}
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
              ) : (
                <div className="w-[300px] rounded-md bg-muted h-10" />
              )}
            </div>
          );
        },
      },
      {
        header: "Sleeves",
        id: "sleeves",
        cell: ({ row }) => {
          const { control, watch } = useFormContext();
          const customize = watch(`fabricSelections.${row.index}.customize`);
          const sleevesType = watch(
            `fabricSelections.${row.index}.style.sleeves.sleeves_type`
          );
          return (
            <div className="relative">
              {customize ? (
                <div className="w-[300px] flex flex-row space-x-2">
                  <Controller
                    name={`fabricSelections.${row.index}.style.sleeves.sleeves_type`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-32">
                          {sleevesType ? (
                            <img
                              src={
                                sleeveTypes.find((j) => j.value === sleevesType)
                                  ?.image
                              }
                              alt={
                                sleeveTypes.find((j) => j.value === sleevesType)
                                  ?.alt
                              }
                              className="w-7 h-7 object-contain"
                            />
                          ) : (
                            <SelectValue placeholder="Select Type" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {sleeveTypes.map((st) => (
                            <SelectItem key={st.value} value={st.value}>
                              <div className="flex items-center space-x-2">
                                <img
                                  src={st.image}
                                  alt={st.alt}
                                  className="w-12 h-12 object-contain"
                                />
                                <span>{st.displayText}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name={`fabricSelections.${row.index}.style.sleeves.sleeves_thickness`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                    )}
                  />
                </div>
              ) : (
                <div className="w-[300px] rounded-md bg-muted h-10" />
              )}
            </div>
          );
        },
      },
    ],
  },
];
