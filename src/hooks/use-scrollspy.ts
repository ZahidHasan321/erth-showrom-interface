import * as React from 'react';

export function useScrollSpy(sectionRefs: React.RefObject<HTMLDivElement | null>[], options: IntersectionObserverInit) {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const observer = React.useRef<IntersectionObserver | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            return;
          }
        }
      }, 0);
    }, options);

    const { current: currentObserver } = observer;

    sectionRefs.forEach((ref) => {
      if (ref.current) {
        currentObserver.observe(ref.current);
      }
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sectionRefs, options]);

  return activeSection;
}