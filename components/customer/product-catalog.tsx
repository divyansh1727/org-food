// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";

// // ✅ Define the Product interface
// interface Product {
//   _id: string;
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }

// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState<string | null>(null);

//   // ✅ Fetch available retailer products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         // ✅ Add simulated AI + blockchain trust score
//         const scoredProducts: Product[] = availableProducts.map((p: Product) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)), // between 90–99%
//         }));

//         setProducts(scoredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle "Buy Now" action
//   const handleBuy = async (productId: string) => {
//     setBuying(productId);
//     try {
//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId,
//           quantity: 1, // default 1 unit
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();
//       if (res.ok) {
//         toast({
//           title: "✅ Order placed successfully",
//           description: "Your order has been placed successfully.",
//         });
//       } else {
//         toast({
//           title: "❌ Failed",
//           description: result.error || "Could not place the order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(null);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p: Product) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Quantity:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ✅ Trust Score */}
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">
//                     Trust Score:{" "}
//                     <span className="text-green-700">{p.trustScore}%</span>
//                   </p>
//                   <Progress value={p.trustScore} className="h-2 bg-gray-200" />
//                 </div>

//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     disabled={buying === p._id}
//                     onClick={() => handleBuy(p._id)}
//                   >
//                     {buying === p._id ? "Placing Order..." : "Buy Now"}
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       alert(
//                         `Trace the journey of ${p.productName} from farm to shelf.`
//                       )
//                     }
//                   >
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";

// // ✅ Product interface
// interface Product {
//   _id: string;
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }

// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState<string | null>(null);

//   // ✅ Fetch products from retailer inventory
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         const scored = availableProducts.map((p: Product) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)), // 90–99%
//         }));

//         setProducts(scored);
//       } catch (error) {
//         console.error("❌ Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle Buy with quantity input
//   const handleBuy = async (product: Product) => {
//     const qtyInput = prompt(
//       `🛒 How many ${product.unit}(s) of ${product.productName} would you like to buy?\nAvailable: ${product.quantity}`
//     );

//     if (!qtyInput) return;
//     const quantity = parseInt(qtyInput);

//     if (isNaN(quantity) || quantity <= 0) {
//       alert("❌ Please enter a valid quantity.");
//       return;
//     }

//     if (quantity > product.quantity) {
//       alert(`⚠️ Only ${product.quantity} ${product.unit}(s) available.`);
//       return;
//     }

//     const totalPrice = quantity * (product.pricePerUnit || 0);
//     const confirmPurchase = confirm(
//       `💰 Total: ₹${totalPrice.toFixed(2)}\n\nDo you want to confirm your purchase?`
//     );

//     if (!confirmPurchase) return;

//     setBuying(product._id);
//     try {
//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: product._id,
//           quantity,
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();
//       if (res.ok) {
//         toast({
//           title: "✅ Order placed successfully!",
//           description: `${quantity} ${product.unit}(s) of ${product.productName} ordered for ₹${totalPrice.toFixed(2)}.`,
//         });
//       } else {
//         toast({
//           title: "❌ Order Failed",
//           description: result.error || "Unable to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("❌ Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(null);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p: Product) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Quantity:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"} / {p.unit}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ✅ Trust Score */}
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">
//                     Trust Score:{" "}
//                     <span className="text-green-700">{p.trustScore}%</span>
//                   </p>
//                   <Progress value={p.trustScore} className="h-2 bg-gray-200" />
//                 </div>

