import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto mb-10">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-initial">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2 min-w-[70px]">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : isActive
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-600/20'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <span
                className={`text-xs font-medium tracking-wide text-center transition-colors duration-300 ${
                  isActive ? 'text-white' : isCompleted ? 'text-blue-400' : 'text-zinc-500'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mt-[-1.5rem] rounded-full overflow-hidden bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'w-full bg-blue-600' : 'w-0 bg-blue-600'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
