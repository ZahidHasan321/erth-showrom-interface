"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProps {
  title: string
  description?: string
  isCompleted?: boolean
  isActive?: boolean
  onClick?: () => void
}

const Step: React.FC<StepProps> = ({ title, description, isCompleted, isActive, onClick }) => {
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
              ? "border-primary bg-primary/20 text-primary"
              : "border-muted-foreground/50"
          )}
        >
          {isCompleted ? <Check className="w-4 h-4" /> : null}
        </div>
      </div>

      {/* Title */}
      <div className="mt-2 text-center">
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

export function HorizontalStepper({
  steps,
  currentStep,
  completedSteps,
  onStepChange,
  canNavigateToStep,
}: StepperProps) {
  const attemptStepChange = (targetStep: number) => {
    if (targetStep < 0 || targetStep >= steps.length || targetStep === currentStep) return
    if (canNavigateToStep && !canNavigateToStep(currentStep, targetStep)) return
    onStepChange(targetStep)
  }

  return (
    <div className="w-full bg-background border-b border-muted sticky top-0 z-10">
      <div className="flex justify-between items-center p-4 overflow-x-auto">
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
              <div
                className={cn(
                  "flex-1 h-px mx-2",
                  completedSteps.includes(index) ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
