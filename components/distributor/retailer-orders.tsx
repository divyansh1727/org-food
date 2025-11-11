// "use client"
// import { useEffect, useState } from "react"

// interface Order {
//   _id: string
//   orderNumber: string
//   productName: string
//   quantity: number
//   status: string
// }

// export default function RetailerOrders() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         // ✅ only retailer->distributor orders
//         const res = await fetch("/api/distributor/orders")
//         const data = await res.json()
//         setOrders(Array.isArray(data.orders) ? data.orders : [])
//       } catch (e) {
//         console.error("Distributor retailer orders fetch error:", e)
//         setOrders([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchOrders()
//   }, [])

//   return (
//     <div className="bg-white rounded shadow p-6">
//       <h2 className="text-xl font-semibold mb-4">Orders</h2>
//       <table className="w-full text-left">
//         <thead>
//           <tr className="border-b">
//             <th className="py-2">Order #</th>
//             <th className="py-2">Product</th>
//             <th className="py-2">Quantity</th>
//             <th className="py-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr><td colSpan={4} className="py-4 text-center">Loading…</td></tr>
//           ) : orders.length === 0 ? (
//             <tr><td colSpan={4} className="py-4 text-center text-gray-500">No orders found</td></tr>
//           ) : (
//             orders.map((o) => (
//               <tr key={o._id} className="border-b hover:bg-gray-50">
//                 <td className="py-2">{o.orderNumber}</td>
//                 <td className="py-2">{o.productName}</td>
//                 <td className="py-2">{o.quantity}</td>
//                 <td className="py-2">{o.status}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   )
// }
// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Loader2, Truck, CheckCircle, XCircle } from "lucide-react"

// interface Order {
//   _id: string
//   orderNumber: string
//   productName: string
//   quantity: number
//   unit?: string
//   buyerName: string
//   status: string
// }

// /**
//  * Distributor → Retailer Orders
//  * Distributors can view retailer orders and mark them as "Shipped"
//  */
// export default function RetailerOrders() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [processingId, setProcessingId] = useState<string | null>(null)

//   // ✅ Fetch distributor → retailer orders
//   async function fetchOrders() {
//     try {
//       setLoading(true)
//       const res = await fetch("/api/orders")
//       const data = await res.json()

//       if (res.ok && Array.isArray(data.orders)) {
//         const filtered = data.orders.filter(
//           (o: any) => o.sellerRole === "distributor" && o.buyerRole === "retailer"
//         )
//         setOrders(filtered)
//       } else {
//         setOrders([])
//       }
//     } catch (error) {
//       console.error("❌ Error fetching distributor-retailer orders:", error)
//       setOrders([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//     // Optional: auto-refresh every 30 seconds
//     const interval = setInterval(fetchOrders, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   // ✅ Handle "Ship Order"
//   async function handleShip(orderId: string) {
//     try {
//       setProcessingId(orderId)
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "shipped" }),
//       })

