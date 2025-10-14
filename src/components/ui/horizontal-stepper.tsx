"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";
import * as React from "react";
import { motion } from "framer-motion";

interface StepProps {
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  index: number;
}

const Step: React.FC<StepProps> = ({ title, isCompleted, isActive, onClick, index }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        isActive ? "border shadow" : null,
        "flex flex-col items-center cursor-pointer p-2 rounded-md transition-colors group",
        "hover:bg-muted",
        "focus:outline-none"
      )}
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          layout
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isActive
              ? "border-primary text-primary font-extrabold"
              : "border-muted-foreground/50"
          )}
          animate={{ scale: isActive ? 1.12 : 1 }}
          transition={{ duration: 0.28, type: "spring", stiffness: 260, damping: 22 }}
        >
          {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
        </motion.div>
      </div>

      <div className="mt-2 text-center hidden md:block">
        <p
          className={cn(
            "text-sm font-medium transition-colors",
            isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </p>
      </div>
    </button>
  );
};

interface StepperProps {
  steps: Array<{ title: string; description?: string; id: string }>;
  completedSteps: number[];
  currentStep: number;
  onStepChange: (index: number) => void;
}

/**
 * Visual stepper — receives currentStep from parent/store and notifies onStepChange on click.
 */
export const HorizontalStepper: React.FC<StepperProps> = ({ steps, completedSteps, currentStep, onStepChange }) => {
  return (
    <div className="w-full bg-background border-b border-muted sticky top-0 z-40">
      <div className="flex flex-row items-center justify-center px-4 py-3 overflow-x-auto 2xl:gap-10">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <Step
              index={index}
              title={step.title}
              description={step.description}
              isCompleted={completedSteps.includes(index)}
              isActive={index === currentStep}
              onClick={() => onStepChange(index)}
            />
            {index < steps.length - 1 && (
              <ChevronRight className="h-6 w-6 hidden lg:block text-muted-foreground/30" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HorizontalStepper;