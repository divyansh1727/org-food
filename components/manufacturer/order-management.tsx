"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, Truck, Package, AlertCircle } from "lucide-react"

export function OrderManagement() {
  // ✅ default to empty array
  const [orders, setOrders] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />
      case "confirmed": return <CheckCircle className="h-4 w-4" />
      case "shipped": return <Truck className="h-4 w-4" />
      case "delivered": return <Package className="h-4 w-4" />
      case "cancelled": return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary"
      case "confirmed": return "default"
      case "shipped": return "outline"
      case "delivered": return "default"
      case "cancelled": return "destructive"
      default: return "secondary"
    }
  }

  // ✅ always have a safe array
  const safeOrders = Array.isArray(orders) ? orders : []
  const filteredOrders = statusFilter === "all"
    ? safeOrders
    : safeOrders.filter((o) => o.status === statusFilter)

  const orderStats = {
    total: safeOrders.length,
    pending: safeOrders.filter(o => o.status === "pending").length,
    confirmed: safeOrders.filter(o => o.status === "confirmed").length,
    shipped: safeOrders.filter(o => o.status === "shipped").length,
    delivered: safeOrders.filter(o => o.status === "delivered").length,
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold">Order Management</h2>
          <p className="text-muted-foreground">Track your raw material orders and deliveries</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders ({orderStats.total})</SelectItem>
            <SelectItem value="pending">Pending ({orderStats.pending})</SelectItem>
            <SelectItem value="confirmed">Confirmed ({orderStats.confirmed})</SelectItem>
            <SelectItem value="shipped">Shipped ({orderStats.shipped})</SelectItem>
            <SelectItem value="delivered">Delivered ({orderStats.delivered})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries({
          "Total Orders": orderStats.total,
          Pending: orderStats.pending,
          Confirmed: orderStats.confirmed,
          Shipped: orderStats.shipped,
          Delivered: orderStats.delivered
        }).map(([label, count], i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map(order => (
          <Card key={order._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <p className="text-muted-foreground">{order.sellerName}</p>
                </div>
                <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{order.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{order.quantity} {order.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="font-medium">₹{order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No orders found for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { CheckCircle, Clock, Truck, Package, AlertCircle } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// export function OrderManagement() {
//   const [orders, setOrders] = useState<any[]>([])
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [loading, setLoading] = useState(true)
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
//   const [pricePerUnit, setPricePerUnit] = useState("")
//   const { toast } = useToast()

//   // ✅ Fetch orders
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const res = await fetch("/api/orders", { credentials: "include" })
//         const data = await res.json()
//         setOrders(Array.isArray(data.orders) ? data.orders : [])
//       } catch (err) {
//         console.error("Failed to fetch orders:", err)
//         setOrders([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchOrders()
//   }, [])

//   const refreshOrders = async () => {
//     try {
//       const res = await fetch("/api/orders", { credentials: "include" })
//       const data = await res.json()
//       setOrders(Array.isArray(data.orders) ? data.orders : [])
//     } catch (err) {
//       console.error("Failed to refresh orders:", err)
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pending": return <Clock className="h-4 w-4" />
//       case "confirmed": return <CheckCircle className="h-4 w-4" />
//       case "shipped": return <Truck className="h-4 w-4" />
//       case "delivered": return <Package className="h-4 w-4" />
//       case "cancelled": return <AlertCircle className="h-4 w-4" />
//       default: return <Clock className="h-4 w-4" />
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending": return "secondary"
//       case "confirmed": return "default"
//       case "shipped": return "outline"
//       case "delivered": return "default"
//       case "cancelled": return "destructive"
//       default: return "secondary"
//     }
//   }

//   const safeOrders = Array.isArray(orders) ? orders : []
//   const filteredOrders =
//     statusFilter === "all"
//       ? safeOrders
//       : safeOrders.filter((o) => o.status === statusFilter)

//   const orderStats = {
//     total: safeOrders.length,
//     pending: safeOrders.filter((o) => o.status === "pending").length,
//     confirmed: safeOrders.filter((o) => o.status === "confirmed").length,
//     shipped: safeOrders.filter((o) => o.status === "shipped").length,
//     delivered: safeOrders.filter((o) => o.status === "delivered").length,
//   }

//   const handleShipOrder = async (orderId: string) => {
//     try {
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           status: "shipped",
//           pricePerUnit: Number(pricePerUnit),
//         }),
//       })

//       const data = await res.json()

//       if (!res.ok) throw new Error(data.error || "Failed to ship order")

//       toast({
//         title: "✅ Order Shipped",
//         description: "The order has been marked as shipped successfully.",
//       })

//       setSelectedOrder(null)
//       setPricePerUnit("")
//       refreshOrders()
//     } catch (err) {
//       console.error("Error shipping order:", err)
//       toast({
//         title: "Error",
//         description: (err as Error).message,
//         variant: "destructive",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-muted-foreground">Loading orders...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-serif font-bold">Order Management</h2>
//           <p className="text-muted-foreground">Track your raw material orders and deliveries</p>
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Orders ({orderStats.total})</SelectItem>
//             <SelectItem value="pending">Pending ({orderStats.pending})</SelectItem>
//             <SelectItem value="confirmed">Confirmed ({orderStats.confirmed})</SelectItem>
//             <SelectItem value="shipped">Shipped ({orderStats.shipped})</SelectItem>
//             <SelectItem value="delivered">Delivered ({orderStats.delivered})</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Stats cards */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {Object.entries({
//           "Total Orders": orderStats.total,
//           Pending: orderStats.pending,
//           Confirmed: orderStats.confirmed,
//           Shipped: orderStats.shipped,
//           Delivered: orderStats.delivered,
//         }).map(([label, count], i) => (
//           <Card key={i}>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold">{count}</div>
//               <p className="text-xs text-muted-foreground">{label}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Orders list */}
//       <div className="space-y-4">
//         {filteredOrders.map((order) => (
//           <Card key={order._id}>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
//                   <p className="text-muted-foreground">Buyer: {order.buyerName}</p>
//                 </div>
//                 <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
//                   {getStatusIcon(order.status)}
//                   {order.status}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Product</p>
//                   <p className="font-medium">{order.productName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Quantity</p>
//                   <p className="font-medium">{order.quantity} {order.unit}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Price</p>
//                   <p className="font-medium">₹{order.totalAmount}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Order Date</p>
//                   <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
//                 </div>
//               </div>

//               {/* ✅ Ship Order Modal */}
//               {order.status === "confirmed" && (
//                 <Dialog open={selectedOrder?._id === order._id} onOpenChange={() => setSelectedOrder(order)}>
//                   <DialogTrigger asChild>
//                     <Button onClick={() => setSelectedOrder(order)}>🚚 Ship Order</Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Set Selling Price (₹)</DialogTitle>
//                     </DialogHeader>
//                     <div className="mt-4">
//                       <Input
//                         type="number"
//                         value={pricePerUnit}
//                         onChange={(e) => setPricePerUnit(e.target.value)}
//                         placeholder="Enter price per unit"
//                       />
//                     </div>
//                     <DialogFooter className="mt-4">
//                       <Button
//                         onClick={() => handleShipOrder(order._id)}
//                         disabled={!pricePerUnit}
//                       >
//                         Confirm & Ship
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredOrders.length === 0 && (
//         <Card>
//           <CardContent className="text-center py-8">
//             <p className="text-muted-foreground">No orders found for the selected filter.</p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }
