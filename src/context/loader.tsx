
import { createContext, useState, type ReactNode } from "react";

type LoaderContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