//       const data = await res.json()
//       if (res.ok) {
//         alert("✅ Order marked as shipped!")
//         fetchOrders()
//       } else {
//         alert(`❌ Failed: ${data.error || "Something went wrong"}`)
//       }
//     } catch (error) {
//       console.error("Error shipping order:", error)
//       alert("⚠️ Something went wrong while shipping the order.")
//     } finally {
//       setProcessingId(null)
//     }
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold mb-5 text-emerald-800">
//         Retailer Orders
//       </h2>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b bg-gray-50 text-gray-700">
//               <th className="py-3 px-4">Order #</th>
//               <th className="py-3 px-4">Retailer</th>
//               <th className="py-3 px-4">Product</th>
//               <th className="py-3 px-4">Quantity</th>
//               <th className="py-3 px-4">Status</th>
//               <th className="py-3 px-4 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="py-6 text-center text-gray-500">
//                   <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
//                   Loading orders...
//                 </td>
//               </tr>
//             ) : orders.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="py-6 text-center text-gray-500 italic"
//                 >
//                   No orders found.
//                 </td>
//               </tr>
//             ) : (
//               orders.map((o) => (
//                 <tr
//                   key={o._id}
//                   className="border-b hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="py-3 px-4">{o.orderNumber}</td>
//                   <td className="py-3 px-4">{o.buyerName}</td>
//                   <td className="py-3 px-4">{o.productName}</td>
//                   <td className="py-3 px-4">
//                     {o.quantity} {o.unit || ""}
//                   </td>
//                   <td className="py-3 px-4">
//                     <span
//                       className={`font-medium ${
//                         o.status === "pending"
//                           ? "text-yellow-600"
//                           : o.status === "shipped"
//                           ? "text-blue-600"
//                           : o.status === "delivered"
//                           ? "text-green-600"
//                           : o.status === "cancelled"
//                           ? "text-red-600"
//                           : "text-gray-600"
//                       }`}
//                     >
//                       {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-center">
//                     {o.status === "pending" || o.status === "confirmed" ? (
//                       <Button
//                         onClick={() => handleShip(o._id)}
//                         className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm flex items-center gap-2 px-3 py-1"
//                         disabled={processingId === o._id}
//                       >
//                         {processingId === o._id ? (
//                           <>
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                             Shipping...
//                           </>
//                         ) : (
//                           <>
//                             <Truck className="w-4 h-4" />
//                             Ship
//                           </>
//                         )}
//                       </Button>
//                     ) : o.status === "shipped" ? (
//                       <span className="text-blue-600 flex items-center justify-center gap-1">
//                         <CheckCircle className="w-4 h-4" />
//                         Shipped
//                       </span>
//                     ) : o.status === "delivered" ? (
//                       <span className="text-green-600 flex items-center justify-center gap-1">
//                         <CheckCircle className="w-4 h-4" />
//                         Delivered
//                       </span>
//                     ) : o.status === "cancelled" ? (
//                       <span className="text-red-600 flex items-center justify-center gap-1">
//                         <XCircle className="w-4 h-4" />
//                         Cancelled
//                       </span>
//                     ) : (
//                       "-"
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
"use client";

import { useEffect, useState } from "react";
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
import { Loader2, Truck, CheckCircle, XCircle, PackageCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  _id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  unit?: string;
  buyerName: string;
  status: string;
}

export default function RetailerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const { toast } = useToast();

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/distributor/orders");
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        const filtered = data.filter(
          (o: any) => o.sellerRole === "distributor" && o.buyerRole === "retailer"
        );
        setOrders(filtered);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Error fetching distributor-retailer orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(orderId: string, status: string, price?: number) {
    try {
      setProcessingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(price ? { pricePerUnit: price } : {}),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "✅ Order updated successfully!" });
        fetchOrders();
      } else {
        toast({
          title: "❌ Failed to update order",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "⚠️ Network error",
        description: "Could not update order.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
      setSelectedOrder(null);
      setPricePerUnit("");
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-blue-600";
      case "shipped":
        return "text-indigo-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-5 text-emerald-800">
        Retailer Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-700">
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Retailer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500 italic">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{o.orderNumber}</td>
                  <td className="py-3 px-4">{o.buyerName}</td>
                  <td className="py-3 px-4">{o.productName}</td>
                  <td className="py-3 px-4">
                    {o.quantity} {o.unit || ""}
                  </td>
                  <td className={`py-3 px-4 font-medium ${getStatusColor(o.status)}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {/* Confirm pending order */}
                    {o.status === "pending" && (
                      <Button
                        onClick={() => updateStatus(o._id, "confirmed")}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2 px-3 py-1"
                        disabled={processingId === o._id}
                      >
                        {processingId === o._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <PackageCheck className="w-4 h-4" />
                        )}
                        Confirm
                      </Button>
                    )}

                    {/* Ship order with price */}
                    {o.status === "confirmed" && (
                      <Dialog
                        open={selectedOrder?._id === o._id}
                        onOpenChange={(open) =>
                          open ? setSelectedOrder(o) : setSelectedOrder(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm"
                            size="sm"
                          >
                            <Truck className="w-4 h-4 mr-1" /> Ship
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
                                updateStatus(o._id, "shipped", Number(pricePerUnit))
                              }
                              disabled={!pricePerUnit || processingId === o._id}
                            >
                              {processingId === o._id ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Truck className="w-4 h-4 mr-2" />
                              )}
                              Confirm & Ship
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Mark as Delivered */}
                    {o.status === "shipped" && (
                      <Button
                        onClick={() => updateStatus(o._id, "delivered")}
                        className="bg-green-700 hover:bg-green-800 text-white text-sm"
                        disabled={processingId === o._id}
                      >
                        {processingId === o._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Delivered
                      </Button>
                    )}

                    {["delivered", "cancelled"].includes(o.status) && (
                      <span
                        className={`flex items-center justify-center gap-1 ${
                          o.status === "delivered"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {o.status === "delivered" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
