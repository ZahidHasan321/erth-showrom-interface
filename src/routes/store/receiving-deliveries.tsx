import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store/receiving-deliveries")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Coming soon</div>;
}
