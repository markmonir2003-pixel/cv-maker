'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { StepIndicator } from './StepIndicator';
import { PersonalInfoForm } from './form/PersonalInfoForm';
import { ExperienceForm } from './form/ExperienceForm';
import { EducationForm } from './form/EducationForm';
import { SkillsForm } from './form/SkillsForm';
import { Download, ArrowRight, ArrowLeft } from 'lucide-react';

interface FormSectionProps {
  onDownload: () => void;
}

const TOTAL_STEPS = 4;

const formSteps = [
  { component: PersonalInfoForm, title: 'Personal Information' },
  { component: EducationForm, title: 'Education' },
  { component: ExperienceForm, title: 'Work Experience' },
  { component: SkillsForm, title: 'Skills' },
];

export function FormSection({ onDownload }: FormSectionProps) {
  const { currentStep, setCurrentStep } = useResume();

  const handleNext = useCallback(() => {
    setCurrentStep(Math.min(currentStep + 1, TOTAL_STEPS));
  }, [currentStep, setCurrentStep]);

  const handlePrevious = useCallback(() => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  }, [currentStep, setCurrentStep]);

  const CurrentForm = formSteps[currentStep - 1].component;
  const currentTitle = formSteps[currentStep - 1].title;
  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div className="bg-background h-full flex flex-col">
      {/* Header */}
      <div className="px-6 md:px-8 py-5 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <h2 className="text-xl md:text-2xl font-bold text-foreground mt-3">{currentTitle}</h2>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <CurrentForm />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="px-6 md:px-8 py-4 border-t flex justify-between items-center gap-3 bg-background">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2 items-center">
          {/* Always show download from step 2 onwards */}
          {currentStep >= 2 && (
            <Button
              onClick={onDownload}
              variant="outline"
              size="sm"
              className="gap-1.5 hidden sm:flex"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          )}

          {!isLastStep ? (
            <Button onClick={handleNext} size="sm" className="gap-1.5">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={onDownload} size="sm" className="gap-1.5">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
