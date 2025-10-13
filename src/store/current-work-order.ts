import type { fabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import type { styleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import { shelvedProductsSchema } from "@/components/forms/shelved-products/schema";
import type { OrderSchema } from "@/schemas/schema";
import type { Order } from "@/types/order";
import { z } from "zod";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// type CustomerDemographics = z.infer<typeof customerDemographicsSchema>;
// type CustomerMeasurements = z.infer<typeof customerMeasurementsSchema>;
type FabricSelection = z.infer<typeof fabricSelectionSchema>;
type StyleOption = z.infer<typeof styleOptionsSchema>;

interface CurrentWorkOrderState {
  orderId: string | null;
  order: Partial<Order["fields"]>;
  // customerDemographics: Partial<CustomerDemographics>;
  // customerMeasurements: Partial<CustomerMeasurements>;
  fabricSelections: FabricSelection[];
  styleOptions: StyleOption[];
  shelvedProducts: z.infer<typeof shelvedProductsSchema>;
  customerId: string | null;
  customerRecordId: string | null;
  currentStep: number;
  savedSteps: number[];

  // setters
  setOrderId: (id: string | null) => void;
  setFabricSelections: (data: FabricSelection[]) => void;
  setStyleOptions: (data: StyleOption[]) => void;
  addFabricSelection: (data: FabricSelection) => void;
  updateFabricSelection: (data: FabricSelection) => void;
  setOrder: (order: Partial<OrderSchema>) => void;
  removeFabricSelection: (id: string) => void;
  setShelvedProducts: (data: z.infer<typeof shelvedProductsSchema>) => void;
  setCustomerId: (id: string | null) => void;
  setCustomerRecordId: (id: string | null) => void;
  setCurrentStep: (step: number) => void;

  // mark step complete
  addSavedStep: (step: number) => void;
  removeSavedStep: (step: number) => void;

  // reset work order
  resetWorkOrder: () => void;
}

export const createWorkOrderStore = (name: string) =>
  create<CurrentWorkOrderState>()(
    devtools(
      (set) => ({
        orderId: null,
        order: {},
        customerDemographics: {},
        customerMeasurements: {},
        fabricSelections: [],
        styleOptions: [],
        shelvedProducts: [],
        measurementId: null,
        currentStep: 0,
        savedSteps: [],
        measurements: null,

        setOrderId: (id) => set({ orderId: id }),
        setOrder: (order) =>
          set((state) => ({ order: { ...state.order, ...order } })),

        // setCustomerDemographics: (data) =>
        //   set((state) => ({
        //     customerDemographics: { ...state.customerDemographics, ...data },
        //   })),

        // setCustomerMeasurements: (data) =>
        //   set((state) => ({
        //     customerMeasurements: { ...state.customerMeasurements, ...data },
        //   })),

        setFabricSelections: (data) => set({ fabricSelections: data }),
        setStyleOptions: (data) => set({ styleOptions: data }),

        addFabricSelection: (data) =>
          set((state) => ({
            fabricSelections: [...state.fabricSelections, data],
          })),

        updateFabricSelection: (data) =>
          set((state) => ({
            fabricSelections: state.fabricSelections.map((item) =>
              item.id === data.id ? data : item,
            ),
          })),

        removeFabricSelection: (id) =>
          set((state) => ({
            fabricSelections: state.fabricSelections.filter(
              (item) => item.id !== id,
            ),
          })),


        setShelvedProducts: (data) => set({ shelvedProducts: data }),

        setCustomerId: (id) => set({ customerId: id }),

        setCustomerRecordId: (id) => set({ customerRecordId: id }),

        setCurrentStep: (step) => set({ currentStep: step }),

        // setMeasurements: (measurements) => set({ measurements }),

        // addMeasurement: (measurement) =>
        //   set((state) => ({
        //     measurements: {
        //       ...state.measurements,
        //       [measurement.measurementID]: measurement,
        //     },
        //   })),

        // removeMeasurement: (id) =>
        //   set((state) => {
        //     const newMeasurements = { ...state.measurements };
        //     delete newMeasurements[id];
        //     return { measurements: newMeasurements };
        //   }),

        addSavedStep: (step) =>
          set((state) =>
            state.savedSteps.includes(step)
              ? state
              : {
                  savedSteps: [...state.savedSteps, step].sort((a, b) => a - b),
                },
          ),

        removeSavedStep: (step) =>
          set((state) => ({
            savedSteps: state.savedSteps.filter((s) => s !== step),
          })),

        resetWorkOrder: () =>
          set({
            orderId: null,
            order: {},
            // customerDemographics: {},
            // customerMeasurements: {},
            fabricSelections: [],
            styleOptions: [],
            shelvedProducts: [],
            customerId: null,
            currentStep: 0,
            savedSteps: [],
            // measurements: null,
          }),
      }),
      { name: `work-order-${name}` },
    ),
  );
