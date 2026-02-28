import { Check, Music, Video, Wand2, Upload, BarChart3, Sparkles } from "lucide-react";

const steps = [
  { id: 0, label: "Create", icon: Sparkles },
  { id: 1, label: "Audio", icon: Music },
  { id: 2, label: "Clips", icon: Video },
  { id: 3, label: "Render", icon: Wand2 },
  { id: 4, label: "Upload", icon: Upload },
  { id: 5, label: "Track", icon: BarChart3 },
];

interface WizardStepsProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const WizardSteps = ({ currentStep, onStepClick, completedSteps }: WizardStepsProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);

        return (
          <div key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => onStepClick(step.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "studio-step-active"
                  : isCompleted
                  ? "studio-step-completed"
                  : "studio-step-inactive hover:bg-secondary"
              }`}
            >
              {isCompleted && !isActive ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="whitespace-nowrap">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={`h-px w-6 shrink-0 ${isCompleted ? "bg-primary/50" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WizardSteps;
