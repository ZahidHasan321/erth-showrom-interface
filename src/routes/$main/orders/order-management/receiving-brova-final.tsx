import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$main/orders/order-management/receiving-brova-final")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Receiving Brova / Final",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Receiving Brova / Final</h1>
      <p className="text-muted-foreground">
        This page is for receiving Brova or Final production items.
      </p>
    </div>
  );
}
