import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Package,
  RefreshCw,
  CheckCircle2,
  Calendar,
  User,
  Scissors,
  ArrowRight,
  ChevronLeft,
  LayoutGrid,
  AlertCircle,
  Phone,
  CreditCard,
  Hash,
  Clock,
  Briefcase,
  FileText,
  Ruler,
  Palette
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ErrorBoundary } from "@/components/global/error-boundary";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// API and Types
import { getOrdersList, getOrderDetails } from "@/api/ordersApi"; 
import type { OrderDetails } from "@/api/ordersApi"; 
import type { Garment } from "@/types/garment";
import { FatouraStage, PieceStage } from "@/types/stages";

export const Route = createFileRoute(
  "/$main/orders/order-management/receiving-brova-final"
)({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Receiving Brova / Final" }],
  }),
});

// --- Configuration ---

const TARGET_ORDER_KEYS: (keyof typeof FatouraStage)[] = [
  "BrovaAtShop",
  "FinalAtShop",
];

const TARGET_GARMENT_KEYS: (keyof typeof PieceStage)[] = [
  "BrovaAtShop",
  "ConfirmedBrovaAtShop",
];

// --- Helpers ---

const getOrderStageLabel = (key: string | undefined) => {
  if (!key) return "Unknown Stage";
  return FatouraStage[key as keyof typeof FatouraStage] || key;
};

const getGarmentStageLabel = (key: string | undefined) => {
  if (!key) return "Unknown Stage";
  return PieceStage[key as keyof typeof PieceStage] || key;
};

// --- Animations ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- Sub-Components ---

const PageSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="h-10 w-28" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

/**
 * New Component: Displays garments in a detailed table row format
 */
