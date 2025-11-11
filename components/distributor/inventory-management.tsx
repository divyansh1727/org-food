// "use client"

// import { useEffect, useState } from "react"

// interface InventoryItem {
//   _id: string
//   productName?: string
//   batchNumber: string
//   quantity: number
//   location: string
//   status: string
// }

// export default function InventoryManagement() {
//   const [inventory, setInventory] = useState<InventoryItem[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchInventory() {
//       try {
//         const res = await fetch("/api/distributor/inventory")
//         const data = await res.json()
//         const items = Array.isArray(data.inventory)
//           ? data.inventory
//           : Array.isArray(data)
//           ? data
//           : []
//         setInventory(items)
//       } catch (e) {
//         console.error("Distributor inventory fetch error:", e)
//         setInventory([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchInventory()
//   }, [])

//   return (
//     <div className="bg-background border border-border rounded-2xl shadow-sm p-8">
//       <h2 className="text-2xl font-serif font-semibold mb-6 text-foreground">
//         Distributor Inventory
//       </h2>

//       {/* 🧭 Desktop View (Table) */}
//       <div className="hidden md:block overflow-x-auto">
//         <table className="w-full border-collapse text-left">
//           <thead>
//             <tr className="border-b bg-muted/50">
//               <th className="py-3 px-4 font-semibold text-sm text-foreground">Product</th>
//               <th className="py-3 px-4 font-semibold text-sm text-foreground">Quantity</th>
//               <th className="py-3 px-4 font-semibold text-sm text-foreground">Location</th>
//               <th className="py-3 px-4 font-semibold text-sm text-foreground">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={4} className="py-6 text-center text-muted-foreground">
//                   Loading…
//                 </td>
//               </tr>
//             ) : inventory.length === 0 ? (
//               <tr>
//                 <td colSpan={4} className="py-6 text-center text-muted-foreground">
//                   No inventory found
//                 </td>
//               </tr>
//             ) : (
//               inventory.map((item) => (
//                 <tr
//                   key={item._id}
//                   className="border-b hover:bg-muted/30 transition-colors duration-150"
//                 >
//                   <td className="py-3 px-4">
//                     <div className="flex flex-col">
//                       <span className="font-medium text-foreground text-base">
//                         {item.productName || "Unnamed Product"}
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         {item.batchNumber}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">{item.quantity}</td>
//                   <td className="py-3 px-4">{item.location}</td>
//                   <td className="py-3 px-4">
//                     <span
//                       className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                         item.status === "available"
//                           ? "bg-green-100 text-green-800"
//                           : item.status === "reserved"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 📱 Mobile View (Card layout) */}
//       <div className="grid md:hidden gap-4">
//         {loading ? (
//           <p className="text-center text-muted-foreground py-4">Loading…</p>
//         ) : inventory.length === 0 ? (
//           <p className="text-center text-muted-foreground py-4">
//             No inventory found
//           </p>
//         ) : (
//           inventory.map((item) => (
//             <div
//               key={item._id}
//               className="border border-border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-medium text-foreground text-base">
//                     {item.productName || "Unnamed Product"}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {item.batchNumber}
//                   </p>
//                 </div>
//                 <span
//                   className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
//                     item.status === "available"
//                       ? "bg-green-100 text-green-800"
//                       : item.status === "reserved"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {item.status}
//                 </span>
//               </div>

//               <div className="mt-3 text-sm space-y-1 text-muted-foreground">
//                 <p>
//                   <span className="font-medium text-foreground">Quantity:</span>{" "}
//                   {item.quantity}
//                 </p>
//                 <p>
//                   <span className="font-medium text-foreground">Location:</span>{" "}
//                   {item.location}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }
"use client";

import { useEffect, useState } from "react";

interface InventoryItem {
  _id: string;
  productName?: string;
  batchNumber: string;
  quantity: number;
  location: string;
  status: string;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function fetchInventory(showLoading = false) {
    try {
      if (showLoading) setLoading(true);
      const res = await fetch("/api/distributor/inventory");
      const data = await res.json();
      const items = Array.isArray(data.inventory)
        ? data.inventory
        : Array.isArray(data)
        ? data
        : [];
      setInventory(items);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Distributor inventory fetch error:", e);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchInventory(true);
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => fetchInventory(false), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background border border-border rounded-2xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Distributor Inventory
        </h2>
        {lastUpdated && (
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </span>
        )}
      </div>

      {/* 🧭 Desktop View (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 font-semibold text-sm text-foreground">
                Product
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-foreground">
                Quantity
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-foreground">
                Location
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : inventory.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-muted-foreground"
                >
                  No inventory found
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr
                  key={item._id}
                  className={`border-b transition-colors duration-150 ${
                    item.status === "out_of_stock"
                      ? "bg-red-50 text-gray-500 opacity-70"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-base">
                        {item.productName || "Unnamed Product"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.batchNumber}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{item.quantity}</td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        item.status === "available"
                          ? "bg-green-100 text-green-800"
                          : item.status === "reserved"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "out_of_stock"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile View (Card layout) */}
      <div className="grid md:hidden gap-4">
        {loading ? (
          <p className="text-center text-muted-foreground py-4">Loading…</p>
        ) : inventory.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No inventory found
          </p>
        ) : (
          inventory.map((item) => (
            <div
              key={item._id}
              className={`border border-border rounded-xl p-4 bg-white shadow-sm transition-shadow ${
                item.status === "out_of_stock"
                  ? "opacity-60 bg-red-50"
                  : "hover:shadow-md"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-foreground text-base">
                    {item.productName || "Unnamed Product"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.batchNumber}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    item.status === "available"
                      ? "bg-green-100 text-green-800"
                      : item.status === "reserved"
                      ? "bg-yellow-100 text-yellow-800"
                      : item.status === "out_of_stock"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-3 text-sm space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Quantity:</span>{" "}
                  {item.quantity}
                </p>
                <p>
                  <span className="font-medium text-foreground">Location:</span>{" "}
                  {item.location}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
