import { Step, StepItem, Stepper } from "~~/components/kyklos/ui/stepper";

const steps = [
  { label: "22/01/2024", id: "1", icon: () => <div>120</div> },
  { id: "2", label: "22/03/2024", icon: () => <div>120</div> },
  { id: "3", label: "22/08/2024", icon: () => <div>120</div> },
] satisfies StepItem[];

function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={1} steps={steps} variant="circle-alt">
        {steps.map(stepProps => {
          return <Step key={stepProps.label} {...stepProps}></Step>;
        })}
      </Stepper>
    </div>
  );
}

export default StepperDemo;