const GarmentListTable = ({ garments }: { garments: Garment[] }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[100px]">Garment ID</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Fabric Details</TableHead>
            <TableHead>Style Config</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {garments.map((garment) => (
            <TableRow key={garment.id} className="hover:bg-muted/5 transition-colors">
              <TableCell className="font-medium font-mono text-xs">
                {garment.fields.GarmentId || "N/A"}
              </TableCell>
              <TableCell>
                <div className="font-semibold text-gray-800">
                  {garment.fields.Style || "Unknown"}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Palette className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium">{garment.fields.Color || "No Color"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Ruler className="w-3 h-3 text-muted-foreground" />
                    <span>{garment.fields.FabricLength}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[250px]">
                  {/* Display detailed style options if they exist */}
                  <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-gray-50">
                    Collar: {garment.fields.CollarType || "-"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-gray-50">
                    Cuffs: {garment.fields.CuffsType || "-"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground bg-gray-50">
                    Pocket: {garment.fields.FrontPocketType || "-"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs font-medium whitespace-nowrap">
                  {getGarmentStageLabel(garment.fields.PieceStages as string)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {garment.fields.Note ? (
                  <div className="flex justify-end group relative">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span className="sr-only">{garment.fields.Note}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="p-2 rounded-full bg-muted text-muted-foreground">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value || "N/A"}</p>
    </div>
  </div>
);

// --- Detailed View Component ---

const OrderDetailsView = ({ 
  initialData, 
  onBack 
}: { 
  initialData: OrderDetails; 
  onBack: () => void 
}) => {
  const orderIdValue = initialData.order.fields.OrderID?.toString() || "";

  const { 
    data: response, 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ["orderDetails", orderIdValue],
    queryFn: () => getOrderDetails(orderIdValue),
    enabled: !!orderIdValue,
    initialData: { status: "success", data: initialData, message: "Initial" }
  });

  const details = response?.data;
  const order = details?.order;
  const customer = details?.customer;
  const garments = details?.garments || [];

  const filteredGarments = garments.filter((g) => {
    const stageKey = g.fields.PieceStages as keyof typeof PieceStage; 
    return stageKey && TARGET_GARMENT_KEYS.includes(stageKey);
  });

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8 pb-10"
    >
      {/* 1. Top Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="h-9 w-9 shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Order #{order.fields.Fatoura}
              <Badge variant="outline" className="ml-2 font-normal text-sm py-0.5">
                {order.fields.OrderType || "WORK"}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              Created on {order.fields.OrderDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Badge className="text-sm px-3 py-1.5 h-8">
              {getOrderStageLabel(order.fields.FatouraStages)}
           </Badge>
          <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isLoading} className="h-8">
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Separator />

      {/* 2. Info Cards Section (Top) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Customer Details Card */}
        <Card className="shadow-sm border-l-4 border-l-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
             <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {customer?.fields.Name?.charAt(0) || "G"}
                  </AvatarFallback>
                </Avatar>
                <div>
                   <p className="text-lg font-bold leading-none">{customer?.fields.Name || "Guest Customer"}</p>
                   <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {customer?.fields.id || "N/A"}</p>
                </div>
             </div>
             <Separator className="mb-3" />
             <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                   <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                   <span>{customer?.fields.Phone || "No phone linked"}</span>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Order Details Card */}
        <Card className="shadow-sm">
           <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Order Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
             <InfoItem icon={Hash} label="Order ID" value={order.fields.OrderID?.toString()} />
             <InfoItem icon={CreditCard} label="Payment" value={order.fields.PaymentType} />
             <InfoItem icon={Package} label="Fabrics" value={order.fields.NumOfFabrics?.toString()} />
             <InfoItem icon={Clock} label="Delivery" value={order.fields.DeliveryDate} />
          </CardContent>
        </Card>

        {/* Status / Summary Card */}
        <Card className="shadow-sm bg-muted/20 border-dashed">
           <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Production Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center h-[calc(100%-3rem)] pb-6">
             <div className="text-4xl font-bold text-primary">{filteredGarments.length}</div>
             <p className="text-sm text-muted-foreground font-medium mt-1">Items at Shop</p>
             <div className="text-xs text-muted-foreground mt-2 bg-background px-2 py-1 rounded border">
                Total in Order: {garments.length}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Production Items (Bottom, Full Width Table) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              Production Items
            </h3>
            <p className="text-sm text-muted-foreground">
              Detailed list of garments currently in <strong>Brova</strong> or <strong>Final</strong> stages.
            </p>
          </div>
        </div>

        {isLoading ? (
           <div className="space-y-2">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-20 w-full" />
           </div>
        ) : isError ? (
          <div className="p-12 border border-destructive/20 bg-destructive/5 rounded-xl text-center text-destructive flex flex-col items-center">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="font-medium">Failed to load garment details.</p>
            <Button variant="link" onClick={() => refetch()} className="text-destructive mt-2">Try Again</Button>
          </div>
        ) : filteredGarments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-muted/10 border-2 border-dashed border-muted rounded-xl">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
               <Package className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-lg font-medium text-foreground">No matching items found</p>
            <p className="text-sm text-muted-foreground max-w-sm text-center mt-1">
              There are {garments.length} total garments in this order, but none match the "At Shop" filter criteria.
            </p>
          </div>
        ) : (
          /* Replaced Grid with Table */
          <GarmentListTable garments={filteredGarments} />
        )}
      </div>
    </motion.div>
  );
};

// --- List Item Component ---

const OrderCard = ({ 
  details, 
  onClick 
}: { 
  details: OrderDetails; 
  onClick: () => void 
}) => {
  const { order, customer } = details;

  return (
    <motion.div variants={itemVariants}>
      <Card 
        className="h-full flex flex-col transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer group relative overflow-hidden bg-card"
        onClick={onClick}
      >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>

        <CardHeader className="pb-3 bg-muted/20 border-b border-border">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2.5 bg-background rounded-xl border shadow-sm">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <CardTitle className="text-lg font-bold text-foreground truncate">
                  #{order.fields.Fatoura || "N/A"}
                </CardTitle>
                <div className="flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground truncate font-medium">
                    {customer?.fields.Name || "Guest"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
              <Calendar className="w-3.5 h-3.5" />
              <span className="truncate">{order.fields.OrderDate || "No Date"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
              <Scissors className="w-3.5 h-3.5" />
              <span>{order.fields.NumOfFabrics || 0} Items</span>
            </div>
          </div>

          <div className="mt-auto pt-2">
            <Badge variant="secondary" className="w-full justify-center py-1.5 font-medium">
              {getOrderStageLabel(order.fields.FatouraStages)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// --- Main Route Component ---

function RouteComponent() {
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const queryClient = useQueryClient();

  const {
    data: ordersList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders", "receiving-brova-final", TARGET_ORDER_KEYS],
    queryFn: async () => {
      const requests = TARGET_ORDER_KEYS.map((stageKey) => 
        getOrdersList({ FatouraStages: stageKey })
      );

      const responses = await Promise.all(requests);
      
      const allOrderDetails = responses.flatMap((res) => {
        return Array.isArray(res.data) ? res.data : [];
      });
      
      const uniqueOrdersMap = new Map();
      allOrderDetails.forEach(detail => {
        if (detail.order?.id) {
          uniqueOrdersMap.set(detail.order.id, detail);
        }
      });
      
      return Array.from(uniqueOrdersMap.values()) as OrderDetails[];
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 md:p-10 max-w-[1600px]">
        <PageSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 md:p-10 max-w-[1600px]">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1 space-y-1">
                  <p className="font-semibold text-destructive text-lg">Error loading orders</p>
                  <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
              </div>
              <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary showDetails={true}>
      <div className="container mx-auto p-6 md:p-10 max-w-[1600px]">
        {selectedOrder ? (
          <OrderDetailsView 
            initialData={selectedOrder} 
            onBack={() => setSelectedOrder(null)} 
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Receiving Brova / Final
                </h1>
                <p className="text-sm text-muted-foreground">
                  View and manage {ordersList?.length || 0} order{(ordersList?.length || 0) !== 1 ? "s" : ""} currently at the shop
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["orders", "receiving-brova-final"] })}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {!ordersList || ordersList.length === 0 ? (
                <div className="col-span-full">
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                           <CheckCircle2 className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">All caught up!</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                          No active orders found in Brova or Final stages.
                        </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                ordersList.map((details) => (
                  <OrderCard
                    key={details.order.id}
                    details={details}
                    onClick={() => setSelectedOrder(details)}
                  />
                ))
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}