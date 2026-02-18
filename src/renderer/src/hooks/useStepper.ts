import { useState } from 'react';

export function useStepper(totalPages: number) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalPages));
  const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleCloseStep = () => setCurrentStep(1);

  return { currentStep, handleNextStep, handlePrevStep, handleClose: handleCloseStep };
}