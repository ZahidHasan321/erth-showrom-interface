"use client";

import { createOrder, updateOrder } from "@/api/orders";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import {
  customerDemographicsDefaults,
  customerDemographicsSchema,
} from "@/components/forms/customer-demographics/schema";
import { CustomerMeasurementsForm } from "@/components/forms/customer-measurements";
import {
  customerMeasurementsDefaults,
  customerMeasurementsSchema,
} from "@/components/forms/customer-measurements/schema";
import { FabricSelectionForm } from "@/components/forms/fabric-selection-and-options";
import {
  fabricSelectionSchema,
  type FabricSelectionSchema,
} from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import {
  styleOptionsSchema,
  type StyleOptionsSchema,
} from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import {
  orderTypeAndPaymentDefaults,
  OrderTypeAndPaymentForm,
  orderTypeAndPaymentSchema,
} from "@/components/forms/order-type-and-payment";
import { paymentTypeSchema } from "@/components/forms/payment-type";
import { PaymentTypeForm } from "@/components/forms/payment-type/payment-type-form";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import HorizontalStepper from "@/components/ui/horizontal-stepper";
import {
  mapApiOrderToFormOrder,
  mapFormOrderToApiOrder,
} from "@/lib/order-mapper";
import type { OrderSchema } from "@/schemas/work-order-schema";
import { createWorkOrderStore } from "@/store/current-work-order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getPrices } from "@/api/prices";

export const Route = createFileRoute("/$main/orders/new-work-order")({
  component: NewWorkOrder,
  head: () => ({
    meta: [{ title: "New Work Order" }],
  }),
});

const steps = [
  { title: "Demographics", id: "step-0" },
  { title: "Measurement", id: "step-1" },
  { title: "Fabric Selection", id: "step-2" },
  { title: "Shelves Products", id: "step-3" },
  { title: "Order & Payment Info", id: "step-4" },
  { title: "Confirmation", id: "step-5" },
];

const useCurrentWorkOrderStore = createWorkOrderStore("main");

