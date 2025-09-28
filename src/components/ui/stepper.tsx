"use client"

import * as React from "react"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface StepProps {
  title: string
  description?: string
  isCompleted?: boolean
  isActive?: boolean
}

const Step: React.FC<StepProps> = ({ title, description, isCompleted, isActive }) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isActive
                ? "border-primary"
                : "border-muted",
          )}
        >
          {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium"></span>}
        </div>
      </div>
      <div className="ml-4">
        <p className={cn("text-sm font-medium", isActive || isCompleted ? "text-foreground" : "text-muted-foreground")}>
          {title}
        </p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

interface StepperProps {
  steps: Array<{ title: string; description?: string }>
  currentStep: number;
  completedSteps: number[];
  onStepChange: (step: number) => void;
  canNavigateToStep?: (currentStep: number, targetStep: number) => boolean;
}

export function Stepper({ steps, currentStep, completedSteps, onStepChange, canNavigateToStep }: StepperProps) {
  const attemptStepChange = (targetStep: number) => {
    if (targetStep < 0 || targetStep >= steps.length || targetStep === currentStep) {
      return;
    }

    if (canNavigateToStep && !canNavigateToStep(currentStep, targetStep)) {
      return;
    }

    onStepChange(targetStep);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div onClick={() => attemptStepChange(index)} className="cursor-pointer">
              <Step
                title={step.title}
                description={step.description}
                isCompleted={completedSteps.includes(index)}
                isActive={index === currentStep}
              />
            </div>
            {index < steps.length - 1 && <ChevronRight className="hidden md:block text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => attemptStepChange(currentStep - 1)} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={() => attemptStepChange(currentStep + 1)} disabled={currentStep === steps.length - 1}>
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}