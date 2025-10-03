import {type UseFormReturn} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { customerMeasurementsDefaults, customerMeasurementsSchema } from "./schema";
import MyImg from "../../../assets/image.png";
import * as React from "react";

const unit = "cm";

interface CustomerMeasurementsFormProps {
  form: UseFormReturn<z.infer<typeof customerMeasurementsSchema>>;
  onSubmit: (values: z.infer<typeof customerMeasurementsSchema>) => void;  // <-- Accept `onSubmit` as prop
  customerId: string | null;
}

export function CustomerMeasurementsForm({ form,  onSubmit, customerId}: CustomerMeasurementsFormProps) {
  const [isDisabled, setIsDisabled] = React.useState(true);

  React.useEffect(() => {
    setIsDisabled(!customerId);
    if (!customerId) {
      form.reset(customerMeasurementsDefaults);
    }
  }, [customerId, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-bold mb-4">
          Customer Measurement
        </h1>


        <div className="relative min-w-4xl h-[1200px] pb-100 flex justify-center items-center">
        <div className="absolute mt-200 measurement-image-container flex justify-center items-center mb-6">
          <img src={MyImg} className="w-100 h-auto object-contain" alt="Dishdasha Measurement Guide"/>
        </div>
          {/* Top Left: Measurement Type and ID */}
          <div className="absolute top-[5%] left-[5%] flex gap-6 bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="measurementType"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Measurement Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isDisabled}>
                    <FormControl>
                      <SelectTrigger className="bg-white w-40">
                        <SelectValue placeholder="Measurement Type"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Body">Body</SelectItem>
                      <SelectItem value="Dishdasha">Dishdasha</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measurementID"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Measurement ID</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isDisabled}>
                    <FormControl>
                      <SelectTrigger className="bg-white w-40">
                        <SelectValue placeholder="Measurement ID"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="894-02">894-02</SelectItem>
                      <SelectItem value="894-01">894-01</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          {/* Top Right: Measurement Reference */}
          <div className="absolute top-[5%] right-[5%] bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="measurementReference"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Measurement Reference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isDisabled}>
                    <FormControl>
                      <SelectTrigger className="bg-white w-40">
                        <SelectValue placeholder="Measurement Reference"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Winter">Winter</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Eid">Eid</SelectItem>
                      <SelectItem value="Occasion">Occasion</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          {/* Left Side Fields */}
          {/* Collar */}
          <div className="absolute top-[15%] left-[35%] flex flex-col items-center gap-2 bg-muted p-2 rounded-lg">
            <h3 className="font-semibold text-center">Collar</h3>
            <div className={"flex flex-row gap-2"}>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Width</FormLabel>
              <FormField
                control={form.control}
                name="collar.width"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Height</FormLabel>
              <FormField
                control={form.control}
                name="collar.height"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            </div>
          </div>

          {/* Armhole */}
          <div className="absolute top-[30%] left-[20%] flex flex-col items-start gap-2 bg-muted p-2 rounded-lg">
            <FormLabel>Armhole</FormLabel>
            <FormField
              control={form.control}
              name="armhole"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                    </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          {/* Chest */}
          <div className="absolute top-[35%] left-[15%] flex flex-col items-center gap-2 bg-muted p-2 rounded-lg">
            <h3 className="font-semibold text-center">Chest</h3>
                <div className="flex flex-col items-start gap-2">
              <FormLabel>Upper</FormLabel>
              <FormField
                control={form.control}
                name="chest.upper"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Half</FormLabel>
              <FormField
                control={form.control}
                name="chest.half"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Full</FormLabel>
              <FormField
                control={form.control}
                name="chest.full"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Sleeve */}
          <div className="absolute top-[60%] left-[10%] flex flex-col items-start gap-2 bg-muted p-2 rounded-lg">
              <FormLabel>Sleeve</FormLabel>
              <FormField
                control={form.control}
                name="sleeve"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <div className="absolute top-[52%] left-[10%] flex flex-col items-start gap-2 bg-muted p-2 rounded-lg">
              <FormLabel>Elbow</FormLabel>
              <FormField
                control={form.control}
                name="elbow"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

          {/* Length */}
          <div className="absolute top-[25%] left-[55%] flex flex-col items-center gap-2 bg-muted p-2 rounded-lg">
            <h3 className="font-semibold text-center">Length</h3>
            <div className={"flex flex-row gap-2"}>
            <div className="flex flex-col items-start gap-2">
              <FormLabel>Front</FormLabel>
              <FormField
                control={form.control}
                name="length.front"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <FormLabel>Back</FormLabel>
              <FormField
                control={form.control}
                name="length.back"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            </div>
          </div>

          {/* Shoulder */}
          <div className="absolute top-[37%] right-[17%] flex flex-col items-start gap-2 bg-muted p-2 rounded-lg">
            <FormLabel>Shoulder</FormLabel>
            <FormField
              control={form.control}
              name="shoulder"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                    </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          {/* Top Pocket */}
          <div className="absolute top-[45%] right-[15%] flex flex-col items-center gap-2 bg-muted p-2 rounded-lg">
            <h3 className="font-semibold text-center">Top Pocket</h3>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Length</FormLabel>
              <FormField
                control={form.control}
                name="topPocket.length"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Width</FormLabel>
              <FormField
                control={form.control}
                name="topPocket.width"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Distance</FormLabel>
              <FormField
                control={form.control}
                name="topPocket.distance"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Side Pocket */}
          <div className="absolute top-[62%] right-[13%] flex flex-col items-center gap-2 bg-muted p-2 rounded-lg">
            <h3 className="font-semibold text-center">Side Pocket</h3>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Length</FormLabel>
              <FormField
                control={form.control}
                name="sidePocket.length"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Width</FormLabel>
              <FormField
                control={form.control}
                name="sidePocket.width"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Distance</FormLabel>
              <FormField
                control={form.control}
                name="sidePocket.distance"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Opening</FormLabel>
              <FormField
                control={form.control}
                name="sidePocket.opening"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Waist */}
          <div className="absolute top-[82%] right-[5%] space-y-2 bg-muted p-2 rounded-lg flex flex-col items-center">
            <h3 className="font-semibold text-center">Waist</h3>
            <div className={"flex flex-row gap-2"}>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Front</FormLabel>
              <FormField
                control={form.control}
                name="waist.front"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <div className="flex flex-col items-start gap-2">
              <FormLabel>Back</FormLabel>
              <FormField
                control={form.control}
                name="waist.back"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col items-start absolute top-[95%] right-[12%] gap-2 bg-muted p-2 rounded-lg">
            <h3 className="font-semibold">Bottom</h3>
            <FormField
              control={form.control}
              name="bottom"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder="0.0" className="bg-white w-20 pr-8" disabled={isDisabled}/>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">{unit}</span>
                    </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          {/* Fabric Reference No. and Notes */}
          <div className="absolute bottom-[5%] left-[5%] flex flex-col gap-4 bg-muted p-4 rounded-lg w-80">
            <FormField
              control={form.control}
              name="fabricReferenceNo"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Fabric Reference No.</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" disabled={isDisabled}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Notes and special requests</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Customer special request and notes"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition duration-200"
                      {...field}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
        </div>

          {/* Buttons Section */}
          <div className="flex gap-6 justify-center">
            <Button type="submit" variant="outline" disabled={isDisabled}>
              Save Current Measurement
            </Button>
            <Button type="button" variant="outline" disabled={isDisabled}>
              Edit Existing
            </Button>
            <Button type="submit" disabled={isDisabled}>New Measurement</Button>
          </div>
      </form>
    </Form>
);
}