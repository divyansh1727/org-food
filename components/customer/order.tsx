// "use client";

// import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// interface CustomerOrder {
//   _id: string;
//   orderNumber: string;
//   productName: string;
//   quantity: number;
//   unit: string;
//   totalAmount: number;
//   status: string;
//   sellerName: string;
//   orderDate: string;
// }

// export default function CustomerOrders() {
//   const [orders, setOrders] = useState<CustomerOrder[]>([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch customer orders
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/customer/orders");
//       const data = await res.json();
//       setOrders(Array.isArray(data.orders) ? data.orders : []);
//     } catch (error) {
//       console.error("Error fetching customer orders:", error);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🧾 My Orders
//       </h2>

//       {loading ? (
//         <div className="flex justify-center py-10 text-gray-500">
//           <Loader2 className="animate-spin w-5 h-5 mr-2" />
//           Loading your orders…
//         </div>
//       ) : orders.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           You haven’t placed any orders yet.
//         </p>
//       ) : (
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b bg-gray-50">
//               <th className="py-2 px-4">Order #</th>
//               <th className="py-2 px-4">Product</th>
//               <th className="py-2 px-4">Quantity</th>
//               <th className="py-2 px-4">Seller</th>
//               <th className="py-2 px-4">Amount</th>
//               <th className="py-2 px-4">Status</th>
//               <th className="py-2 px-4">Date</th>
//               <th className="py-2 px-4 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr
//                 key={order._id}
//                 className="border-b hover:bg-gray-50 transition-colors"
//               >
//                 <td className="py-3 px-4">{order.orderNumber}</td>
//                 <td className="py-3 px-4 font-medium">{order.productName}</td>
//                 <td className="py-3 px-4">
//                   {order.quantity} {order.unit}
//                 </td>
//                 <td className="py-3 px-4">{order.sellerName}</td>
//                 <td className="py-3 px-4">
//                   ₹{order.totalAmount.toFixed(2)}
//                 </td>
//                 <td className="py-3 px-4">
//                   <Badge
//                     variant={
//                       order.status === "pending"
//                         ? "secondary"
//                         : order.status === "shipped"
//                         ? "default"
//                         : order.status === "delivered"
//                         ? "outline"
//                         : "destructive"
//                     }
//                   >
//                     {order.status}
//                   </Badge>
//                 </td>
//                 <td className="py-3 px-4">
//                   {new Date(order.orderDate).toLocaleDateString()}
//                 </td>
//                 <td className="py-3 px-4 text-right">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       alert(
//                         `Tracking info for ${order.productName}:\n\nStatus: ${order.status}\nSeller: ${order.sellerName}`
//                       )
//                     }
//                   >
//                     Track
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/** Type definition for a customer order */
interface CustomerOrder {
  _id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: string;
  sellerName: string;
  orderDate: string;
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch customer orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("❌ Error fetching customer orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh orders manually
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">🧾 My Orders</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          Loading your orders…
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-4">Order #</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Seller</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">{order.orderNumber}</td>
                <td className="py-3 px-4 font-medium">{order.productName}</td>
                <td className="py-3 px-4">
                  {order.quantity} {order.unit}
                </td>
                <td className="py-3 px-4">{order.sellerName}</td>
                <td className="py-3 px-4">
                  ₹{order.totalAmount?.toFixed(2) ?? "0.00"}
                </td>

                <td className="py-3 px-4">
                  <Badge
                    variant={
                      order.status === "pending"
                        ? "secondary"
                        : order.status === "shipped"
                        ? "default"
                        : order.status === "delivered"
                        ? "outline"
                        : "destructive"
                    }
                    className={
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {order.status}
                  </Badge>
                </td>

                <td className="py-3 px-4">
                  {new Date(order.orderDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="py-3 px-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      alert(
                        `📦 Tracking Info for ${order.productName}\n\nOrder #: ${order.orderNumber}\nStatus: ${order.status}\nSeller: ${order.sellerName}`
                      )
                    }
                  >
                    Track
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
