// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";

// interface InventoryItem {
//   _id: string;
//   productName: string;
//   batchNumber: string;
//   quantity: number;
//   unit: string;
//   pricePerUnit: number;
//   supplierName: string; // manufacturer name
// }

// export default function PlaceOrder() {
//   const [items, setItems] = useState<InventoryItem[]>([]);
//   const [selectedId, setSelectedId] = useState<string>("");
//   const [quantity, setQuantity] = useState<number>(1);
//   const [street, setStreet] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [zipCode, setZipCode] = useState("");
//   const [country, setCountry] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

//   function getAuthToken() {
//     try {
//       const t = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;
//       if (t) return t;
//       if (typeof document !== "undefined") {
//         const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("auth-token="));
//         if (cookie) return cookie.split("=")[1];
//       }
//     } catch (e) {}
//     return null;
//   }

//   // Load manufacturer inventory for distributor to view
//   useEffect(() => {
//     async function fetchInventory() {
//       try {
//         const token = getAuthToken();
//         const res = await fetch("/api/manufacturer/inventory", {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         });
//         if (!res.ok) throw new Error("Failed to fetch manufacturer inventory");
//         const data = await res.json();
//         setItems(Array.isArray(data) ? data : Array.isArray(data.inventory) ? data.inventory : []);
//         console.log("✅ Loaded manufacturer inventory:", data);
//       } catch (err) {
//         console.error("❌ Error loading manufacturer inventory:", err);
//         setItems([]);
//       }
//     }
//     fetchInventory();
//   }, []);

//   async function handlePlaceOrder() {
//     if (!selectedId || !quantity || !street || !city || !state || !zipCode || !country) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const selected = items.find((i) => i._id === selectedId);
//     if (!selected) {
//       toast({
//         title: "Error",
//         description: "Invalid product selection.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (quantity > selected.quantity) {
//       toast({
//         title: "Error",
//         description: "Requested quantity exceeds available stock.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // ✅ Add this debug log BEFORE sending order
//     console.log("🧩 Placing order with productId (from manufacturer inventory):", selected._id);
//     console.log("🧩 Selected item details:", selected);

//     setLoading(true);
//     try {
//       const token = getAuthToken();
//       const res = await fetch("/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify({
//           productId: selected._id, // this should be manufacturer_inventory._id
//           quantity,
//           shippingAddress: { street, city, state, zipCode, country },
//         }),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Failed to place order");

//       toast({
//         title: "Order placed successfully",
//         description: `Order Number: ${result.order.orderNumber}`,
//       });

//       // Reset form
//       setSelectedId("");
//       setQuantity(1);
//       setStreet("");
//       setCity("");
//       setState("");
//       setZipCode("");
//       setCountry("");
//     } catch (err) {
//       toast({
//         title: "Error",
//         description: (err as Error).message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-2xl font-semibold">Place an Order from Manufacturer</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Select inventory product */}
//         <div>
//           <label className="block mb-1 text-sm font-medium">Select Product Batch</label>
//           <Select value={selectedId} onValueChange={setSelectedId}>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose a product batch" />
//             </SelectTrigger>
//             <SelectContent>
//               {items.map((item) => (
//                 <SelectItem key={item._id} value={item._id}>
//                   {item.productName} – Batch {item.batchNumber} – ₹{item.pricePerUnit}/{item.unit} (Available: {item.quantity})
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Quantity */}
//         <div>
//           <label className="block mb-1 text-sm font-medium">Quantity</label>
//           <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
//         </div>

//         {/* Shipping address */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium">Street</label>
//             <Input value={street} onChange={(e) => setStreet(e.target.value)} />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium">City</label>
//             <Input value={city} onChange={(e) => setCity(e.target.value)} />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium">State</label>
//             <Input value={state} onChange={(e) => setState(e.target.value)} />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium">Zip Code</label>
//             <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
//           </div>
//           <div className="md:col-span-2">
//             <label className="block mb-1 text-sm font-medium">Country</label>
//             <Input value={country} onChange={(e) => setCountry(e.target.value)} />
//           </div>
//         </div>

//         <Button onClick={handlePlaceOrder} disabled={loading}>
//           {loading ? "Placing…" : "Place Order"}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  supplierName: string; // Manufacturer name
}

export default function PlaceOrder() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 🧠 Utility to get auth token
  function getAuthToken() {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth-token")
          : null;
      if (token) return token;
      if (typeof document !== "undefined") {
        const cookie = document.cookie
          .split(";")
          .find((c) => c.trim().startsWith("auth-token="));
        if (cookie) return cookie.split("=")[1];
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  // ✅ Fetch available manufacturer products for distributor
  useEffect(() => {
    async function fetchInventory() {
      try {
        const token = getAuthToken();
        const res = await fetch("/api/distributor/manufacturer-inventory", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch manufacturer inventory");
        const data = await res.json();

        const products = Array.isArray(data.products) ? data.products : [];
        setItems(products);
        console.log("✅ Loaded manufacturer inventory:", products);
      } catch (err) {
        console.error("❌ Error loading manufacturer inventory:", err);
        setItems([]);
      }
    }

    fetchInventory();
  }, []);

  // ✅ Handle order placement
  async function handlePlaceOrder() {
    if (!selectedId || !quantity || !street || !city || !state || !zipCode || !country) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields before placing the order.",
        variant: "destructive",
      });
      return;
    }

    const selected = items.find((i) => i._id === selectedId);
    if (!selected) {
      toast({
        title: "Error",
        description: "Invalid product selection.",
        variant: "destructive",
      });
      return;
    }

    if (quantity > selected.quantity) {
      toast({
        title: "Error",
        description: "Requested quantity exceeds available stock.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productId: selected.productId,
          quantity,
          shippingAddress: { street, city, state, zipCode, country },
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to place order");

      toast({
        title: "✅ Order placed successfully",
        description: `Order Number: ${result.order?.orderNumber || "N/A"}`,
      });

      // Reset form
      setSelectedId("");
      setQuantity(1);
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
      setCountry("");
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const selectedProduct = items.find((i) => i._id === selectedId);
  const totalPrice =
    selectedProduct && quantity
      ? (selectedProduct.pricePerUnit * quantity).toFixed(2)
      : "0.00";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          🏭 Place an Order from Manufacturer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Select product batch */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Select Product Batch
          </label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a product batch" />
            </SelectTrigger>
            <SelectContent>
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm p-2">
                  No available manufacturer products.
                </p>
              ) : (
                items.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.productName} — Batch {item.batchNumber} — ₹
                    {item.pricePerUnit}/{item.unit} (Available:{" "}
                    {item.quantity})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        {selectedProduct && (
          <div>
            <label className="block mb-1 text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min={1}
              max={selectedProduct.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <p className="text-sm text-gray-600 mt-1">
              Total: ₹{totalPrice} ({quantity} × ₹
              {selectedProduct.pricePerUnit}/{selectedProduct.unit})
            </p>
          </div>
        )}

        {/* Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Street</label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">City</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">State</label>
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Zip Code</label>
            <Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Country</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={loading || !selectedId || !quantity}
          className="w-full mt-4"
        >
          {loading ? "Placing Order…" : "Place Order"}
        </Button>
      </CardContent>
    </Card>
  );
}
