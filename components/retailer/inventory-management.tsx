// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react"

// interface InventoryItem {
//   id: string
//   name: string
//   currentStock: number
//   minThreshold: number
//   maxCapacity: number
//   lastRestocked: string
//   expiryDate: string
//   turnoverRate: number
//   status: "healthy" | "low-stock" | "expiring" | "overstocked"
// }

// export function InventoryManagement() {
//   const [inventory, setInventory] = useState<InventoryItem[]>([
//     {
//       id: "INV-001",
//       name: "Fresh Tomatoes",
//       currentStock: 85,
//       minThreshold: 20,
//       maxCapacity: 150,
//       lastRestocked: "2025-08-20",
//       expiryDate: "2025-08-25",
//       turnoverRate: 12.5,
//       status: "healthy",
//     },
//     {
//       id: "INV-002",
//       name: "Fresh Potatoes",
//       currentStock: 15,
//       minThreshold: 25,
//       maxCapacity: 100,
//       lastRestocked: "2025-08-18",
//       expiryDate: "2025-09-15",
//       turnoverRate: 8.3,
//       status: "low-stock",
//     },
//     {
//       id: "INV-003",
//       name: "Fresh Brinjal",
//       currentStock: 67,
//       minThreshold: 30,
//       maxCapacity: 120,
//       lastRestocked: "2025-08-19",
//       expiryDate: "2025-08-28",
//       turnoverRate: 15.2,
//       status: "expiring",
//     },
//   ])

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "healthy":
//         return "default"
//       case "low-stock":
//         return "secondary"
//       case "expiring":
//         return "destructive"
//       case "overstocked":
//         return "outline"
//       default:
//         return "default"
//     }
//   }

//   const getStockPercentage = (current: number, max: number) => {
//     return (current / max) * 100
//   }

//   const inventoryStats = {
//     totalItems: inventory.length,
//     healthy: inventory.filter((item) => item.status === "healthy").length,
//     lowStock: inventory.filter((item) => item.status === "low-stock").length,
//     expiring: inventory.filter((item) => item.status === "expiring").length,
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-serif font-bold">Inventory Management</h2>
//         <p className="text-muted-foreground">Monitor stock levels and manage product availability</p>
//       </div>

//       {/* Inventory Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
//             <p className="text-xs text-muted-foreground">Total Products</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold text-green-600">{inventoryStats.healthy}</div>
//             <p className="text-xs text-muted-foreground">Healthy Stock</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStock}</div>
//             <p className="text-xs text-muted-foreground">Low Stock</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <div className="text-2xl font-bold text-red-600">{inventoryStats.expiring}</div>
//             <p className="text-xs text-muted-foreground">Expiring Soon</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="space-y-4">
//         {inventory.map((item) => {
//           const stockPercentage = getStockPercentage(item.currentStock, item.maxCapacity)

//           return (
//             <Card key={item.id}>
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-lg">{item.name}</CardTitle>
//                   <Badge variant={getStatusColor(item.status)}>{item.status.replace("-", " ")}</Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Current Stock</p>
//                     <div className="flex items-center gap-2">
//                       <p className="font-medium text-lg">{item.currentStock}</p>
//                       {item.turnoverRate > 10 ? (
//                         <TrendingUp className="h-4 w-4 text-green-500" />
//                       ) : (
//                         <TrendingDown className="h-4 w-4 text-red-500" />
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Turnover Rate</p>
//                     <p className="font-medium text-lg">{item.turnoverRate}/week</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Last Restocked</p>
//                     <p className="font-medium">{item.lastRestocked}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Expiry Date</p>
//                     <p className="font-medium">{item.expiryDate}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <p className="text-sm text-muted-foreground">Stock Level</p>
//                     <p className="text-sm font-medium">
//                       {item.currentStock} / {item.maxCapacity} ({stockPercentage.toFixed(1)}%)
//                     </p>
//                   </div>
//                   <Progress value={stockPercentage} className="h-2" />
//                   <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                     <span>Min: {item.minThreshold}</span>
//                     <span>Max: {item.maxCapacity}</span>
//                   </div>
//                 </div>

//                 <div className="flex space-x-2">
//                   <Button size="sm" variant="outline">
//                     <Package className="h-3 w-3 mr-1" />
//                     Reorder
//                   </Button>
//                   {item.status === "expiring" && (
//                     <Button size="sm" variant="outline">
//                       <AlertTriangle className="h-3 w-3 mr-1" />
//                       Mark for Sale
//                     </Button>
//                   )}
//                   <Button size="sm" variant="outline">
//                     View Details
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useEffect, useState } from "react"

// interface InventoryItem {
//   _id: string
//   productName: string
//   quantity: number
//   unit: string
//   location: string
//   status: string
// }

// export default function InventoryManagement() {
//   const [inventory, setInventory] = useState<InventoryItem[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchInventory() {
//       try {
//         const res = await fetch("/api/retailer/inventory")
//         const data = await res.json()
//         const items = Array.isArray(data) ? data : []
//         setInventory(items)
//       } catch (e) {
//         console.error("Retailer inventory fetch error:", e)
//         setInventory([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchInventory()
//   }, [])

