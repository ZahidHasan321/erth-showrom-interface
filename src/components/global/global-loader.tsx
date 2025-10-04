import { useGlobalLoader } from "@/hooks/use-global-loader";
import { LoadingSpinner } from "./loading-spinner";

export function GlobalLoader() {
  const { isLoading } = useGlobalLoader();

  if (!isLoading) {
    return null;
  }

  return (
<div className="fixed inset-0 z-50 flex items-baseline justify-center pointer-events-none">
  <LoadingSpinner />
</div>
  );
}