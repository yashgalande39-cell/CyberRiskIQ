import { useEffect, useState } from "react";
import OrganizationStepOne, { type OrgStepOneForm, initialOrgStepOneForm } from "./OrganizationStepOne";
import RiskParameters, { type RiskParamsForm, initialRiskParamsForm } from "./RiskParameters";
import OrganizationStepThree from "./OrganizationStepThree";
import OrganizationStepFour from "./OrganizationStepFour";

interface OrganizationSetupProps {
  initialStep?: number;
  onNavigateHome?: () => void;
  onLaunchDashboard?: () => void;
}

export default function OrganizationSetup({
  initialStep = 1,
  onNavigateHome,
  onLaunchDashboard,
}: OrganizationSetupProps) {
  const [step, setStep] = useState(initialStep);
  const [stepOneData, setStepOneData] = useState<OrgStepOneForm>(initialOrgStepOneForm);
  const [stepTwoData, setStepTwoData] = useState<RiskParamsForm>(initialRiskParamsForm);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  if (step === 1) {
    return (
      <OrganizationStepOne
        initialValues={stepOneData}
        onValuesChange={(vals) => setStepOneData(vals)}
        onBack={onNavigateHome}
        onContinue={() => setStep(2)}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  if (step === 2) {
    return (
      <RiskParameters
        initialValues={stepTwoData}
        onValuesChange={(vals) => setStepTwoData(vals)}
        onBack={() => setStep(1)}
        onContinue={() => setStep(3)}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  if (step === 3) {
    return (
      <OrganizationStepThree
        stepOneValues={stepOneData}
        stepTwoValues={stepTwoData}
        onBack={() => setStep(2)}
        onContinue={() => setStep(4)}
        onLaunchDashboard={() => setStep(4)}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return (
    <OrganizationStepFour
      stepOneValues={stepOneData}
      stepTwoValues={stepTwoData}
      onEditDetails={() => setStep(1)}
      onViewConnectors={() => setStep(3)}
      onLaunchDashboard={onLaunchDashboard || onNavigateHome}
      onNavigateHome={onNavigateHome}
    />
  );
}