//   return (
//     <div className="bg-white rounded shadow p-6">
//       <h2 className="text-xl font-semibold mb-4">Inventory</h2>
//       <table className="w-full text-left">
//         <thead>
//           <tr className="border-b">
//             <th className="py-2">Product</th>
//             <th className="py-2">Quantity</th>
//             <th className="py-2">Unit</th>
//             <th className="py-2">Location</th>
//             <th className="py-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr><td colSpan={5} className="py-4 text-center">Loading…</td></tr>
//           ) : inventory.length === 0 ? (
//             <tr><td colSpan={5} className="py-4 text-center text-gray-500">No inventory found</td></tr>
//           ) : (
//             inventory.map((item) => (
//               <tr key={item._id} className="border-b hover:bg-gray-50">
//                 <td className="py-2">{item.productName}</td>
//                 <td className="py-2">{item.quantity}</td>
//                 <td className="py-2">{item.unit}</td>
//                 <td className="py-2">{item.location}</td>
//                 <td className="py-2">{item.status}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   )
// }
// "use client";

// import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";

// interface InventoryItem {
//   _id: string;
//   productName: string;
//   quantity: number;
//   unit: string;
//   location: string;
//   status: "available" | "pending" | "sold" | "reserved" | "expired";
// }

// export default function InventoryManagement() {
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchInventory() {
//       try {
//         const res = await fetch("/api/retailer/inventory");
//         const data = await res.json();

//         const items = Array.isArray(data)
//           ? data.filter(
//               (item) =>
//                 item.status === "available" || item.status === "shipped"
//             )
//           : [];

//         setInventory(items);
//       } catch (e) {
//         console.error("Retailer inventory fetch error:", e);
//         setInventory([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchInventory();
//   }, []);

//   return (
//     <div className="bg-white rounded shadow p-6">
//       <h2 className="text-xl font-semibold mb-4">Inventory</h2>

//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="border-b bg-gray-50">
//             <th className="py-2 px-3">Product</th>
//             <th className="py-2 px-3">Quantity</th>
//             <th className="py-2 px-3">Unit</th>
//             <th className="py-2 px-3">Location</th>
//             <th className="py-2 px-3">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan={5} className="py-4 text-center text-gray-500">
//                 Loading inventory…
//               </td>
//             </tr>
//           ) : inventory.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={5}
//                 className="py-4 text-center text-gray-500 italic"
//               >
//                 No available products found.
//               </td>
//             </tr>
//           ) : (
//             inventory.map((item) => (
//               <tr key={item._id} className="border-b hover:bg-gray-50">
//                 <td className="py-2 px-3 font-medium">{item.productName}</td>
//                 <td className="py-2 px-3">{item.quantity}</td>
//                 <td className="py-2 px-3">{item.unit}</td>
//                 <td className="py-2 px-3 text-gray-600">{item.location}</td>
//                 <td className="py-2 px-3">
//                   <Badge
//                     variant={
//                       item.status === "available"
//                         ? "default"
//                         : item.status === "pending"
//                         ? "secondary"
//                         : "outline"
//                     }
//                   >
//                     {item.status.charAt(0).toUpperCase() +
//                       item.status.slice(1)}
//                   </Badge>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryItem {
  _id: string;
  productName: string;
  quantity: number;
  unit: string;
  location: string;
  status: "available" | "pending" | "sold" | "reserved" | "expired" | "out_of_stock";
  pricePerUnit?: number;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});

  // ✅ Fetch inventory from backend
  async function fetchInventory() {
    try {
      setLoading(true);
      const res = await fetch("/api/retailer/inventory");
      const data = await res.json();

      const items = Array.isArray(data)
        ? data.filter(
            (item) => item.status === "available" || item.status === "shipped"
          )
        : [];

      setInventory(items);

      // Initialize price inputs
      const priceMap: Record<string, number> = {};
      items.forEach((i) => (priceMap[i._id] = i.pricePerUnit || 0));
      setPrices(priceMap);
    } catch (e) {
      console.error("Retailer inventory fetch error:", e);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Update price for specific product
  async function handlePriceUpdate(id: string) {
    const newPrice = prices[id];
    if (!newPrice || newPrice <= 0) {
      alert("⚠️ Please enter a valid price.");
      return;
    }

    try {
      setUpdatingId(id);
      const res = await fetch(`/api/retailer/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricePerUnit: newPrice }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Price updated successfully!");
        await fetchInventory(); // refresh data
      } else {
        alert(`❌ Failed to update: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating price:", error);
      alert("Something went wrong while updating price.");
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Retailer Inventory</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-2 px-3">Product</th>
            <th className="py-2 px-3">Quantity</th>
            <th className="py-2 px-3">Unit</th>
            <th className="py-2 px-3">Location</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3 text-center">Set Price (₹)</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                Loading inventory…
              </td>
            </tr>
          ) : inventory.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500 italic">
                No available products found.
              </td>
            </tr>
          ) : (
            inventory.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 font-medium">{item.productName}</td>
                <td className="py-2 px-3">{item.quantity}</td>
                <td className="py-2 px-3">{item.unit}</td>
                <td className="py-2 px-3 text-gray-600">{item.location}</td>
                <td className="py-2 px-3">
                  <Badge
                    variant={
                      item.status === "available"
                        ? "default"
                        : item.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1)}
                  </Badge>
                </td>

                {/* ✅ Price input and update button */}
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      type="number"
                      value={prices[item._id] || ""}
                      onChange={(e) =>
                        setPrices({
                          ...prices,
                          [item._id]: Number(e.target.value),
                        })
                      }
                      className="w-24 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePriceUpdate(item._id)}
                      disabled={updatingId === item._id}
                    >
                      {updatingId === item._id ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Current: ₹{item.pricePerUnit || 0}
                  </p>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
