// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Loader2, Truck, PackageCheck, CheckCircle2 } from "lucide-react";

// export function DistributorOrders() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<string | null>(null);

//   function getAuthToken() {
//     try {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("auth-token");
//         if (token) return token;
//       }
//       if (typeof document !== "undefined") {
//         const cookie = document.cookie
//           .split(";")
//           .find((c) => c.trim().startsWith("auth-token="));
//         if (cookie) return cookie.split("=")[1];
//       }
//     } catch {}
//     return null;
//   }

//   async function loadOrders() {
//     try {
//       setLoading(true);
//       const token = getAuthToken();
//       const res = await fetch("/api/manufacturer/distributor-orders", {
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         credentials: "include",
//       });

//       const data = await res.json();
//       setOrders(Array.isArray(data.orders) ? data.orders : []);
//     } catch (err) {
//       console.error("Distributor orders load error:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function updateStatus(orderId: string, newStatus: string) {
//     try {
//       setUpdating(orderId);
//       const token = getAuthToken();
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || "Failed to update order");
//       }

//       await loadOrders();
//     } catch (err) {
//       console.error("Order status update error:", err);
//       alert("Failed to update order status.");
//     } finally {
//       setUpdating(null);
//     }
//   }

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "secondary";
//       case "confirmed":
//         return "default";
//       case "shipped":
//         return "outline";
//       case "delivered":
//         return "default";
//       case "cancelled":
//         return "destructive";
//       default:
//         return "secondary";
//     }
//   };

//   const getNextActions = (status: string) => {
//     switch (status) {
//       case "pending":
//         return ["confirmed"];
//       case "confirmed":
//         return ["shipped"];
//       case "shipped":
//         return ["delivered"];
//       default:
//         return [];
//     }
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="text-center py-8 text-muted-foreground">
//           <Loader2 className="h-5 w-5 mx-auto animate-spin mb-2" />
//           Loading distributor orders…
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-serif font-bold">Distributor Orders</h2>

