import React from 'react';
import { Check } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = ['Personal', 'Education', 'Experience', 'Skills'];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const { setCurrentStep } = useResume();

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div 
              className="flex flex-col items-center gap-1 cursor-pointer group"
              onClick={() => setCurrentStep(stepNumber)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCompleted
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 group-hover:scale-110'
                    : isActive
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md shadow-primary/30 group-hover:scale-110'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                  }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : stepNumber}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block transition-colors ${isActive ? 'text-primary' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'
                  }`}
              >
                {steps[index]}
              </span>
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 transition-all duration-500 ${isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
