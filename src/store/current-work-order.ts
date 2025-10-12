import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { customerDemographicsSchema } from "@/components/forms/customer-demographics/schema";
import { customerMeasurementsSchema } from "@/components/forms/customer-measurements/schema";
import { shelvedProductsSchema } from "@/components/forms/shelved-products/schema";
import { z } from "zod";
import type { fabricSelectionSchema } from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import type { styleOptionsSchema } from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import type { Order } from "@/types/order";
import type { OrderSchema } from "@/schemas/schema";

type CustomerDemographics = z.infer<typeof customerDemographicsSchema>;
type CustomerMeasurements = z.infer<typeof customerMeasurementsSchema>;
type FabricSelection = z.infer<typeof fabricSelectionSchema>;
type StyleOption = z.infer<typeof styleOptionsSchema>;

interface CurrentWorkOrderState {
  orderId: string | null;
  order: Partial<Order["fields"]>;
  customerDemographics: Partial<CustomerDemographics>;
  customerMeasurements: Partial<CustomerMeasurements>;
  fabricSelections: FabricSelection[];
  styleOptions: StyleOption[];
  measurementId: string | null;
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
  setCustomerDemographics: (data: Partial<z.infer<typeof customerDemographicsSchema>>) => void;
  setCustomerMeasurements: (data: Partial<z.infer<typeof customerMeasurementsSchema>>) => void;
  removeFabricSelection: (id: string) => void;
  setMeasurementId: (id: string | null) => void;
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

        setOrderId: (id) => set({ orderId: id }),
        setOrder: (order) => set((state) => ({ order: { ...state.order, ...order } })),

        setCustomerDemographics: (data) =>
          set((state) => ({
            customerDemographics: { ...state.customerDemographics, ...data },
          })),

        setCustomerMeasurements: (data) =>
          set((state) => ({
            customerMeasurements: { ...state.customerMeasurements, ...data },
          })),

        setFabricSelections: (data) => set({ fabricSelections: data }),
        setStyleOptions: (data) => set({ styleOptions: data }),

        addFabricSelection: (data) =>
          set((state) => ({
            fabricSelections: [...state.fabricSelections, data],
          })),

        updateFabricSelection: (data) =>
          set((state) => ({
            fabricSelections: state.fabricSelections.map((item) =>
              item.id === data.id ? data : item
            ),
          })),

        removeFabricSelection: (id) =>
          set((state) => ({
            fabricSelections: state.fabricSelections.filter(
              (item) => item.id !== id
            ),
          })),

        setMeasurementId: (id) => set({ measurementId: id }),
        
        setShelvedProducts: (data) => set({ shelvedProducts: data }),

        setCustomerId: (id) => set({ customerId: id }),

        setCustomerRecordId: (id) => set({ customerRecordId: id }),  

        setCurrentStep: (step) => set({ currentStep: step }),

        addSavedStep: (step) =>
          set((state) =>
            state.savedSteps.includes(step)
              ? state
              : {
                  savedSteps: [...state.savedSteps, step].sort((a, b) => a - b),
                }
          ),

        removeSavedStep: (step) =>
          set((state) => ({
            savedSteps: state.savedSteps.filter((s) => s !== step),
          })),

        resetWorkOrder: () =>
          set({
            orderId: null,
            order: {},
            customerDemographics: {},
            customerMeasurements: {},
            fabricSelections: [],
            styleOptions: [],
            shelvedProducts: [],
            customerId: null,
            measurementId: null,
            currentStep: 0,
            savedSteps: [],
          }),
      }),
      { name: `work-order-${name}` }
    )
  );