//       {orders.length === 0 ? (
//         <Card>
//           <CardContent className="text-center py-8 text-muted-foreground">
//             No distributor orders found.
//           </CardContent>
//         </Card>
//       ) : (
//         orders.map((order) => (
//           <Card key={String(order._id)} className="border shadow-sm">
//             <CardHeader className="flex justify-between items-start">
//               <div>
//                 <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
//                 <p className="text-muted-foreground">
//                   Buyer: {order.buyerName} ({order.buyerRole})
//                 </p>
//               </div>
//               <Badge variant={getStatusColor(order.status)} className="capitalize">
//                 {order.status}
//               </Badge>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Product</p>
//                   <p className="font-medium">{order.productName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Quantity</p>
//                   <p className="font-medium">
//                     {order.quantity} {order.unit}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 {getNextActions(order.status).map((action) => (
//                   <Button
//                     key={action}
//                     onClick={() => updateStatus(order._id, action)}
//                     disabled={updating === order._id}
//                     variant="outline"
//                     size="sm"
//                   >
//                     {updating === order._id ? (
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     ) : action === "confirmed" ? (
//                       <PackageCheck className="h-4 w-4 mr-2" />
//                     ) : action === "shipped" ? (
//                       <Truck className="h-4 w-4 mr-2" />
//                     ) : (
//                       <CheckCircle2 className="h-4 w-4 mr-2" />
//                     )}
//                     {action.charAt(0).toUpperCase() + action.slice(1)}
//                   </Button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Loader2, Truck, PackageCheck, CheckCircle2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// export function DistributorOrders() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState<string | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [pricePerUnit, setPricePerUnit] = useState("");
//   const { toast } = useToast();

//   function getAuthToken() {
//     try {
//       if (typeof window !== "undefined") {
//         const token = localStorage.getItem("auth-token");
//         if (token) return token;
//       }
//       if (typeof document !== "undefined") {
//         const cookie = document.cookie
//           .split(";")
//           .find((c) => c.trim().startsWith("auth-token="));
//         if (cookie) return cookie.split("=")[1];
//       }
//     } catch {}
//     return null;
//   }

//   async function loadOrders() {
//     try {
//       setLoading(true);
//       const token = getAuthToken();
//       const res = await fetch("/api/manufacturer/distributor-orders", {
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         credentials: "include",
//       });

//       const data = await res.json();
//       setOrders(Array.isArray(data.orders) ? data.orders : []);
//     } catch (err) {
//       console.error("Distributor orders load error:", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function updateStatus(orderId: string, newStatus: string, price?: number) {
//     try {
//       setUpdating(orderId);
//       const token = getAuthToken();
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({
//           status: newStatus,
//           ...(price ? { pricePerUnit: price } : {}),
//         }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || "Failed to update order");
//       }

//       await loadOrders();
//       toast({ title: "✅ Order updated successfully" });
//     } catch (err) {
//       console.error("Order status update error:", err);
//       toast({
//         title: "Error updating order",
//         description: (err as Error).message,
//         variant: "destructive",
//       });
//     } finally {
//       setUpdating(null);
//       setSelectedOrder(null);
//       setPricePerUnit("");
//     }
//   }

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "secondary";
//       case "confirmed":
//         return "default";
//       case "shipped":
//         return "outline";
//       case "delivered":
//         return "default";
//       case "cancelled":
//         return "destructive";
//       default:
//         return "secondary";
//     }
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="text-center py-8 text-muted-foreground">
//           <Loader2 className="h-5 w-5 mx-auto animate-spin mb-2" />
//           Loading distributor orders…
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-serif font-bold">Distributor Orders</h2>

//       {orders.length === 0 ? (
//         <Card>
//           <CardContent className="text-center py-8 text-muted-foreground">
//             No distributor orders found.
//           </CardContent>
//         </Card>
//       ) : (
//         orders.map((order) => (
//           <Card key={String(order._id)} className="border shadow-sm">
//             <CardHeader className="flex justify-between items-start">
//               <div>
//                 <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
//                 <p className="text-muted-foreground">
//                   Buyer: {order.buyerName} ({order.buyerRole})
//                 </p>
//               </div>
//               <Badge variant={getStatusColor(order.status)} className="capitalize">
//                 {order.status}
//               </Badge>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Product</p>
//                   <p className="font-medium">{order.productName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Quantity</p>
//                   <p className="font-medium">
//                     {order.quantity} {order.unit}
//                   </p>
//                 </div>
//               </div>

//               {/* ✅ Modal for setting price when shipping */}
//               {order.status === "confirmed" ? (
//                 <Dialog
//                   open={selectedOrder?._id === order._id}
//                   onOpenChange={(open) =>
//                     open ? setSelectedOrder(order) : setSelectedOrder(null)
//                   }
//                 >
//                   <DialogTrigger asChild>
//                     <Button size="sm" variant="outline">
//                       🚚 Ship Order
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Set Selling Price (₹ per unit)</DialogTitle>
//                     </DialogHeader>
//                     <Input
//                       type="number"
//                       placeholder="Enter price per unit"
//                       value={pricePerUnit}
//                       onChange={(e) => setPricePerUnit(e.target.value)}
//                       className="mt-4"
//                     />
//                     <DialogFooter className="mt-4">
//                       <Button
//                         onClick={() =>
//                           updateStatus(order._id, "shipped", Number(pricePerUnit))
//                         }
//                         disabled={!pricePerUnit || updating === order._id}
//                       >
//                         {updating === order._id ? (
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         ) : (
//                           <Truck className="h-4 w-4 mr-2" />
//                         )}
//                         Confirm & Ship
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               ) : (
//                 <div className="flex gap-2">
//                   {order.status === "shipped" && (
//                     <Button
//                       onClick={() => updateStatus(order._id, "delivered")}
//                       disabled={updating === order._id}
//                       variant="outline"
//                       size="sm"
//                     >
//                       {updating === order._id ? (
//                         <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       ) : (
//                         <CheckCircle2 className="h-4 w-4 mr-2" />
//                       )}
//                       Mark Delivered
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Truck, PackageCheck, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DistributorOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const { toast } = useToast();

  function getAuthToken() {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth-token");
        if (token) return token;
      }
      if (typeof document !== "undefined") {
        const cookie = document.cookie
          .split(";")
          .find((c) => c.trim().startsWith("auth-token="));
        if (cookie) return cookie.split("=")[1];
      }
    } catch {}
    return null;
  }

  async function loadOrders() {
    try {
      setLoading(true);
      const token = getAuthToken();
      const res = await fetch("/api/manufacturer/distributor-orders", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Distributor orders load error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, newStatus: string, price?: number) {
    try {
      setUpdating(orderId);
      const token = getAuthToken();
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          ...(price ? { pricePerUnit: price } : {}),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update order");
      }

      await loadOrders();
      toast({ title: "✅ Order updated successfully" });
    } catch (err) {
      console.error("Order status update error:", err);
      toast({
        title: "Error updating order",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
      setSelectedOrder(null);
      setPricePerUnit("");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "shipped":
        return "outline";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 mx-auto animate-spin mb-2" />
          Loading distributor orders…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Distributor Orders</h2>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            No distributor orders found.
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={String(order._id)} className="border shadow-sm">
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                <p className="text-muted-foreground">
                  Buyer: {order.buyerName} ({order.buyerRole})
                </p>
              </div>
              <Badge variant={getStatusColor(order.status)} className="capitalize">
                {order.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{order.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">
                    {order.quantity} {order.unit}
                  </p>
                </div>
              </div>

              {/* ✅ Confirm pending orders */}
              {order.status === "pending" && (
                <Button
                  onClick={() => updateStatus(order._id, "confirmed")}
                  disabled={updating === order._id}
                  variant="outline"
                  size="sm"
                >
                  {updating === order._id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <PackageCheck className="h-4 w-4 mr-2" />
                  )}
                  Confirm Order
                </Button>
              )}

              {/* ✅ Ship with Price Modal */}
              {order.status === "confirmed" && (
                <Dialog
                  open={selectedOrder?._id === order._id}
                  onOpenChange={(open) =>
                    open ? setSelectedOrder(order) : setSelectedOrder(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      🚚 Ship Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Selling Price (₹ per unit)</DialogTitle>
                    </DialogHeader>
                    <Input
                      type="number"
                      placeholder="Enter price per unit"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      className="mt-4"
                    />
                    <DialogFooter className="mt-4">
                      <Button
                        onClick={() =>
                          updateStatus(order._id, "shipped", Number(pricePerUnit))
                        }
                        disabled={!pricePerUnit || updating === order._id}
                      >
                        {updating === order._id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Truck className="h-4 w-4 mr-2" />
                        )}
                        Confirm & Ship
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* ✅ Mark Delivered */}
              {order.status === "shipped" && (
                <Button
                  onClick={() => updateStatus(order._id, "delivered")}
                  disabled={updating === order._id}
                  variant="outline"
                  size="sm"
                >
                  {updating === order._id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Mark Delivered
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
