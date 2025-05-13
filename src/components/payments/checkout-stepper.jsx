import { Check } from "lucide-react";

const CheckoutStepper = ({ steps, currentStep }) => {
  return (
    <div className="max-w-2xl md:w-[50vw] mb-8 mx-auto">
      <div className="flex justify-between items-center relative">
        {/* Progress line */}
        <div className="absolute h-[1px] bg-gray-300 left-0 right-0 top-[30%] transform -translate-y-1/2 z-0"></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
            >
              {/* Circle */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : isActive
                    ? "bg-white border-gray-400"
                    : "bg-white border-gray-300"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 text-white" /> : null}
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-1 ${
                  isActive ? "font-medium" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutStepper;
