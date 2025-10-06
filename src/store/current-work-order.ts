import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { customerDemographicsSchema } from "@/components/forms/customer-demographics/schema";
import { customerMeasurementsSchema } from "@/components/forms/customer-measurements/schema";
import { z } from "zod";
import { type FabricSelection } from "@/types/fabric";

type CustomerDemographics = z.infer<typeof customerDemographicsSchema>;
type CustomerMeasurements = z.infer<typeof customerMeasurementsSchema>;

interface CurrentWorkOrderState {
  customerDemographics: Partial<CustomerDemographics>;
  customerMeasurements: Partial<CustomerMeasurements>;
  fabricSelections: FabricSelection[];
  measurementId: string | null;
  currentStep: number;
  savedSteps: number[];

  // setters
  setCustomerDemographics: (data: Partial<CustomerDemographics>) => void;
  setCustomerMeasurements: (data: Partial<CustomerMeasurements>) => void;
  setFabricSelections: (data: FabricSelection[]) => void;
  addFabricSelection: (data: FabricSelection) => void;
  updateFabricSelection: (data: FabricSelection) => void;
  removeFabricSelection: (id: string) => void;
  setMeasurementId: (id: string | null) => void;
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
        customerDemographics: {},
        customerMeasurements: {},
        fabricSelections: [],
        measurementId: null,
        currentStep: 0,
        savedSteps: [],

        setCustomerDemographics: (data) =>
          set((state) => ({
            customerDemographics: { ...state.customerDemographics, ...data },
          })),

        setCustomerMeasurements: (data) =>
          set((state) => ({
            customerMeasurements: { ...state.customerMeasurements, ...data },
          })),

        setFabricSelections: (data) => set({ fabricSelections: data }),

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
            customerDemographics: {},
            customerMeasurements: {},
            fabricSelections: [],
            measurementId: null,
            currentStep: 0,
            savedSteps: [],
          }),
      }),
      { name: `work-order-${name}` }
    )
  );
