import DispatchOrderPage from "@/components/order-management/dispatch-order";
import LinkOrder from "@/components/order-management/link-order";
import UnlinkOrder from "@/components/order-management/unlink-order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$main/orders/order-management")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Order Management",
      },
    ],
  }),
});

const ORDER_PAGES = [
  { value: "dispatch", label: "Dispatching New Work Order" },
  { value: "link", label: "Link order to another" },
  { value: "unlink", label: "Unlink order from other order" },
  { value: "brova-receiving", label: "Receiving Brova / Final Production" },
  { value: "change-options", label: "Change Options" },
  { value: "brova-feedback", label: "Brova Feedback" },
  { value: "final-feedback", label: "Final Feedback" },
  { value: "alteration-feedback", label: "Alteration Feedback" },
  { value: "cancel-order", label: "Cancel Order" },
];

function RouteComponent() {
  return (
    <Tabs defaultValue="dispatch" className="w-full">
      <TabsList className="flex flex-wrap gap-1">
        {ORDER_PAGES.map((page) => (
          <TabsTrigger key={page.value} value={page.value} className="text-xs">
            {page.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="dispatch">
        <DispatchOrderPage />
      </TabsContent>

      <TabsContent value="link">
        <LinkOrder />
      </TabsContent>

      <TabsContent value="unlink">
        <UnlinkOrder />
      </TabsContent>

      <TabsContent value="brova-receiving">
        <BrovaReceivingPage />
      </TabsContent>

      <TabsContent value="change-options">
        <ChangeOptionsPage />
      </TabsContent>

      <TabsContent value="brova-feedback">
        <BrovaFeedbackPage />
      </TabsContent>

      <TabsContent value="final-feedback">
        <FinalFeedbackPage />
      </TabsContent>

      <TabsContent value="alteration-feedback">
        <AlterationFeedbackPage />
      </TabsContent>

      <TabsContent value="cancel-order">
        <CancelOrderPage />
      </TabsContent>
    </Tabs>
  );
}

export function DispatchPage() {
  return <div className="text-sm">Dispatching New Work Order Page</div>;
}

export function BrovaReceivingPage() {
  return <div className="text-sm">Receiving Brova / Final Production Page</div>;
}

export function ChangeOptionsPage() {
  return <div className="text-sm">Change Options Page</div>;
}

export function BrovaFeedbackPage() {
  return <div className="text-sm">Brova Feedback Page</div>;
}

export function FinalFeedbackPage() {
  return <div className="text-sm">Final Feedback Page</div>;
}

export function AlterationFeedbackPage() {
  return <div className="text-sm">Alteration Feedback Page</div>;
}

export function CancelOrderPage() {
  return <div className="text-sm">Cancel Order Page</div>;
}
