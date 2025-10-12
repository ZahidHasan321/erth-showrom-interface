import { createOrder } from "@/api/orders";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import { customerDemographicsDefaults, customerDemographicsSchema } from "@/components/forms/customer-demographics/schema";
import { orderTypeAndPaymentDefaults, OrderTypeAndPaymentForm, orderTypeAndPaymentSchema } from "@/components/forms/order-type-and-payment";
import { PaymentTypeForm, paymentTypeSchema } from "@/components/forms/payment-type";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import { useScrollSpy } from "@/hooks/use-scrollspy";
import { mapApiOrderToFormOrder } from "@/lib/order-mapper";
import { createSalesOrderStore } from "@/store/current-sales-order";
import { type Order } from "@/types/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/$main/orders/new-sales-order")({
  component: NewSalesOrder,
  head: () => ({
    meta: [{ title: "New Sales Order" }],
  }),
});

const steps = [
  { title: "Demographics", id: "step-0" },
  { title: "Shelves Products", id: "step-1" },
  { title: "Order & Payment Info", id: "step-2" },
  { title: "Confirmation & Payment", id: "step-3" },
];

function NewSalesOrder() {
  const { main } = Route.useParams();
  const useCurrentSalesOrderStore = React.useMemo(
    () => createSalesOrderStore(main),
    [main]
  );

  const [askedToCreateOrder, setAskedToCreateOrder] = React.useState(false);

  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const {
    currentStep,
    setCurrentStep,
    savedSteps,
    addSavedStep,
    removeSavedStep,
    setCustomerId,
    customerRecordId,
    setCustomerRecordId,
    setCustomerDemographics,
    shelvedProducts,
    setShelvedProducts,
    orderId,
    setOrderId,
    setOrder,
    setPaymentType,
    setOtherPaymentType,
    setPaymentRefNo,
  } = useCurrentSalesOrderStore();

  const { mutate: createNewOrder, isPending } = useMutation({
    mutationFn: () => createOrder({ fields: { OrderStatus: "Pending" } }),
    onSuccess: (response) => {
      if (response.data) {
        const order = response.data as Order;
        const formattedOrder = mapApiOrderToFormOrder(order);
        setOrderId(order.fields?.OrderID??null);
        setOrder(formattedOrder);
        toast.success("New sales order created successfully!");
      }
    },
    onError: () => {
      toast.error("Failed to create new sales order.");
    },
  });

  // Forms
  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: customerDemographicsDefaults,
  });

  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      paymentType: "cash",
      otherPaymentType: "",
      paymentRefNo: "",
    },
  });


  const OrderForm = useForm<z.infer<typeof orderTypeAndPaymentSchema>>({
    resolver: zodResolver(orderTypeAndPaymentSchema),
    defaultValues: orderTypeAndPaymentDefaults,
  });

  const shelfCharges = React.useMemo(() => {
    if (!shelvedProducts || shelvedProducts.length === 0) {
      return 0;
    }
    return shelvedProducts.reduce((total, product) => {
      return total + product.quantity * product.unitPrice;
    }, 0);
  }, [shelvedProducts]);
  // Dummy values for now, as per prompt
  // const discount = 0;
  // const balance = totalDue - discount;

  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", shelfCharges);
  }, [shelfCharges]);
  // Refs for scroll sections
  const sectionRefs = steps.map(() => React.useRef<HTMLDivElement | null>(null));
  const activeSection = useScrollSpy(sectionRefs, {
    rootMargin: "0px",
    threshold: 0.5,
  });

  React.useEffect(() => {
    if (activeSection) {
      const nextStep = steps.findIndex((step) => step.id === activeSection);
      if (nextStep !== -1 && nextStep !== currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [activeSection, currentStep, setCurrentStep]);

  const completedSteps = savedSteps;

  const handleStepChange = (i: number) => {
    const element = document.getElementById(steps[i].id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProceed = React.useCallback(
    (step: number) => {
      addSavedStep(step);
    },
    [addSavedStep]
  );

  // -------------------------------------------------
  // Auto-prompt user on first mount if no order exists
  // -------------------------------------------------
  React.useEffect(() => {
    if (!orderId && !askedToCreateOrder) {
      setAskedToCreateOrder(true);
      setConfirmationDialog({
        isOpen: true,
        title: "Create New Sales Order",
        description: "Do you want to create a new sales order?",
        onConfirm: () => {
          createNewOrder();
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  }, [orderId, askedToCreateOrder, createNewOrder]);

  // -------------------------------------------------
  // Render states
  // -------------------------------------------------

  // While we haven't asked yet
  if (!orderId && !askedToCreateOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Preparing new sales order...</p>
      </div>
    );
  }

  // If asked but no order created (user canceled)
  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <h2 className="text-2xl font-semibold">No order created yet 📝</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to create a new sales order before proceeding.
        </p>

        <Button
          size="lg"
          onClick={() =>
            setConfirmationDialog({
              isOpen: true,
              title: "Create New Sales Order",
              description:
                "Do you want to create a new sales order? This will initialize a new order entry.",
              onConfirm: () => {
                createNewOrder();
                setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
              },
            })
          }
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create New Sales Order"}
        </Button>

        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() =>
            setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />
      </div>
    );
  }

  // -------------------------------------------------
  // MAIN CONTENT (only shown after orderId is set)
  // -------------------------------------------------

  function onHandleProceed(customerRecordId: string | null, orderId: string | null) {
    if (orderId && customerRecordId) {
      setOrder({ CustomerID: [customerRecordId] });
      handleProceed(0);
    }
  }

  const handlePaymentSubmit = (data: z.infer<typeof paymentTypeSchema>) => {
    setPaymentType(data.paymentType);
    setOtherPaymentType(data.otherPaymentType || null);
    setPaymentRefNo(data.paymentRefNo || null);

    const currentStore = useCurrentSalesOrderStore.getState();
    console.log("🧾 Full Sales Order Store:", currentStore);

    toast.success("Sales Order Confirmed! ✅");
    handleProceed(2);
  };

  return (
    <div className="mb-20">
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() =>
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        description={confirmationDialog.description}
      />

      {/* Stepper */}
      <div className="sticky w-full top-0 z-10 bg-white dark:bg-gray-950 shadow-md">
        <HorizontalStepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepChange={handleStepChange}
        />
      </div>
      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center space-y-20 p-4 xl:p-0 w-full">
        <p>Order ID: {orderId}</p>
        {steps.map((step, index) => (
          <div
            key={step.id}
            id={step.id}
            className="w-full flex flex-col items-center max-w-7xl"
            ref={sectionRefs[index]}
          >
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                onSubmit={(data) => {
                  setCustomerDemographics(data);
                  toast.success("Customer Demographics saved ✅");
                }}
                onEdit={() => removeSavedStep(0)}
                onCancel={() => addSavedStep(0)}
                onCustomerIdChange={setCustomerId}
                onCustomerRecordChange={setCustomerRecordId}
                onProceed={() => onHandleProceed(customerRecordId, orderId)}
                onClear={() => removeSavedStep(0)}
              />
            )}

            {index === 1 && (
              <ShelvedProductsForm
                setFormData={setShelvedProducts}
                onProceed={() => handleProceed(1)}
              />
            )}

            {
              index === 2 && (
                <OrderTypeAndPaymentForm
                  form={OrderForm}
                  optional = {false}
                  onSubmit={(data) => {
                    setOrder(data);
                    toast.success("Order & Payment Info saved ✅");
                  }}
                  onProceed={() => handleProceed(4)}
                />
              )
            }

            {index === 3 && (
              <div className="w-full space-y-6">
                <PaymentTypeForm form={paymentForm} onSubmit={handlePaymentSubmit} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
