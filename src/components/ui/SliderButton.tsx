import { forwardRef } from "preact/compat";
import type { SliderButtonProps } from "@/types/slider";

const baseClasses =
  "text-center w-12 h-12 lg:w-16 lg:h-16 rounded-full transition-colors duration-200 focus:outline-none";
const loadingClasses = "animate-pulse bg-gray-300 cursor-wait";
const readyClasses =
  "border border-honolulu-blue-600 text-honolulu-blue-600 hover:text-light-cyan-600 hover:bg-honolulu-blue-600";

const SliderButton = forwardRef<HTMLButtonElement, SliderButtonProps>(
  ({ isLoading, direction, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading}
        className={`
          ${baseClasses}
          ${isLoading ? loadingClasses : readyClasses}
          ${className}
        `}
        {...props}
      >
        {!isLoading && (
          <i className={`ti ti-chevron-${direction} text-3xl`}></i>
        )}
      </button>
    );
  }
);

export default SliderButton;
