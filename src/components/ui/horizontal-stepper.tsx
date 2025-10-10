"use client"

import { cn } from "@/lib/utils"
import { Check, ChevronRight } from "lucide-react"
import * as React from "react"

interface StepProps {
  title: string
  description?: string
  isCompleted?: boolean
  isActive?: boolean
  onClick?: () => void
}

const Step: React.FC<StepProps> = ({ title, isCompleted, isActive, onClick }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer p-2 rounded-md transition-colors group hover:bg-muted"
      onClick={onClick}
    >
      {/* Circle */}
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isActive
              ? "border-primary text-primary"
              : "border-muted-foreground/50"
          )}
        >
          {isCompleted ? <Check className="w-4 h-4" /> : null}
        </div>
      </div>

      {/* Title */}
      <div className="mt-2 text-center hidden md:block">
        <p
          className={cn(
            "text-sm font-medium",
            isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </p>
      </div>
    </div>
  )
}

interface StepperProps {
  steps: Array<{ title: string; description?: string }>
  currentStep: number
  completedSteps: number[]
  onStepChange: (step: number) => void
  canNavigateToStep?: (currentStep: number, targetStep: number) => boolean
}

export const HorizontalStepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepChange,
  canNavigateToStep,
}) => {
  const attemptStepChange = (targetStep: number) => {
    if (targetStep < 0 || targetStep >= steps.length || targetStep === currentStep) return
    if (canNavigateToStep && !canNavigateToStep(currentStep, targetStep)) return
    onStepChange(targetStep)
  }

  return (
    <div className="w-full bg-background border-b border-muted sticky top-0 z-10">
      <div className="flex flex-row items-center justify-center px-4 py-2 overflow-x-auto 2xl:gap-10">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <Step
              title={step.title}
              description={step.description}
              isCompleted={completedSteps.includes(index)}
              isActive={index === currentStep}
              onClick={() => attemptStepChange(index)}
            />
            {index < steps.length - 1 && (
              <ChevronRight className="h-6 w-6 hidden lg:block text-muted-foreground/30" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}