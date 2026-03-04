import { useState } from "react";
import WizardSteps from "@/components/WizardSteps";
import CreateStep, { type ProjectData } from "@/components/steps/CreateStep";
import AudioStep from "@/components/steps/AudioStep";
import ClipsStep from "@/components/steps/ClipsStep";
import RenderStep from "@/components/steps/RenderStep";
import UploadStep from "@/components/steps/UploadStep";
import TrackStep from "@/components/steps/TrackStep";
import { Music, Cloud, CloudOff } from "lucide-react";
import { isApiConfigured } from "@/lib/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STEP_TITLES = ["Create Project", "Suno Audio", "Pexels Clips", "Render Video", "YouTube Upload", "Analytics"];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [clipCount, setClipCount] = useState(0);

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setCurrentStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold studio-gradient-text leading-tight">IxsuiMuzik</h1>
              <p className="text-xs text-muted-foreground">Studio Automator</p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                isApiConfigured()
                  ? "bg-studio-success/10 text-studio-success border border-studio-success/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}>
                {isApiConfigured() ? <Cloud className="h-3.5 w-3.5" /> : <CloudOff className="h-3.5 w-3.5" />}
                {isApiConfigured() ? "API Connected" : "Mock Mode"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isApiConfigured()
                ? `Connected to ${import.meta.env.VITE_API_BASE_URL}`
                : "Set VITE_API_BASE_URL to connect a backend"}
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Wizard Steps */}
        <div className="mb-8">
          <WizardSteps
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            completedSteps={completedSteps}
          />
        </div>

        {/* Step Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{STEP_TITLES[currentStep]}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep + 1} of 6
          </p>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <CreateStep
            onComplete={(data) => {
              setProjectData(data);
              completeStep(0);
            }}
          />
        )}
        {currentStep === 1 && (
          <AudioStep
            lyrics={projectData?.lyrics}
            sunoPrompt={projectData?.sunoPrompt}
            onComplete={(_file, duration) => {
              setAudioDuration(duration);
              completeStep(1);
            }}
          />
        )}
        {currentStep === 2 && (
          <ClipsStep
            visualBrief={projectData?.visualBrief}
            aspectRatio={projectData?.aspectRatio}
            onComplete={(clips) => {
              setClipCount(clips.length);
              completeStep(2);
            }}
          />
        )}
        {currentStep === 3 && (
          <RenderStep
            audioDuration={audioDuration}
            clipCount={clipCount}
            onComplete={() => completeStep(3)}
          />
        )}
        {currentStep === 4 && (
          <UploadStep
            titleOptions={projectData?.titleOptions}
            description={projectData?.description}
            onComplete={() => completeStep(4)}
          />
        )}
        {currentStep === 5 && <TrackStep />}
      </main>
    </div>
  );
};

export default Index;
