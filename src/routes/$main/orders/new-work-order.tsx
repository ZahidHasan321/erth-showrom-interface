"use client";

import { createOrder, updateOrder } from "@/api/orders";
import { getPrices } from "@/api/prices";
import { updateShelf } from "@/api/shelves";
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
import { OrderTypeAndPaymentForm } from "@/components/forms/order-type-and-payment";
import { paymentTypeSchema } from "@/components/forms/payment-type";
import { PaymentTypeForm } from "@/components/forms/payment-type/payment-type-form";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import {
  shelvesFormSchema,
  type ShelvesFormValues,
} from "@/components/forms/shelved-products/schema";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import {
  mapApiOrderToFormOrder,
  mapFormOrderToApiOrder,
} from "@/lib/order-mapper";
import {
  orderDefaults,
  orderSchema,
  type OrderSchema,
} from "@/schemas/work-order-schema";
import { createWorkOrderStore } from "@/store/current-work-order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ErrorBoundary } from "@/components/global/error-boundary";
import { getFabrics, updateFabric } from "@/api/fabrics";

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
    gcTime: Infinity,
  });

  const queryClient = useQueryClient()

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

  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
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
  // const setShelvedProducts = useCurrentWorkOrderStore(
  // 	(s) => s.setShelvedProducts
  // );
  // const shelvedProducts = useCurrentWorkOrderStore((s) => s.shelvedProducts);
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
        // resetWorkOrder()
        demographicsForm.reset();
        measurementsForm.reset();
        fabricSelectionForm.reset();
        ShelvesForm.reset();
        OrderForm.reset;

        setOrderId(order.id);
        console.log(formattedOrder);
        setOrder(formattedOrder);

        toast.success("New work order created successfully!");
      }
    },
    onError: () => {
      toast.error("Failed to create new work order.");
      resetWorkOrder();
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

  const OrderForm = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: orderDefaults,
  });

  const orderStatus = useWatch({
    control: OrderForm.control,
    name: "orderStatus",
  });

  const isOrderClosed = orderStatus === "Completed" || orderStatus === "Cancelled";

  const ShelvesForm = useForm<ShelvesFormValues>({
    resolver: zodResolver(shelvesFormSchema),
    defaultValues: {
      products: [],
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: { paymentType: "cash" },
  });

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
      demographicsForm.reset();
      resetWorkOrder();
    };
  }, []);

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
    addSavedStep(2); // Mark this step as saved

    // Calculate style prices
    let stylePrice = 0;
    const addPrice = (key?: string) => {
      if (!key) return;
      const price = pricesMap.get(key);
      if (price) stylePrice += price;
      else console.warn("Missing price for:", key);
    };
    data.styleOptions.forEach((style) => {
      addPrice(style.collar?.collarButton);
      addPrice(style.collar?.collarButton);
      addPrice("smallTabaggi");
      addPrice(style.style);
      addPrice(style.lines);
      addPrice("phone");
      addPrice("wallet");
      addPrice("pen_holder");
      if (style.jabzoor?.jabzour1 === "ZIP") {
        addPrice(
          `${style.jabzoor.jabzour1}-${style.jabzoor.jabzour2}-${style.jabzoor.jabzour_thickness}`
        );
      } else {
        addPrice(
          `${style.jabzoor?.jabzour1}-${style.jabzoor?.jabzour_thickness}`
        );
      }
      addPrice(`${style.cuffs?.cuffs_type}-${style.cuffs?.cuffs_thickness}`);
      addPrice(
        `${style.frontPocket?.front_pocket_type}-${style.frontPocket?.front_pocket_thickness}`
      );
    });

    let fabricPrice = 0;

    data.fabricSelections.forEach((fabric) => {
      if (fabric.fabricAmount) fabricPrice += fabric.fabricAmount;
    });

    let stitchingPrice = pricesMap.get("stitching");

    OrderForm.setValue("charges.fabric", fabricPrice);
    OrderForm.setValue("charges.style", stylePrice); // charges
    if (stitchingPrice)
      OrderForm.setValue(
        "charges.stitching",
        stitchingPrice * data.fabricSelections.length
      );
  };

  const products = useWatch({
    control: ShelvesForm.control,
    name: "products", // Add this to watch the products array
  });

  const totalShelveAmount =
    products?.reduce(
      (acc, p) => acc + (p.quantity ?? 0) * (p.unitPrice ?? 0),
      0
    ) ?? 0;

  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", totalShelveAmount);
  }, [totalShelveAmount, OrderForm]);

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
    onSuccessAction?: "customer" | "payment" | "fabric" | "campaigns" | "updated" | "cancelled" | null;
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
      } else if (variables.onSuccessAction === "updated") {
        toast.success("Order updated successfully✅");
        handleProceed(4);
      } else if (variables.onSuccessAction === "cancelled") {
        toast.success("Order cancelled");
      }
    },
    onError: () => toast.error("Failed to update order"),
  });

  const { mutate: updateShelfFn } = useMutation({
    mutationFn: (shelvedData: ShelvesFormValues) => {
      const promises = shelvedData.products.map((item) => {
        return updateShelf(item.id, { Stock: item.Stock - item.quantity });
      });

      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error("Unable to update the shelves stock");
    },
  });

  const { mutate: updateFabricStockFn } = useMutation({
    mutationFn: async (fabricSelections: FabricSelectionSchema[]) => {
      // Filter only fabrics from "In" source
      const internalFabrics = fabricSelections.filter(
        (fabric) => fabric.fabricSource === "In" && fabric.fabricId
      );

      if (internalFabrics.length === 0) {
        return Promise.resolve([]);
      }

      // Fetch current fabric data to get existing stock
      const fabrics = fabricsResponse?.data || [];

      // Create update promises
      const promises = internalFabrics.map((fabricSelection) => {
        const currentFabric = fabrics.find((f) => f.id === fabricSelection.fabricId);
        const currentId = fabricSelection.fabricId


        if (!currentFabric) {
          console.error(`Fabric not found: ${fabricSelection.fabricId}`);
          return Promise.resolve(null);
        }

        const currentStock = currentFabric.fields.RealStock || 0;
        const usedLength = parseFloat(fabricSelection.fabricLength);

        if (isNaN(usedLength) || usedLength <= 0) {
          console.error(`Invalid fabric length: ${fabricSelection.fabricLength}`);
          return Promise.resolve(null);
        }

        const newStock = currentStock - usedLength;

        // Prevent negative stock
        if (newStock < 0) {
          console.error(
            `Insufficient stock for fabric ${fabricSelection.fabricId}. Current: ${currentStock}, Requested: ${usedLength}`
          );
          return Promise.resolve(null);
        }


        if (!currentId) {
          console.error(`Fabric not found: ${fabricSelection.fabricId}`);
          return Promise.resolve(null);
        }

        return updateFabric(currentId, {
          ...currentFabric.fields,
          RealStock: newStock,
        });
      });

      return Promise.all(promises);
    },
    onSuccess: (results) => {
      const successCount = results.filter((r) => r !== null).length;
      if (successCount > 0) {
        toast.success(`${successCount} fabric stock(s) updated ✅`);
        queryClient.invalidateQueries({ queryKey: ["fabrics"] });
      }
    },
    onError: (error) => {
      console.error("Failed to update fabric stock:", error);
      toast.error("Failed to update fabric stock");
    },
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

  const handleOrderConfirmation = () => {
    if (completedSteps.length !== steps.length - 1) {
      toast.error("Complete all the steps to confirm order!!");
      return;
    }
    // check address for home delivery
    const isAddressDefined = Object.values(
      demographicsForm.getValues().address
    ).every((value) => value !== undefined && value.trim() != "");
    if (
      OrderForm.getValues().orderType === "homeDelivery" &&
      !isAddressDefined
    ) {
      toast.error("Need address for home delivery");
      return;
    }
    const currentStore = useCurrentWorkOrderStore.getState();
    console.log("🧾 Full Work Order Store:", currentStore);

    console.log(OrderForm.getValues());
    const formOrder: Partial<OrderSchema> = {
      ...OrderForm.getValues(),
      ...paymentForm.getValues(),
      orderStatus: "Completed",
      orderDate: new Date().toISOString(),
      // ensure customerID is an array if we have a record id
      // customerID: demographicsForm.getValues("customerRecordId")
      //   ? [demographicsForm.getValues("customerRecordId") as string]
      //   : undefined,

      // number of fabrics from fabric selection form
      numOfFabrics:
        fabricSelectionForm.getValues()?.fabricSelections?.length ?? undefined,
    };

    OrderForm.setValue("orderStatus", "Completed")
    setOrder(formOrder);

    if (orderId) {
      updateOrderFn({ fields: formOrder, orderId: orderId, onSuccessAction: "updated" });
    }

    // update stocks
    updateShelfFn(ShelvesForm.getValues());
    // updateFabricStock();

    const fabricSelectionsData = fabricSelectionForm.getValues().fabricSelections;
    if (fabricSelectionsData && fabricSelectionsData.length > 0) {
      updateFabricStockFn(fabricSelectionsData);
    }

    handleProceed(5);
  };


  const handleOrderCancellation = () => {
    const formOrder: Partial<OrderSchema> = {
      ...OrderForm.getValues(),
      ...paymentForm.getValues(),
      orderDate: new Date().toISOString(),
      orderStatus: "Cancelled",
      // ensure customerID is an array if we have a record id
      // customerID: demographicsForm.getValues("customerRecordId")
      //   ? [demographicsForm.getValues("customerRecordId") as string]
      //   : undefined,

      // number of fabrics from fabric selection form
      numOfFabrics:
        fabricSelectionForm.getValues()?.fabricSelections?.length ?? undefined,
    };

    OrderForm.setValue("orderStatus", "Cancelled")
    setOrder(formOrder);

    if (orderId) {
      updateOrderFn({ fields: formOrder, orderId: orderId, onSuccessAction: "cancelled" });
    }
  };

  // ----------------------------
  // MAIN RENDER
  // ----------------------------
  return (
    <div className="mb-64">
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
        <div className="w-fit absolute right-2.5 flex justify-end mt-2 ">
          <div className="bg-card p-4 shadow-lg rounded-lg z-10 border-b border-border max-w-xs mr-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Work Order #{order.orderID}
            </h2>
            <p className="text-sm text-muted-foreground">
              Status:{" "}
              <span className="font-medium text-green-600">
                {order.orderStatus ?? "Pending"}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Customer:{" "}
              <span className="font-medium">
                {order.customerID?.length
                  ? customerDemographics.nickName
                  : "No customer yet"}
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* Make space so sticky header does not overlap content */}
      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center space-y-10 py-10 mx-[10%]">
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
                isOrderClosed={isOrderClosed}
                onEdit={() => removeSavedStep(0)}
                onCancel={() => addSavedStep(0)}
                onProceed={() => {
                  const recordID =
                    demographicsForm.getValues("customerRecordId");
                  if (orderId && recordID) {
                    updateOrderFn({
                      fields: {
                        customerID: [recordID],
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
              <ErrorBoundary
                fallback={<div>Customer Measurements crashed</div>}
              >
                <CustomerMeasurementsForm
                  form={measurementsForm}
                  isOrderClosed={isOrderClosed}
                  customerId={customerDemographics.id?.toString() || null}
                  customerRecordId={customerDemographics.customerRecordId}
                  onProceed={() => handleProceed(1)}
                />
              </ErrorBoundary>
            )}

            {index === 2 && (
              <ErrorBoundary fallback={<div>Fabric Selection crashed</div>}>
                <FabricSelectionForm
                  customerId={customerDemographics.id?.toString() || null}
                  form={fabricSelectionForm}
                  isOrderClosed={isOrderClosed}
                  onEdit={() => removeSavedStep(2)}
                  onSubmit={handleFabricSelectionSubmit}
                  onProceed={() => handleProceed(2)}
                  orderId={order.orderID || null}
                  orderRecordId={orderId}
                  onCampaignsChange={(campaigns) => {
                    if (orderId) {
                      OrderForm.setValue("campaigns", campaigns);
                    }
                  }}
                  isProceedDisabled={fabricSelections.length === 0}
                />
              </ErrorBoundary>
            )}

            {index === 3 && (
              <ErrorBoundary fallback={<div>Shelved Products crashed</div>}>
                <ShelvedProductsForm
                  form={ShelvesForm}
                  isOrderClosed={isOrderClosed}
                  onProceed={() => {
                    handleProceed(3);
                  }}
                />
              </ErrorBoundary>
            )}

            {index === 4 && (
              <ErrorBoundary fallback={<div>Order and Payment crashed</div>}>
                <OrderTypeAndPaymentForm
                  form={OrderForm}
                  onSubmit={(data) => {
                    setOrder(data);
                  }}
                  onProceed={() => handleProceed(4)}
                />
              </ErrorBoundary>
            )}

            {index === 5 && (
              <ErrorBoundary fallback={<div>Payment crashed</div>}>
                <PaymentTypeForm
                  form={paymentForm}
                  isOrderClosed={isOrderClosed}
                  onConfirm={() => {

                    setConfirmationDialog({
                      isOpen: true,
                      title: "Confirm new work order",
                      description: "Do you want to confirm a new work order?",
                      onConfirm: () => {
                        handleOrderConfirmation();
                        setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                  onCancel={() => {

                    setConfirmationDialog({
                      isOpen: true,
                      title: "Cancel new work order",
                      description: "Do you want to cancel a new work order?",
                      onConfirm: () => {
                        handleOrderCancellation();
                        setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                />
              </ErrorBoundary>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