//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     disabled={buying === p._id}
//                     onClick={() => handleBuy(p)}
//                   >
//                     {buying === p._id ? "Processing..." : "Buy Now"}
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       alert(
//                         `🔗 Trace journey of ${p.productName}\nFrom farm to table!`
//                       )
//                     }
//                   >
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface Product {
//   _id: string;
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }

// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);

//   // ✅ Fetch available retailer products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         const scoredProducts: Product[] = availableProducts.map((p) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)), // between 90–99%
//         }));

//         setProducts(scoredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle order placement
//   const handleConfirmOrder = async () => {
//     if (!selectedProduct) return;
//     if (quantity <= 0 || quantity > selectedProduct.quantity) {
//       toast({
//         title: "⚠️ Invalid Quantity",
//         description: `Please select a valid quantity (1–${selectedProduct.quantity}).`,
//         variant: "destructive",
//       });
//       return;
//     }

//     setBuying(true);

//     try {
//       const totalPrice = quantity * (selectedProduct.pricePerUnit || 0);

//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: selectedProduct._id,
//           quantity,
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast({
//           title: "✅ Order Placed Successfully!",
//           description: `${quantity} ${selectedProduct.unit}(s) of ${selectedProduct.productName} for ₹${totalPrice.toFixed(2)}.`,
//         });
//         setSelectedProduct(null); // close dialog
//         setQuantity(1);
//       } else {
//         toast({
//           title: "❌ Order Failed",
//           description: result.error || "Unable to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Available:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"} / {p.unit}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ✅ Trust Score */}
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">
//                     Trust Score:{" "}
//                     <span className="text-green-700">{p.trustScore}%</span>
//                   </p>
//                   <Progress value={p.trustScore} className="h-2 bg-gray-200" />
//                 </div>

//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     onClick={() => setSelectedProduct(p)}
//                   >
//                     Buy Now
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       alert(
//                         `🔗 Trace journey of ${p.productName}\nFrom farm to table!`
//                       )
//                     }
//                   >
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ✅ Buy Now Dialog */}
//       <Dialog
//         open={!!selectedProduct}
//         onOpenChange={(open) => {
//           if (!open) {
//             setSelectedProduct(null);
//             setQuantity(1);
//           }
//         }}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               🛒 Buy {selectedProduct?.productName || ""}
//             </DialogTitle>
//             <DialogDescription>
//               Enter the quantity you want to purchase below.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedProduct && (
//             <div className="space-y-4 py-2">
//               <div>
//                 <Label htmlFor="quantity" className="text-sm font-medium">
//                   Quantity (Available: {selectedProduct.quantity}{" "}
//                   {selectedProduct.unit})
//                 </Label>
//                 <Input
//                   id="quantity"
//                   type="number"
//                   min={1}
//                   max={selectedProduct.quantity}
//                   value={quantity}
//                   onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//                   className="mt-1"
//                 />
//               </div>

//               <p className="text-gray-700 text-sm">
//                 💰 Total Price:{" "}
//                 <span className="font-semibold">
//                   ₹{(
//                     (quantity || 0) * (selectedProduct.pricePerUnit || 0)
//                   ).toFixed(2)}
//                 </span>
//               </p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setSelectedProduct(null)}
//               disabled={buying}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="default"
//               className="bg-green-600 hover:bg-green-700"
//               disabled={buying}
//               onClick={handleConfirmOrder}
//             >
//               {buying ? "Placing..." : "Confirm Purchase"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // interface Product {
// //   _id: string;
// //   productName: string;
// //   pricePerUnit: number;
// //   quantity: number;
// //   unit: string;
// //   ownerName: string;
// //   status: string;
// //   trustScore?: number;
// // }
// interface Product {
//   _id: string;
//   productId?: string; // ✅ add this line
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }


// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);

//   const router = useRouter(); // ✅ Add router for navigation

//   // ✅ Fetch available retailer products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         const scoredProducts: Product[] = availableProducts.map((p) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)), // between 90–99%
//         }));

//         setProducts(scoredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle order placement
//   const handleConfirmOrder = async () => {
//     if (!selectedProduct) return;
//     if (quantity <= 0 || quantity > selectedProduct.quantity) {
//       toast({
//         title: "⚠️ Invalid Quantity",
//         description: `Please select a valid quantity (1–${selectedProduct.quantity}).`,
//         variant: "destructive",
//       });
//       return;
//     }

//     setBuying(true);

//     try {
//       const totalPrice = quantity * (selectedProduct.pricePerUnit || 0);

//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: selectedProduct._id,
//           quantity,
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast({
//           title: "✅ Order Placed Successfully!",
//           description: `${quantity} ${selectedProduct.unit}(s) of ${selectedProduct.productName} for ₹${totalPrice.toFixed(2)}.`,
//         });
//         setSelectedProduct(null); // close dialog
//         setQuantity(1);
//       } else {
//         toast({
//           title: "❌ Order Failed",
//           description: result.error || "Unable to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Available:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"} / {p.unit}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ✅ Trust Score */}
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">
//                     Trust Score:{" "}
//                     <span className="text-green-700">{p.trustScore}%</span>
//                   </p>
//                   <Progress value={p.trustScore} className="h-2 bg-gray-200" />
//                 </div>

//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     onClick={() => setSelectedProduct(p)}
//                   >
//                     Buy Now
//                   </Button>

//                   {/* ✅ Updated Trace Button */}
//                   <Button
//   variant="outline"
//   onClick={() => {
//     // Always prefer original productId, fallback to _id
//     const traceId = p.productId || p._id;
//     window.location.href = `/trace/${traceId}`;
//   }}
// >
//   Trace
// </Button>

//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ✅ Buy Now Dialog */}
//       <Dialog
//         open={!!selectedProduct}
//         onOpenChange={(open) => {
//           if (!open) {
//             setSelectedProduct(null);
//             setQuantity(1);
//           }
//         }}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               🛒 Buy {selectedProduct?.productName || ""}
//             </DialogTitle>
//             <DialogDescription>
//               Enter the quantity you want to purchase below.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedProduct && (
//             <div className="space-y-4 py-2">
//               <div>
//                 <Label htmlFor="quantity" className="text-sm font-medium">
//                   Quantity (Available: {selectedProduct.quantity}{" "}
//                   {selectedProduct.unit})
//                 </Label>
//                 <Input
//                   id="quantity"
//                   type="number"
//                   min={1}
//                   max={selectedProduct.quantity}
//                   value={quantity}
//                   onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//                   className="mt-1"
//                 />
//               </div>

//               <p className="text-gray-700 text-sm">
//                 💰 Total Price:{" "}
//                 <span className="font-semibold">
//                   ₹{(
//                     (quantity || 0) * (selectedProduct.pricePerUnit || 0)
//                   ).toFixed(2)}
//                 </span>
//               </p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setSelectedProduct(null)}
//               disabled={buying}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="default"
//               className="bg-green-600 hover:bg-green-700"
//               disabled={buying}
//               onClick={handleConfirmOrder}
//             >
//               {buying ? "Placing..." : "Confirm Purchase"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface Product {
//   _id: string;
//   productId?: string;
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }

// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);

//   const router = useRouter();

//   // ✅ Fetch available retailer products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         const scoredProducts: Product[] = availableProducts.map((p) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)), // temp fallback
//         }));

//         setProducts(scoredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle order placement
//   const handleConfirmOrder = async () => {
//     if (!selectedProduct) return;
//     if (quantity <= 0 || quantity > selectedProduct.quantity) {
//       toast({
//         title: "⚠️ Invalid Quantity",
//         description: `Please select a valid quantity (1–${selectedProduct.quantity}).`,
//         variant: "destructive",
//       });
//       return;
//     }

//     setBuying(true);

//     try {
//       const totalPrice = quantity * (selectedProduct.pricePerUnit || 0);

//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: selectedProduct._id,
//           quantity,
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast({
//           title: "✅ Order Placed Successfully!",
//           description: `${quantity} ${selectedProduct.unit}(s) of ${selectedProduct.productName} for ₹${totalPrice.toFixed(2)}.`,
//         });
//         setSelectedProduct(null);
//         setQuantity(1);
//       } else {
//         toast({
//           title: "❌ Order Failed",
//           description: result.error || "Unable to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(false);
//     }
//   };

//   // ✅ Handle AI-based trust score breakdown
//   const handleTrustScoreClick = async (product: Product) => {
//     try {
//       const res = await fetch(`/api/trustscore/${product.productId || product._id}`);
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error);

//       const message = data.factors
//         .map((f: any) => `${f.name}: ${f.value}%`)
//         .join("\n");

//       alert(`🤖 AI-Based Trust Score: ${data.trustScore}%\n\n${message}`);
//     } catch (err) {
//       console.error("Trust score fetch failed:", err);
//       alert("Failed to fetch trust score details.");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Available:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"} / {p.unit}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ✅ AI Trust Score Section */}
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1 flex justify-between">
//                     <span>
//                       Trust Score:{" "}
//                       <span
//                         className="text-green-700 underline cursor-pointer"
//                         onClick={() => handleTrustScoreClick(p)}
//                       >
//                         {p.trustScore}%
//                       </span>
//                     </span>
//                   </p>
//                   <Progress value={p.trustScore} className="h-2 bg-gray-200" />
//                 </div>

//                 {/* ✅ Buttons */}
//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     onClick={() => setSelectedProduct(p)}
//                   >
//                     Buy Now
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       const traceId = p.productId || p._id;
//                       window.location.href = `/trace/${traceId}`;
//                     }}
//                   >
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ✅ Buy Dialog */}
//       <Dialog
//         open={!!selectedProduct}
//         onOpenChange={(open) => {
//           if (!open) {
//             setSelectedProduct(null);
//             setQuantity(1);
//           }
//         }}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               🛒 Buy {selectedProduct?.productName || ""}
//             </DialogTitle>
//             <DialogDescription>
//               Enter the quantity you want to purchase below.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedProduct && (
//             <div className="space-y-4 py-2">
//               <div>
//                 <Label htmlFor="quantity" className="text-sm font-medium">
//                   Quantity (Available: {selectedProduct.quantity}{" "}
//                   {selectedProduct.unit})
//                 </Label>
//                 <Input
//                   id="quantity"
//                   type="number"
//                   min={1}
//                   max={selectedProduct.quantity}
//                   value={quantity}
//                   onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
//                   className="mt-1"
//                 />
//               </div>

//               <p className="text-gray-700 text-sm">
//                 💰 Total Price:{" "}
//                 <span className="font-semibold">
//                   ₹{(
//                     (quantity || 0) * (selectedProduct.pricePerUnit || 0)
//                   ).toFixed(2)}
//                 </span>
//               </p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setSelectedProduct(null)}
//               disabled={buying}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="default"
//               className="bg-green-600 hover:bg-green-700"
//               disabled={buying}
//               onClick={handleConfirmOrder}
//             >
//               {buying ? "Placing..." : "Confirm Purchase"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Radar,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ResponsiveContainer,
// } from "recharts";

// interface Product {
//   _id: string;
//   productId?: string;
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }

// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [trustDialogOpen, setTrustDialogOpen] = useState(false);
//   const [trustDetails, setTrustDetails] = useState<any>(null);

//   const router = useRouter();

//   // ✅ Fetch available retailer products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         const scoredProducts: Product[] = availableProducts.map((p) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)), // fallback
//         }));

//         setProducts(scoredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle order placement
//   const handleConfirmOrder = async () => {
//     if (!selectedProduct) return;
//     if (quantity <= 0 || quantity > selectedProduct.quantity) {
//       toast({
//         title: "⚠️ Invalid Quantity",
//         description: `Please select a valid quantity (1–${selectedProduct.quantity}).`,
//         variant: "destructive",
//       });
//       return;
//     }

//     setBuying(true);

//     try {
//       const totalPrice = quantity * (selectedProduct.pricePerUnit || 0);

//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: selectedProduct._id,
//           quantity,
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast({
//           title: "✅ Order Placed Successfully!",
//           description: `${quantity} ${selectedProduct.unit}(s) of ${selectedProduct.productName} for ₹${totalPrice.toFixed(2)}.`,
//         });
//         setSelectedProduct(null);
//         setQuantity(1);
//       } else {
//         toast({
//           title: "❌ Order Failed",
//           description: result.error || "Unable to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(false);
//     }
//   };

//   // ✅ Handle AI-based trust score breakdown
//   const handleTrustScoreClick = async (product: Product) => {
//     try {
//       const res = await fetch(`/api/trustscore/${product.productId || product._id}`);
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error);

//       setTrustDetails({
//         score: data.trustScore,
//         factors: data.factors,
//         product: product.productName,
//       });
//       setTrustDialogOpen(true);
//     } catch (err) {
//       console.error("Trust score fetch failed:", err);
//       alert("Failed to fetch trust score details.");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Available:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"} / {p.unit}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ✅ AI Trust Score Section */}
//                 {/* ✅ AI Trust Score Button */}
// <div className="flex flex-col items-center mt-2">
//   <Button
//     variant="outline"
//     className="border-green-600 text-green-700 hover:bg-green-50 font-medium"
//     onClick={() => handleTrustScoreClick(p)}
//   >
//     🤖 Check Trust Score
//   </Button>

//   {/* Optional — a subtle text below button */}
//   <p className="text-xs text-gray-500 mt-2">
//     AI-powered authenticity & freshness rating
//   </p>
// </div>


//                 {/* ✅ Buttons */}
//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     onClick={() => setSelectedProduct(p)}
//                   >
//                     Buy Now
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       const traceId = p.productId || p._id;
//                       window.location.href = `/trace/${traceId}`;
//                     }}
//                   >
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ✅ Trust Score Dialog */}
//       <Dialog open={trustDialogOpen} onOpenChange={setTrustDialogOpen}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold text-center">
//               🤖 AI-Based Trust Analysis
//             </DialogTitle>
//             <DialogDescription className="text-center text-gray-600">
//               Trust evaluation for <b>{trustDetails?.product}</b>
//             </DialogDescription>
//           </DialogHeader>

//           {trustDetails && (
//             <div className="space-y-5 py-2">
//               {/* 🔵 Animated Circular Score */}
//               <div className="flex flex-col items-center">
//                 <div
//                   className="relative flex items-center justify-center w-32 h-32 rounded-full border-[10px]"
//                   style={{
//                     borderColor: `conic-gradient(
//                       #16a34a ${trustDetails.score * 3.6}deg,
//                       #d1fae5 0deg
//                     )`,
//                   }}
//                 >
//                   <span className="absolute text-3xl font-bold text-green-700">
//                     {trustDetails.score}%
//                   </span>
//                 </div>
//                 <p className="mt-2 text-sm text-gray-600">
//                   Overall AI Confidence
//                 </p>
//               </div>

//               {/* 🕸 Radar Chart */}
//               <div className="h-60">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <RadarChart data={trustDetails.factors}>
//                     <PolarGrid />
//                     <PolarAngleAxis dataKey="name" />
//                     <PolarRadiusAxis angle={30} domain={[0, 100]} />
//                     <Radar
//                       name="Trust Factors"
//                       dataKey="value"
//                       stroke="#16a34a"
//                       fill="#16a34a"
//                       fillOpacity={0.4}
//                     />
//                   </RadarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* 🧩 Factor Breakdown */}
//               <div className="space-y-3">
//                 {trustDetails.factors.map((f: any, idx: number) => (
//                   <div key={idx}>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>{f.name}</span>
//                       <span className="font-medium">{f.value}%</span>
//                     </div>
//                     <Progress value={f.value} className="h-2 bg-gray-200" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <DialogFooter className="pt-2">
//             <Button onClick={() => setTrustDialogOpen(false)} className="w-full">
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";
// import { motion } from "framer-motion";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Radar,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ResponsiveContainer,
// } from "recharts";

// interface Product {
//   _id: string;
//   productId?: string;
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }

// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [trustDialogOpen, setTrustDialogOpen] = useState(false);
//   const [trustDetails, setTrustDetails] = useState<any>(null);

//   const router = useRouter();

//   // ✅ Fetch available retailer products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         const scoredProducts: Product[] = availableProducts.map((p) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)), // fallback
//         }));

//         setProducts(scoredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle order placement
//   const handleConfirmOrder = async () => {
//     if (!selectedProduct) return;
//     if (quantity <= 0 || quantity > selectedProduct.quantity) {
//       toast({
//         title: "⚠️ Invalid Quantity",
//         description: `Please select a valid quantity (1–${selectedProduct.quantity}).`,
//         variant: "destructive",
//       });
//       return;
//     }

//     setBuying(true);

//     try {
//       const totalPrice = quantity * (selectedProduct.pricePerUnit || 0);

//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: selectedProduct._id,
//           quantity,
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast({
//           title: "✅ Order Placed Successfully!",
//           description: `${quantity} ${selectedProduct.unit}(s) of ${selectedProduct.productName} for ₹${totalPrice.toFixed(2)}.`,
//         });
//         setSelectedProduct(null);
//         setQuantity(1);
//       } else {
//         toast({
//           title: "❌ Order Failed",
//           description: result.error || "Unable to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(false);
//     }
//   };

//   // ✅ Handle AI-based trust score breakdown
//   const handleTrustScoreClick = async (product: Product) => {
//     try {
//       const res = await fetch(`/api/trustscore/${product.productId || product._id}`);
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error);

//       setTrustDetails({
//         score: data.trustScore,
//         factors: data.factors,
//         product: product.productName,
//       });
//       setTrustDialogOpen(true);
//     } catch (err) {
//       console.error("Trust score fetch failed:", err);
//       alert("Failed to fetch trust score details.");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Available:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"} / {p.unit}
//                     </span>
//                   </p>
//                 </div>

//                 {/* ✅ AI Trust Score Section */}
//                 <div className="flex flex-col items-center mt-2">
//                   <Button
//                     variant="outline"
//                     className="border-green-600 text-green-700 hover:bg-green-50 font-medium"
//                     onClick={() => handleTrustScoreClick(p)}
//                   >
//                     🤖 Check Trust Score
//                   </Button>
//                   <p className="text-xs text-gray-500 mt-2">
//                     AI-powered authenticity & freshness rating
//                   </p>
//                 </div>

//                 {/* ✅ Buttons */}
//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     onClick={() => setSelectedProduct(p)}
//                   >
//                     Buy Now
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       const traceId = p.productId || p._id;
//                       window.location.href = `/trace/${traceId}`;
//                     }}
//                   >
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ✅ Trust Score Dialog */}
//       <Dialog open={trustDialogOpen} onOpenChange={setTrustDialogOpen}>
//         <DialogContent className="max-w-3xl w-full md:w-[800px] border-green-200 shadow-lg shadow-green-100 p-8 rounded-xl overflow-y-auto max-h-[90vh]">
//   <DialogHeader className="text-center space-y-2">
//     <DialogTitle className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
//       🧠 AI Trust Report for {trustDetails?.product}
//     </DialogTitle>
//     <motion.p
//       className="text-sm text-green-600 font-medium tracking-wide"
//       animate={{ opacity: [0.6, 1, 0.6] }}
//       transition={{ duration: 2, repeat: Infinity }}
//     >
//       ⚡ Powered by AI & Blockchain Integrity Engine
//     </motion.p>
//     <div className="w-16 h-[2px] bg-green-500 mx-auto mt-2 rounded-full" />
//   </DialogHeader>

//   {trustDetails && (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="space-y-6 mt-4"
//     >
//       {/* 🌿 Animated Circular Score */}
//       <div className="flex flex-col items-center">
//         <motion.div
//           initial={{ rotate: 0 }}
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
//           className="relative flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-tr from-green-200 to-green-100 shadow-inner"
//         >
//           <motion.div
//             className="absolute inset-2 bg-white rounded-full flex items-center justify-center border-[10px] border-green-300"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", stiffness: 100, damping: 12 }}
//           >
//             <span className="text-4xl font-extrabold text-green-700 drop-shadow-sm">
//               {trustDetails.score}%
//             </span>
//           </motion.div>
//         </motion.div>
//         <p className="mt-3 text-sm text-gray-600">Overall AI Confidence</p>
//       </div>

//       {/* 🕸 Animated Radar Chart */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.3, duration: 0.8 }}
//         className="flex justify-center items-center w-full h-[300px] bg-green-50 rounded-xl p-4"
//       >
//         <ResponsiveContainer width="100%" height="100%">
//           <RadarChart outerRadius="75%" data={trustDetails.factors}>
//             <PolarGrid />
//             <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
//             <PolarRadiusAxis angle={30} domain={[0, 100]} />
//             <Radar
//               name="Trust Factors"
//               dataKey="value"
//               stroke="#15803d"
//               fill="#22c55e"
//               fillOpacity={0.5}
//             />
//           </RadarChart>
//         </ResponsiveContainer>
//       </motion.div>

//       {/* 🧩 Factor Breakdown */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5 }}
//         className="grid grid-cols-2 gap-4 text-sm"
//       >
//         {trustDetails.factors.map((f: any, idx: number) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 * idx }}
//             className="bg-white border border-green-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <p className="font-medium text-gray-700">{f.name}</p>
//             <Progress value={f.value} className="h-2 bg-gray-200 mt-1" />
//             <p
//               className={`text-sm font-semibold mt-1 ${
//                 f.value > 85
//                   ? "text-green-700"
//                   : f.value > 70
//                   ? "text-yellow-600"
//                   : "text-red-600"
//               }`}
//             >
//               {f.value}%
//             </p>
//           </motion.div>
//         ))}
//       </motion.div>

//       <DialogFooter className="pt-6">
//         <Button
//           onClick={() => setTrustDialogOpen(false)}
//           className="w-full text-white bg-green-600 hover:bg-green-700 transition-transform hover:scale-[1.02]"
//         >
//           Close
//         </Button>
//       </DialogFooter>
//     </motion.div>
//   )}
// </DialogContent>

//       </Dialog>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/components/ui/use-toast";
// import { motion } from "framer-motion";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";

// import {
//   Radar,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ResponsiveContainer,
// } from "recharts";

// interface Product {
//   _id: string;
//   productId?: string;
//   productName: string;
//   pricePerUnit: number;
//   quantity: number;
//   unit: string;
//   ownerName: string;
//   status: string;
//   trustScore?: number;
// }

// export default function ProductCatalog() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [trustDialogOpen, setTrustDialogOpen] = useState(false);
//   const [trustDetails, setTrustDetails] = useState<any>(null);
//   const [buyDialogOpen, setBuyDialogOpen] = useState(false);

//   const router = useRouter();

//   // ✅ Fetch available retailer products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/customer/products");
//         const data = await res.json();

//         const availableProducts: Product[] = (Array.isArray(data)
//           ? data
//           : Array.isArray(data.products)
//           ? data.products
//           : []
//         ).filter((p: Product) => p.status === "available");

//         const scoredProducts: Product[] = availableProducts.map((p) => ({
//           ...p,
//           trustScore:
//             p.trustScore ??
//             Math.floor(90 + Math.random() * 9 + (p.quantity % 3)),
//         }));

//         setProducts(scoredProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   // ✅ Handle order placement
//   const handleConfirmOrder = async () => {
//     if (!selectedProduct) return;
//     if (quantity <= 0 || quantity > selectedProduct.quantity) {
//       toast({
//         title: "⚠️ Invalid Quantity",
//         description: `Please select a valid quantity (1–${selectedProduct.quantity}).`,
//         variant: "destructive",
//       });
//       return;
//     }

//     setBuying(true);

//     try {
//       const totalPrice = quantity * (selectedProduct.pricePerUnit || 0);

//       const res = await fetch("/api/retailer/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId: selectedProduct._id,
//           quantity,
//           shippingAddress: {
//             street: "Customer Address",
//             city: "Local City",
//             state: "Maharashtra",
//             zipCode: "400001",
//             country: "India",
//           },
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast({
//           title: "✅ Order Placed Successfully!",
//           description: `${quantity} ${selectedProduct.unit}(s) of ${selectedProduct.productName} for ₹${totalPrice.toFixed(2)}.`,
//         });

//         // ✅ Deduct purchased quantity from UI
//         setProducts((prev) =>
//           prev
//             .map((p) =>
//               p._id === selectedProduct._id
//                 ? {
//                     ...p,
//                     quantity: p.quantity - quantity,
//                     status: p.quantity - quantity > 0 ? "available" : "sold_out",
//                   }
//                 : p
//             )
//             .filter((p) => p.quantity > 0) // hide sold out
//         );

//         setSelectedProduct(null);
//         setQuantity(1);
//         setBuyDialogOpen(false);
//       } else {
//         toast({
//           title: "❌ Order Failed",
//           description: result.error || "Unable to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast({
//         title: "❌ Error",
//         description: "Something went wrong while placing your order.",
//         variant: "destructive",
//       });
//     } finally {
//       setBuying(false);
//     }
//   };

//   // ✅ Handle AI-based trust score breakdown
//   const handleTrustScoreClick = async (product: Product) => {
//     try {
//       const res = await fetch(`/api/trustscore/${product.productId || product._id}`);
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error);

//       setTrustDetails({
//         score: data.trustScore,
//         factors: data.factors,
//         product: product.productName,
//       });
//       setTrustDialogOpen(true);
//     } catch (err) {
//       console.error("Trust score fetch failed:", err);
//       alert("Failed to fetch trust score details.");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         🌿 Product Catalog
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500 py-6">Loading products...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-6">
//           No available products at the moment.
//         </p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {products.map((p) => (
//             <Card
//               key={p._id}
//               className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
//             >
//               <CardContent className="p-5 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     {p.productName}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Sold by: <span className="font-medium">{p.ownerName}</span>
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">
//                     Available:{" "}
//                     <span className="font-medium">
//                       {p.quantity} {p.unit}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Price:{" "}
//                     <span className="font-medium">
//                       ₹{p.pricePerUnit?.toFixed(2) ?? "N/A"} / {p.unit}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="flex flex-col items-center mt-2">
//                   <Button
//                     variant="outline"
//                     className="border-green-600 text-green-700 hover:bg-green-50 font-medium"
//                     onClick={() => handleTrustScoreClick(p)}
//                   >
//                     🤖 Check Trust Score
//                   </Button>
//                   <p className="text-xs text-gray-500 mt-2">
//                     AI-powered authenticity & freshness rating
//                   </p>
//                 </div>

//                 <div className="flex justify-between items-center mt-4">
//                   <Button
//                     variant="default"
//                     className="bg-green-600 hover:bg-green-700"
//                     onClick={() => {
//                       setSelectedProduct(p);
//                       setBuyDialogOpen(true);
//                     }}
//                   >
//                     Buy Now
//                   </Button>

//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       const traceId = p.productId || p._id;
//                       window.location.href = `/trace/${traceId}`;
//                     }}
//                   >
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ✅ Buy Product Dialog */}
//       <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>
//               🛒 Buy {selectedProduct?.productName}
//             </DialogTitle>
//             <DialogDescription>
//               Set your desired quantity to see the total cost.
//             </DialogDescription>
//           </DialogHeader>

//           {selectedProduct && (
//             <div className="space-y-4">
//               <p>
//                 Price per {selectedProduct.unit}:{" "}
//                 <span className="font-semibold text-green-700">
//                   ₹{selectedProduct.pricePerUnit}
//                 </span>
//               </p>

//               <Input
//                 type="number"
//                 min={1}
//                 max={selectedProduct.quantity}
//                 value={quantity}
//                 onChange={(e) => setQuantity(Number(e.target.value))}
//                 placeholder="Enter quantity"
//               />

//               <p className="font-medium">
//                 Total Price:{" "}
//                 <span className="text-green-700 font-semibold">
//                   ₹{(quantity * selectedProduct.pricePerUnit).toFixed(2)}
//                 </span>
//               </p>
//             </div>
//           )}

//           <DialogFooter>
//             <Button
//               variant="secondary"
//               onClick={() => setBuyDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleConfirmOrder}
//               disabled={buying}
//               className="bg-green-600 hover:bg-green-700 text-white"
//             >
//               {buying ? "Processing..." : "Confirm Purchase"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ✅ Trust Score Dialog (existing) */}
//       <Dialog open={trustDialogOpen} onOpenChange={setTrustDialogOpen}>
//         <DialogContent className="max-w-3xl w-full md:w-[800px] border-green-200 shadow-lg shadow-green-100 p-8 rounded-xl overflow-y-auto max-h-[90vh]">
//           {/* existing trust score section remains unchanged */}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface Product {
  _id: string;
  productId?: string;
  productName: string;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  ownerName: string;
  status: string;
  trustScore?: number;
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const [trustDialogOpen, setTrustDialogOpen] = useState(false);
  const [trustDetails, setTrustDetails] = useState<any>(null);

  const [buyDialogOpen, setBuyDialogOpen] = useState(false);

  const router = useRouter();

  // ✅ Fetch available retailer products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/customer/products");
        const data = await res.json();

        const availableProducts: Product[] = (Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : []
        ).filter((p: Product) => p.status === "available");

        const scoredProducts: Product[] = availableProducts.map((p) => ({
          ...p,
          trustScore:
            p.trustScore ??
            Math.floor(90 + Math.random() * 9 + (p.quantity % 3)),
        }));

        setProducts(scoredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // ✅ Handle order placement
  const handleConfirmOrder = async () => {
    if (!selectedProduct) return;
    if (quantity <= 0 || quantity > selectedProduct.quantity) {
      toast({
        title: "⚠️ Invalid Quantity",
        description: `Please select a valid quantity (1–${selectedProduct.quantity}).`,
        variant: "destructive",
      });
      return;
    }

    setBuying(true);

    try {
      const totalPrice = quantity * (selectedProduct.pricePerUnit || 0);

      const res = await fetch("/api/retailer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity,
          shippingAddress: {
            street: "Customer Address",
            city: "Local City",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
          },
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "✅ Order Placed Successfully!",
          description: `${quantity} ${selectedProduct.unit}(s) of ${selectedProduct.productName} for ₹${totalPrice.toFixed(
            2
          )}.`,
        });

        // update UI
        setProducts((prev) =>
          prev
            .map((p) =>
              p._id === selectedProduct._id
                ? {
                    ...p,
                    quantity: p.quantity - quantity,
                    status: p.quantity - quantity > 0 ? "available" : "sold_out",
                  }
                : p
            )
            .filter((p) => p.quantity > 0)
        );

        setSelectedProduct(null);
        setQuantity(1);
        setBuyDialogOpen(false);
      } else {
        toast({
          title: "❌ Order Failed",
          description: result.error || "Unable to place order.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "❌ Error",
        description: "Something went wrong while placing your order.",
        variant: "destructive",
      });
    } finally {
      setBuying(false);
    }
  };

  // ✅ Handle Trust Score
  const handleTrustScoreClick = async (product: Product) => {
    setTrustDetails(null); // reset previous data first
    setTrustDialogOpen(true);

    try {
      const res = await fetch(
        `/api/trustscore/${product.productId || product._id}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setTrustDetails({
        score: data.trustScore,
        factors: data.factors,
        product: product.productName,
      });
    } catch (err) {
      console.error("Trust score fetch failed:", err);
      alert("Failed to fetch trust score details.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🌿 Product Catalog
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No available products at the moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card
              key={p._id}
              className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {p.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sold by: <span className="font-medium">{p.ownerName}</span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    Available:{" "}
                    <span className="font-medium">
                      {p.quantity} {p.unit}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Price:{" "}
                    <span className="font-medium">
                      ₹{p.pricePerUnit?.toFixed(2)} / {p.unit}
                    </span>
                  </p>
                </div>

                {/* Trust Score Button */}
                <div className="flex flex-col items-center mt-2">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-50 font-medium"
                    onClick={() => handleTrustScoreClick(p)}
                  >
                    🤖 Check Trust Score
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    AI-powered authenticity & freshness rating
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setSelectedProduct(p);
                      setBuyDialogOpen(true);
                    }}
                  >
                    Buy Now
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const traceId = p.productId || p._id;
                      window.location.href = `/trace/${traceId}`;
                    }}
                  >
                    Trace
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* BUY DIALOG */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              🛒 Buy {selectedProduct?.productName}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <p>
                Price per {selectedProduct.unit}:{" "}
                <span className="font-semibold text-green-700">
                  ₹{selectedProduct.pricePerUnit}
                </span>
              </p>

              <Input
                type="number"
                min={1}
                max={selectedProduct.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

              <p className="font-medium">
                Total Price:{" "}
                <span className="text-green-700 font-semibold">
                  ₹{(quantity * selectedProduct.pricePerUnit).toFixed(2)}
                </span>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={buying}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {buying ? "Processing..." : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TRUST SCORE DIALOG */}
      <Dialog open={trustDialogOpen} onOpenChange={setTrustDialogOpen}>
        <DialogContent className="max-w-3xl w-full md:w-[800px] border-green-200 shadow-green-100 shadow-lg p-8 rounded-xl max-h-[90vh] overflow-y-auto">
          {!trustDetails ? (
            <div className="text-center py-10 text-gray-500">
              Loading AI Trust Score...
            </div>
          ) : (
            <>
              <DialogHeader className="text-center space-y-2">
                <DialogTitle className="text-2xl font-bold text-green-800 flex items-center justify-center gap-2">
                  🧠 AI Trust Report for {trustDetails.product}
                </DialogTitle>
              </DialogHeader>

              {/* Circular Score */}
              <div className="flex flex-col items-center my-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-5xl font-extrabold text-green-700">
                    {trustDetails.score}%
                  </div>
                </motion.div>
                <p className="mt-2 text-gray-600">Overall AI Confidence</p>
              </div>

              {/* Radar Chart */}
              <div className="w-full h-[300px] bg-green-50 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={trustDetails.factors}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Trust"
                      dataKey="value"
                      stroke="#15803d"
                      fill="#22c55e"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Factor Breakdown */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {trustDetails.factors.map((f: any, i: number) => (
                  <div
                    key={i}
                    className="bg-white border p-3 rounded-lg shadow-sm"
                  >
                    <p className="font-medium">{f.name}</p>
                    <Progress value={f.value} className="h-2 mt-1" />
                    <p className="mt-1 font-semibold text-green-700">
                      {f.value}%
                    </p>
                  </div>
                ))}
              </div>

              <DialogFooter className="pt-6">
                <Button
                  onClick={() => setTrustDialogOpen(false)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