function NewWorkOrder() {
  const { data: pricesData } = useQuery({
    queryKey: ["prices"],
    queryFn: getPrices,
    staleTime: Infinity,
    gcTime: Infinity
  });

  const pricesMap = React.useMemo(() => {
    const map = new Map<string, number>();
    if (pricesData?.data) {
      pricesData.data.forEach((item) => {
        map.set(item.fields.name, item.fields.price);
      });
    }
    return map;
  }, [pricesData]);

  // confirmation dialog
  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });

  // store selectors
  const currentStep = useCurrentWorkOrderStore((s) => s.currentStep);
  const setCurrentStep = useCurrentWorkOrderStore((s) => s.setCurrentStep);
  const savedSteps = useCurrentWorkOrderStore((s) => s.savedSteps);
  const addSavedStep = useCurrentWorkOrderStore((s) => s.addSavedStep);
  const removeSavedStep = useCurrentWorkOrderStore((s) => s.removeSavedStep);
  const customerDemographics = useCurrentWorkOrderStore(
    (s) => s.customerDemographics
  );
  const setCustomerDemographics = useCurrentWorkOrderStore(
    (s) => s.setCustomerDemographics
  );
  const fabricSelections = useCurrentWorkOrderStore((s) => s.fabricSelections);
  const setFabricSelections = useCurrentWorkOrderStore(
    (s) => s.setFabricSelections
  );
  const setStyleOptions = useCurrentWorkOrderStore((s) => s.setStyleOptions);
  const setShelvedProducts = useCurrentWorkOrderStore(
    (s) => s.setShelvedProducts
  );
  const shelvedProducts = useCurrentWorkOrderStore((s) => s.shelvedProducts);
  const orderId = useCurrentWorkOrderStore((s) => s.orderId);
  const setOrderId = useCurrentWorkOrderStore((s) => s.setOrderId);
  const order = useCurrentWorkOrderStore((s) => s.order);
  const setOrder = useCurrentWorkOrderStore((s) => s.setOrder);
  const resetWorkOrder = useCurrentWorkOrderStore((s) => s.resetWorkOrder);

  // mutation to create order
  const { mutate: createNewOrder, isPending } = useMutation({
    mutationFn: () => createOrder({ fields: { OrderStatus: "Pending" } }),
    onSuccess: (response) => {
      if (response.data) {
        const order = response.data;
        const formattedOrder = mapApiOrderToFormOrder(order);
        setOrderId(order.id);
        setOrder(formattedOrder);

        demographicsForm.reset();
        measurementsForm.reset();
        toast.success("New work order created successfully!");
      }
    },
    onError: () => {
      toast.error("Failed to create new work order.");
    },
  });

  // forms
  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: customerDemographicsDefaults,
  });

  const measurementsForm = useForm<z.infer<typeof customerMeasurementsSchema>>({
    resolver: zodResolver(customerMeasurementsSchema),
    defaultValues: customerMeasurementsDefaults,
  });

  React.useEffect(() => {
    measurementsForm.reset(customerMeasurementsDefaults);
  }, [customerDemographics.id, measurementsForm]);

  const fabricSelectionForm = useForm<{
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }>({
    resolver: zodResolver(
      z.object({
        fabricSelections: z.array(fabricSelectionSchema),
        styleOptions: z.array(styleOptionsSchema),
      })
    ),
    defaultValues: { fabricSelections: [], styleOptions: [] },
  });

  const OrderForm = useForm<z.infer<typeof orderTypeAndPaymentSchema>>({
    resolver: zodResolver(orderTypeAndPaymentSchema),
    defaultValues: orderTypeAndPaymentDefaults,
  });

  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: { paymentType: "cash" },
  });

  // charges
  const shelfCharges =
    shelvedProducts && shelvedProducts.length > 0
      ? shelvedProducts.reduce(
        (total, product) => total + product.quantity * product.unitPrice,
        0
      )
      : 0;

  const fabricCharges = 100;
  const stitchingCharges = 20;
  const advancePayment = fabricCharges + shelfCharges + 0.5 * stitchingCharges;

  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", shelfCharges);
    OrderForm.setValue("charges.fabric", fabricCharges);
    OrderForm.setValue("charges.stitching", stitchingCharges);
    OrderForm.setValue("charges.style", 0);
    OrderForm.setValue("advance", advancePayment);
  }, [
    shelfCharges,
    fabricCharges,
    stitchingCharges,
    advancePayment,
    OrderForm,
  ]);

  // ----------------------------
  // stable refs for sections
  // ----------------------------
  const sectionRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  // ensure array length
  React.useEffect(() => {
    sectionRefs.current = steps.map((_, i) => sectionRefs.current[i] ?? null);

  }, []);

  React.useEffect(() => {

    return () => {
      demographicsForm.reset(customerDemographicsDefaults);
      resetWorkOrder();
    };
  }, [])

  // ----------------------------
  // scroll tracking (rAF-throttled)
  // ----------------------------
  React.useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      // compute centers for each section
      const centers = steps.map((_, i) => {
        const el = sectionRefs.current[i];
        if (!el) return Number.POSITIVE_INFINITY;
        const rect = el.getBoundingClientRect();
        // absolute center relative to document
        const topAbs = window.scrollY + rect.top;
        return topAbs + rect.height / 2;
      });

      const viewportCenter = window.scrollY + window.innerHeight / 2;

      // find nearest center
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
    // run once on mount
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [setCurrentStep]);

  // completed steps
  const completedSteps = savedSteps;

  // scroll to step when clicked
  const handleStepChange = (i: number) => {
    const el = sectionRefs.current[i];
    if (el) {
      const rect = el.getBoundingClientRect();
      const headerOffset = 120; // height of your sticky header
      const offsetPosition = window.scrollY + rect.top - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleProceed = (step: number) => {
    addSavedStep(step);
    handleStepChange(step + 1);
  };
  const handleFabricSelectionSubmit = (data: {
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }) => {
    setFabricSelections(data.fabricSelections);
    setStyleOptions(data.styleOptions);

    let stylePrice = 0;
    const addPrice = (key?: string) => {
      if (!key) return;
      const price = pricesMap.get(key);
      if (price) stylePrice += price;
      else console.warn("Missing price for:", key);
    };
    data.styleOptions.forEach((style) => {
      addPrice(style.collar?.collarButton)
      addPrice(style.collar?.collarButton)
      addPrice("smallTabaggi")
      addPrice(style.style)
      addPrice(style.lines)
      addPrice("phone")
      addPrice("wallet")
      addPrice("pen_holder")
      if(style.jabzoor?.jabzour1 === "ZIP"){
        addPrice(`${ style.jabzoor.jabzour1 }-${style.jabzoor.jabzour2}-${style.jabzoor.jabzour_thickness}`)
      }else{
        addPrice(`${style.jabzoor?.jabzour1}-${style.jabzoor?.jabzour_thickness}`)
      }
      addPrice(`${style.cuffs?.cuffs_type}-${style.cuffs?.cuffs_thickness}`)
      addPrice(`${style.frontPocket?.front_pocket_type}-${style.frontPocket?.front_pocket_thickness}`)
    })

    let fabricPrice = 0;

    data.fabricSelections.forEach((fabric) => {
      if(fabric.fabricAmount)
        fabricPrice += fabric.fabricAmount
    })


    toast.success("Fabric Selections and Style Options saved ✅");
  };

  React.useEffect(() => {
    if (!orderId) {
      setConfirmationDialog({
        isOpen: true,
        title: "Create New Work Order",
        description: "Do you want to create a new work order?",
        onConfirm: () => {
          createNewOrder();
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  }, [orderId, createNewOrder]);

  type UpdateOrderPayload = {
    fields: Partial<OrderSchema>;
    orderId: string;
    onSuccessAction?: "customer" | "payment" | "fabric" | null;
  };

  const { mutate: updateOrderFn } = useMutation({
    mutationFn: ({ fields, orderId }: UpdateOrderPayload) => {
      const orderMapped = mapFormOrderToApiOrder(fields);
      return updateOrder(orderMapped["fields"], orderId);
    },
    onSuccess: (_response, variables) => {
      // variables contains what you passed to mutate()
      if (variables.onSuccessAction === "customer") {
        toast.success("Customer updated ✅");
        setOrder(variables.fields);
        setCustomerDemographics(demographicsForm.getValues());
        handleProceed(0); // move to next step
      } else if (variables.onSuccessAction === "payment") {
        toast.success("Payment info saved ✅");
        handleProceed(4);
      } else {
        toast.success("Order updated successfully ✅");
      }
    },
    onError: () => toast.error("Failed to update order"),
  });

  // If not created yet
  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <h2 className="text-2xl font-semibold">No order created yet 📝</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to create a new work order before proceeding.
        </p>

        <Button
          size="lg"
          onClick={() =>
            setConfirmationDialog({
              isOpen: true,
              title: "Create New Work Order",
              description:
                "Do you want to create a new work order? This will initialize a new order entry.",
              onConfirm: () => {
                createNewOrder();
                setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
              },
            })
          }
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create New Work Order"}
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

  // ----------------------------
  // MAIN RENDER
  // ----------------------------
  return (
    <div className="mb-56">
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() =>
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        description={confirmationDialog.description}
      />

      <div className="sticky top-0 z-20">
        <HorizontalStepper
          steps={steps}
          completedSteps={completedSteps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />
        <div className="w-full flex justify-end mt-2">
          <div className="bg-card p-4 shadow-lg rounded-lg z-10 border-b border-border max-w-xs mr-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Work Order #{order.OrderID}
            </h2>
            <p className="text-sm text-muted-foreground">
              Status:{" "}
              <span className="font-medium text-green-600">
                {order.OrderStatus ?? "Pending"}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Customer:{" "}
              <span className="font-medium">
                {order.CustomerID?.length
                  ? customerDemographics.nickName
                  : "No customer yet"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Make space so sticky header does not overlap content */}

      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center space-y-10 p-4 xl:p-0 mx-20">
        {steps.map((step, index) => (
          <div
            key={step.id}
            id={step.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="w-full flex flex-col items-center"
          >
            {/* Render the appropriate form for each step */}
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                onEdit={() => removeSavedStep(0)}
                onCancel={() => addSavedStep(0)}
                onProceed={() => {
                  const recordID =
                    demographicsForm.getValues("customerRecordId");
                  if (orderId && recordID) {
                    updateOrderFn({
                      fields: {
                        CustomerID: [recordID],
                      },
                      orderId: orderId!,
                      onSuccessAction: "customer",
                    });
                  }
                }}
                onClear={() => removeSavedStep(0)}
              />
            )}

            {index === 1 && (
              <CustomerMeasurementsForm
                form={measurementsForm}
                onSubmit={() => toast.success("Customer Measurements saved ✅")}
                customerId={customerDemographics.id?.toString() || null}
                customerRecordId={customerDemographics.customerRecordId}
                onProceed={() => handleProceed(1)}
              />
            )}

            {index === 2 && (
              <FabricSelectionForm
                customerId={customerDemographics.id?.toString() || null}
                form={fabricSelectionForm}
                onSubmit={handleFabricSelectionSubmit}
                onProceed={() => handleProceed(2)}
                orderId={order?.OrderID ?? null}
                onCampaignsChange={(campaigns) => {
                  if (orderId) {
                    updateOrderFn({
                      fields: {
                        Campaigns: campaigns,
                      },
                      orderId: orderId,
                    });
                  }
                }}
                isProceedDisabled={fabricSelections.length === 0}
              />
            )}

            {index === 3 && (
              <ShelvedProductsForm
                setFormData={setShelvedProducts}
                onProceed={() => handleProceed(3)}
              />
            )}

            {index === 4 && (
              <OrderTypeAndPaymentForm
                form={OrderForm}
                onSubmit={(data) => {
                  setOrder(data);
                  toast.success("Order & Payment Info saved ✅");
                }}
                onProceed={() => handleProceed(4)}
              />
            )}

            {index === 5 && (
              <PaymentTypeForm
                form={paymentForm}
                onSubmit={() => {
                  const currentStore = useCurrentWorkOrderStore.getState();
                  console.log("🧾 Full Work Order Store:", currentStore);
                  toast.success("Payment confirmed! ✅");
                  handleProceed(5);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
