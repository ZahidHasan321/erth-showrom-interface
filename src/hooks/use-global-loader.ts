
import { useContext } from "react";
import { LoaderContext } from "@/context/loader";

export const useGlobalLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useGlobalLoader must be used within a LoaderProvider");
  }
  return context;
};
