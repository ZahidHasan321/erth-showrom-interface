"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { HorizontalStepper } from "./horizontal-stepper"
import { VerticalStepper } from "./vertical-stepper"

interface StepperProps {
  steps: Array<{ title: string; description?: string }>
  currentStep: number
  completedSteps: number[]
  onStepChange: (step: number) => void
  canNavigateToStep?: (currentStep: number, targetStep: number) => boolean
}

export function Stepper({
  steps,
  currentStep,
  completedSteps,
  onStepChange,
  canNavigateToStep,
}: StepperProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <HorizontalStepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepChange={onStepChange}
        canNavigateToStep={canNavigateToStep}
      />
    )
  }

  return (
    <VerticalStepper
      steps={steps}
      currentStep={currentStep}
      completedSteps={completedSteps}
      onStepChange={onStepChange}
      canNavigateToStep={canNavigateToStep}
    />
  )
}
