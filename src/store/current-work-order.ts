import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { customerDemographicsSchema } from '@/components/forms/customer-demographics/schema';
import { customerMeasurementsSchema } from '@/components/forms/customer-measurements/schema';
import { z } from 'zod';

type CustomerDemographics = z.infer<typeof customerDemographicsSchema>;
type CustomerMeasurements = z.infer<typeof customerMeasurementsSchema>;

interface CurrentWorkOrderState {
  customerDemographics: Partial<CustomerDemographics>;
  customerMeasurements: Partial<CustomerMeasurements>;
  currentStep: number;
  savedSteps: number[];
  setCustomerDemographics: (data: Partial<CustomerDemographics>) => void;
  setCustomerMeasurements: (data: Partial<CustomerMeasurements>) => void;
  setCurrentStep: (step: number) => void;
  markStepSaved: (step: number) => void;
}

export const useCurrentWorkOrderStore = create<CurrentWorkOrderState>()(
  devtools(
    (set) => ({
      customerDemographics: {},
      customerMeasurements: {},
      currentStep: 0,
      savedSteps: [],
      setCustomerDemographics: (data) =>
        set((state) => ({ customerDemographics: { ...state.customerDemographics, ...data } })),
      setCustomerMeasurements: (data) =>
        set((state) => ({ customerMeasurements: { ...state.customerMeasurements, ...data } })),
      setCurrentStep: (step) => set({ currentStep: step }),
      markStepSaved: (step) =>
        set((state) =>
          state.savedSteps.includes(step)
            ? {}
            : { savedSteps: [...state.savedSteps, step].sort((a, b) => a - b) },
        ),
    }),
    { name: 'current-work-order' }
  )
);
