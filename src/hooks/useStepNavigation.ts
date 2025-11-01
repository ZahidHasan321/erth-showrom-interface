import * as React from "react";

type Step = {
  title: string;
  id: string;
};

type UseStepNavigationOptions = {
  steps: Step[];
  setCurrentStep: (step: number) => void;
  addSavedStep: (step: number) => void;
};

export function useStepNavigation({
  steps,
  setCurrentStep,
  addSavedStep,
}: UseStepNavigationOptions) {
  const sectionRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    sectionRefs.current = steps.map((_, i) => sectionRefs.current[i] ?? null);
  }, [steps]);

  const handleStepChange = React.useCallback(
    (i: number) => {
      const el = sectionRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        const headerOffset = 120;
        const offsetPosition = window.scrollY + rect.top - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    []
  );

  const handleProceed = React.useCallback(
    (step: number) => {
      addSavedStep(step);
      handleStepChange(step + 1);
    },
    [addSavedStep, handleStepChange]
  );

  // Scroll tracking with RAF throttling
  React.useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      const centers = steps.map((_, i) => {
        const el = sectionRefs.current[i];
        if (!el) return Number.POSITIVE_INFINITY;
        const rect = el.getBoundingClientRect();
        const topAbs = window.scrollY + rect.top;
        return topAbs + rect.height / 2;
      });

      const viewportCenter = window.scrollY + window.innerHeight / 2;

      let nearest = 0;
      let minDist = Infinity;
      centers.forEach((c, idx) => {
        const d = Math.abs(viewportCenter - c);
        if (d < minDist) {
          minDist = d;
          nearest = idx;
        }
      });

      setCurrentStep(nearest);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => updateActive());
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [setCurrentStep, steps]);

  return {
    sectionRefs,
    handleStepChange,
    handleProceed,
  };
}
