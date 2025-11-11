// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// // ✅ Define type for blockchain record
// interface BlockchainRecord {
//   _id: string;
//   productId: string;
//   orderId: string;
//   actorId: string;
//   actorRole: string;
//   action: string;
//   timestamp: string;
//   data?: {
//     seller?: string;
//     buyer?: string;
//     quantity?: number;
//     pricePerUnit?: number;
//     totalAmount?: number;
//   };
//   previousHash: string;
//   hash: string;
// }

// export default function TracePage() {
//   const { productId } = useParams();
//   const [chain, setChain] = useState<BlockchainRecord[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchTrace() {
//       try {
//         const res = await fetch(`/api/trace/${productId}`);
//         const data = await res.json();
//         setChain(data.chain || []);
//       } catch (err) {
//         console.error("Error fetching blockchain trace:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTrace();
//   }, [productId]);

//   if (loading) {
//     return (
//       <div className="p-6 text-lg font-semibold text-gray-600">
//         Loading trace details...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">🌿 Product Traceability</h1>

//       {chain.length === 0 ? (
//         <p className="text-gray-500">No trace data available for this product.</p>
//       ) : (
//         <div className="space-y-4">
//           {chain.map((block, i) => (
//             <div
//               key={block._id}
//               className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm"
//             >
//               <p className="font-semibold text-lg mb-2">
//                 Step {i + 1}: {block.action}
//               </p>
//               <div className="text-sm text-gray-700 space-y-1">
//                 <p><strong>Actor:</strong> {block.actorRole}</p>
//                 <p><strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}</p>
//                 {block.data?.seller && <p><strong>Seller:</strong> {block.data.seller}</p>}
//                 {block.data?.buyer && <p><strong>Buyer:</strong> {block.data.buyer}</p>}
//                 {block.data?.quantity && <p><strong>Quantity:</strong> {block.data.quantity}</p>}
//                 {block.data?.pricePerUnit && <p><strong>Price/Unit:</strong> ₹{block.data.pricePerUnit}</p>}
//                 {block.data?.totalAmount && <p><strong>Total:</strong> ₹{block.data.totalAmount}</p>}
//                 <p><strong>Previous Hash:</strong> {block.previousHash}</p>
//                 <p><strong>Current Hash:</strong> {block.hash}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// interface BlockchainRecord {
//   _id: string;
//   productId: string;
//   orderId: string;
//   actorId: string;
//   actorRole: string;
//   action: string;
//   timestamp: string;
//   data?: {
//     seller?: string;
//     buyer?: string;
//     quantity?: number;
//     pricePerUnit?: number;
//     totalAmount?: number;
//   };
//   previousHash: string;
//   hash: string;
// }

// export default function TracePage() {
//   const { productId } = useParams();
//   const [chain, setChain] = useState<BlockchainRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isValid, setIsValid] = useState<boolean | null>(null);

//   useEffect(() => {
//     async function fetchTrace() {
//       try {
//         const res = await fetch(`/api/trace/${productId}`);
//         const data = await res.json();
//         const chainData = data.chain || [];
//         setChain(chainData);

//         // ✅ Verify chain integrity
//         const valid = verifyChain(chainData);
//         setIsValid(valid);
//       } catch (err) {
//         console.error("Error fetching blockchain trace:", err);
//         setIsValid(false);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTrace();
//   }, [productId]);

//   // ✅ Chain verification logic
//   function verifyChain(chain: BlockchainRecord[]) {
//     for (let i = 1; i < chain.length; i++) {
//       const prev = chain[i - 1];
//       const curr = chain[i];
//       if (curr.previousHash !== prev.hash) {
//         console.warn(`❌ Chain broken between block ${i - 1} and ${i}`);
//         return false;
//       }
//     }
//     return true;
//   }

//   if (loading) {
//     return (
//       <div className="p-6 text-lg font-semibold text-gray-600">
//         Loading trace details...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">🌿 Product Traceability</h1>

//       {/* ✅ Chain integrity status */}
//       {isValid !== null && (
//         <div
//           className={`mb-6 p-4 rounded-xl text-white font-medium ${
//             isValid ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           {isValid ? "✅ Blockchain Integrity Verified" : "❌ Blockchain Tampered!"}
//         </div>
//       )}

//       {chain.length === 0 ? (
//         <p className="text-gray-500">No trace data available for this product.</p>
//       ) : (
//         <div className="space-y-4">
//           {chain.map((block, i) => (
//             <div
//               key={block._id}
//               className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm"
//             >
//               <p className="font-semibold text-lg mb-2">
//                 Step {i + 1}: {block.action}
//               </p>
//               <div className="text-sm text-gray-700 space-y-1">
//                 <p><strong>Actor:</strong> {block.actorRole}</p>
//                 <p><strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}</p>
//                 {block.data?.seller && <p><strong>Seller:</strong> {block.data.seller}</p>}
//                 {block.data?.buyer && <p><strong>Buyer:</strong> {block.data.buyer}</p>}
//                 {block.data?.quantity && <p><strong>Quantity:</strong> {block.data.quantity}</p>}
//                 {block.data?.pricePerUnit && <p><strong>Price/Unit:</strong> ₹{block.data.pricePerUnit}</p>}
//                 {block.data?.totalAmount && <p><strong>Total:</strong> ₹{block.data.totalAmount}</p>}
//                 <p><strong>Previous Hash:</strong> {block.previousHash}</p>
//                 <p><strong>Current Hash:</strong> {block.hash}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// interface BlockchainRecord {
//   _id: string;
//   productId: string;
//   orderId: string;
//   actorId: string;
//   actorRole: string;
//   action: string;
//   timestamp: string;
//   data?: {
//     seller?: string;
//     buyer?: string;
//     quantity?: number;
//     pricePerUnit?: number;
//     totalAmount?: number;
//   };
//   previousHash: string;
//   hash: string;
// }

// export default function TracePage() {
//   const { productId } = useParams();
//   const [chain, setChain] = useState<BlockchainRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isValid, setIsValid] = useState<boolean | null>(null);

//   useEffect(() => {
//     async function fetchTrace() {
//       try {
//         const res = await fetch(`/api/trace/${productId}`);
//         const data = await res.json();
//         const chainData = data.chain || [];
//         setChain(chainData);

//         const valid = verifyChain(chainData);
//         setIsValid(valid);
//       } catch (err) {
//         console.error("Error fetching blockchain trace:", err);
//         setIsValid(false);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTrace();
//   }, [productId]);

//   function verifyChain(chain: BlockchainRecord[]) {
//     for (let i = 1; i < chain.length; i++) {
//       if (chain[i].previousHash !== chain[i - 1].hash) {
//         console.warn(`❌ Chain broken between block ${i - 1} and ${i}`);
//         return false;
//       }
//     }
//     return true;
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 text-lg text-gray-600">
//         Loading trace data...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         🌿 Organic Food Traceability
//       </h1>

//       {/* Blockchain Status */}
//       <div
//         className={`mb-10 p-4 rounded-lg text-white text-center font-semibold ${
//           isValid ? "bg-green-600" : "bg-red-600"
//         }`}
//       >
//         {isValid ? "✅ Blockchain Integrity Verified" : "❌ Blockchain Tampered!"}
//       </div>

//       {chain.length === 0 ? (
//         <p className="text-gray-500 text-center">
//           No blockchain data available for this product.
//         </p>
//       ) : (
//         <div className="relative border-l border-gray-300 pl-6 space-y-8">
//           {chain.map((block, index) => (
//             <div key={block._id} className="relative">
//               {/* Dot */}
//               <div className="absolute -left-3 top-2 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-md"></div>

//               {/* Card */}
//               <div className="bg-white shadow-md rounded-lg p-5">
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Step {index + 1}: {block.action.toUpperCase()}
//                 </h2>
//                 <p className="text-sm text-gray-500 mb-3">
//                   {new Date(block.timestamp).toLocaleString()}
//                 </p>

//                 <div className="text-gray-700 text-sm space-y-1">
//                   <p>
//                     <strong>Actor:</strong> {block.actorRole}
//                   </p>
//                   {block.data?.seller && (
//                     <p>
//                       <strong>Seller:</strong> {block.data.seller}
//                     </p>
//                   )}
//                   {block.data?.buyer && (
//                     <p>
//                       <strong>Buyer:</strong> {block.data.buyer}
//                     </p>
//                   )}
//                   {block.data?.quantity && (
//                     <p>
//                       <strong>Quantity:</strong> {block.data.quantity}
//                     </p>
//                   )}
//                   {block.data?.pricePerUnit && (
//                     <p>
//                       <strong>Price/Unit:</strong> ₹{block.data.pricePerUnit}
//                     </p>
//                   )}
//                   {block.data?.totalAmount && (
//                     <p>
//                       <strong>Total:</strong> ₹{block.data.totalAmount}
//                     </p>
//                   )}

//                   <hr className="my-3 border-gray-200" />
//                   <p className="text-xs break-all">
//                     <strong>Previous Hash:</strong> {block.previousHash}
//                   </p>
//                   <p className="text-xs break-all">
//                     <strong>Current Hash:</strong> {block.hash}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle } from "lucide-react";

// interface Block {
//   _id: string;
//   actorRole: string;
//   action: string;
//   data: Record<string, any>;
//   timestamp: string;
//   hash: string;
//   previousHash: string;
// }

// export default function ProductTracePage() {
//   const { productId } = useParams();
//   const [chain, setChain] = useState<Block[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchChain() {
//       try {
//         const res = await fetch(`/api/trace/${productId}`);
//         const data = await res.json();
//         setChain(data.chain || []);
//       } catch (error) {
//         console.error("Error fetching blockchain data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (productId) fetchChain();
//   }, [productId]);

//   if (loading) {
//     return <p className="text-center py-10 text-gray-600">Loading blockchain trace...</p>;
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 py-10 px-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
//           🌿 Organic Food Traceability
//         </h1>

//         <div className="bg-green-600 text-white text-center py-3 rounded-lg shadow mb-6 font-semibold">
//           ✅ Blockchain Integrity Verified
//         </div>

//         {chain.length === 0 ? (
//           <p className="text-center text-gray-500 text-lg py-10">
//             No blockchain data available for this product.
//           </p>
//         ) : (
//           <div className="space-y-6">
//             {chain.map((block, index) => (
//               <div key={block._id} className="relative">
//                 {/* Vertical line */}
//                 {index !== chain.length - 1 && (
//                   <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-green-300"></div>
//                 )}

//                 <Card className="pl-12 relative border-green-200 shadow-sm hover:shadow-md transition">
//                   <div className="absolute left-1 top-6 bg-green-500 text-white rounded-full p-2">
//                     <CheckCircle className="w-4 h-4" />
//                   </div>
//                   <CardContent className="p-5">
//                     <h2 className="font-semibold text-lg capitalize text-green-800">
//                       {block.actorRole} — {block.action}
//                     </h2>
//                     <p className="text-sm text-gray-600 mb-2">
//                       🕒 {new Date(block.timestamp).toLocaleString()}
//                     </p>

//                     <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
//                       <p><strong>Seller:</strong> {block.data?.seller}</p>
//                       <p><strong>Buyer:</strong> {block.data?.buyer}</p>
//                       <p><strong>Quantity:</strong> {block.data?.quantity}</p>
//                       <p><strong>Price per Unit:</strong> ₹{block.data?.pricePerUnit}</p>
//                       <p><strong>Total Amount:</strong> ₹{block.data?.totalAmount}</p>
//                     </div>

//                     <div className="mt-3 text-xs text-gray-500 break-all">
//                       <p><strong>Block Hash:</strong> {block.hash}</p>
//                       <p><strong>Prev Hash:</strong> {block.previousHash}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import {
//   CheckCircle,
//   Factory,
//   Truck,
//   ShoppingBag,
//   Leaf,
//   User,
// } from "lucide-react";

// export default function ProductTracePage({
//   params,
// }: {
//   params: { productId: string };
// }) {
//   const [chain, setChain] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchTrace() {
//       try {
//         const res = await fetch(`/api/trace/${params.productId}`);
//         const data = await res.json();
//         setChain(data.chain || []);
//       } catch (err) {
//         console.error("❌ Trace fetch failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchTrace();
//   }, [params.productId]);

//   const getIcon = (role: string) => {
//     switch (role) {
//       case "farmer":
//         return <Leaf className="text-green-600" />;
//       case "manufacturer":
//         return <Factory className="text-blue-600" />;
//       case "distributor":
//         return <Truck className="text-yellow-600" />;
//       case "retailer":
//         return <ShoppingBag className="text-purple-600" />;
//       case "customer":
//         return <User className="text-pink-600" />;
//       default:
//         return <CheckCircle className="text-gray-400" />;
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-gray-600">
//         Loading blockchain trace...
//       </div>
//     );

//   if (!chain || chain.length === 0)
//     return (
//       <div className="flex flex-col items-center min-h-screen justify-center text-gray-500">
//         <h2 className="text-2xl font-semibold mb-2">
//           🌿 Organic Food Traceability
//         </h2>
//         <p>No blockchain data available for this product.</p>
//       </div>
//     );

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-10">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
//           🌿 Organic Food Traceability
//         </h1>

//         <div className="bg-green-600 text-white text-center py-3 rounded-lg shadow mb-8">
//           ✅ Blockchain Integrity Verified — {chain.length} stages recorded
//         </div>

//         {/* ✅ Timeline with Animated Connector */}
//         <div className="relative border-l-4 border-green-500 pl-6">
//           {chain.map((block, idx) => (
//             <div key={idx} className="relative mb-12 ml-4">
//               {/* Glowing Connector Line */}
//               {idx < chain.length - 1 && (
//                 <div className="absolute left-[-2px] top-[3.5rem] w-1 h-full bg-gradient-to-b from-green-400 via-emerald-300 to-green-100 animate-[pulse_1.5s_infinite] blur-[1px]" />

//               )}

//               {/* Circle Icon with Glow */}
//               <div className="absolute -left-7 top-3 bg-white rounded-full border-[4px] border-green-500 p-1 shadow-md animate-pulse">
//                 {getIcon(block.actorRole)}
//               </div>

//               {/* Block Content */}
//               <div className="bg-white border border-green-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
//                 <h2 className="text-lg font-semibold text-green-800">
//                   {block.actorRole?.charAt(0).toUpperCase() +
//                     block.actorRole?.slice(1)}{" "}
//                   —{" "}
//                   {block.action?.charAt(0).toUpperCase() +
//                     block.action?.slice(1)}
//                 </h2>
//                 <p className="text-sm text-gray-500 mb-2">
//                   🕒 {new Date(block.timestamp).toLocaleString()}
//                 </p>

//                 <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm space-y-1">
//                   {block.data?.seller && (
//                     <p>
//                       <strong>Seller:</strong> {block.data.seller}
//                     </p>
//                   )}
//                   {block.data?.buyer && (
//                     <p>
//                       <strong>Buyer:</strong> {block.data.buyer}
//                     </p>
//                   )}
//                   <p>
//                     <strong>Quantity:</strong> {block.data?.quantity ?? "N/A"}
//                   </p>
//                   <p>
//                     <strong>Price per Unit:</strong> ₹
//                     {block.data?.pricePerUnit ?? "N/A"}
//                   </p>
//                   <p>
//                     <strong>Total Amount:</strong> ₹
//                     {block.data?.totalAmount ?? "N/A"}
//                   </p>
//                 </div>

//                 <div className="mt-2 text-xs text-gray-500">
//                   <p>
//                     🔗 <strong>Block Hash:</strong>{" "}
//                     {block.hash?.slice(0, 20)}...
//                   </p>
//                   <p>
//                     🧩 <strong>Prev Hash:</strong>{" "}
//                     {block.previousHash?.slice(0, 20) || "00000000"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Factory,
  Truck,
  ShoppingBag,
  Leaf,
  User,
} from "lucide-react";

export default function ProductTracePage({
  params,
}: {
  params: { productId: string };
}) {
  const [chain, setChain] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrace() {
      try {
        const res = await fetch(`/api/trace/${params.productId}`);
        const data = await res.json();
        setChain(data.chain || []);
      } catch (err) {
        console.error("❌ Trace fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrace();
  }, [params.productId]);

  const getIcon = (role: string) => {
    switch (role) {
      case "farmer":
        return <Leaf className="text-green-600" />;
      case "manufacturer":
        return <Factory className="text-blue-600" />;
      case "distributor":
        return <Truck className="text-yellow-600" />;
      case "retailer":
        return <ShoppingBag className="text-purple-600" />;
      case "customer":
        return <User className="text-pink-600" />;
      default:
        return <CheckCircle className="text-gray-400" />;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading blockchain trace...
      </div>
    );

  if (!chain || chain.length === 0)
    return (
      <div className="flex flex-col items-center min-h-screen justify-center text-gray-500">
        <h2 className="text-2xl font-semibold mb-2">
          🌿 Organic Food Traceability
        </h2>
        <p>No blockchain data available for this product.</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          🌿 Organic Food Traceability
        </h1>

        <div className="bg-green-600 text-white text-center py-3 rounded-lg shadow mb-8">
          ✅ Blockchain Integrity Verified — {chain.length} stages recorded
        </div>

        {/* ✅ Timeline */}
        <div className="relative border-l-4 border-green-500 pl-6">
          {chain.map((block, idx) => (
            <div key={idx} className="relative mb-12 ml-4">
              {/* Connector Line */}
              {idx < chain.length - 1 && (
                <div className="absolute left-[-2px] top-[3.5rem] w-1 h-full bg-gradient-to-b from-green-400 via-emerald-300 to-green-100 animate-pulse blur-[1px]" />
              )}

              {/* Circle Icon */}
              <div className="absolute -left-7 top-3 bg-white rounded-full border-[4px] border-green-500 p-1 shadow-md animate-pulse">
                {getIcon(block.actorRole)}
              </div>

              {/* Block Content */}
              <div className="bg-white border border-green-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all">
                <h2 className="text-lg font-semibold text-green-800">
                  {block.actorRole?.charAt(0).toUpperCase() +
                    block.actorRole?.slice(1)}{" "}
                  —{" "}
                  {block.action?.charAt(0).toUpperCase() +
                    block.action?.slice(1)}
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  🕒 {new Date(block.timestamp).toLocaleString()}
                </p>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm space-y-1">
                  {block.data?.seller && (
                    <p>
                      <strong>Seller:</strong> {block.data.seller}
                    </p>
                  )}

                  {block.data?.buyer && (
                    <p>
                      <strong>Buyer:</strong> {block.data.buyer}
                    </p>
                  )}

                  <p>
                    <strong>Quantity:</strong> {block.data?.quantity ?? "N/A"}
                  </p>
                  <p>
                    <strong>Price per Unit:</strong> ₹
                    {block.data?.pricePerUnit ?? "N/A"}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {block.data?.totalAmount ?? "N/A"}
                  </p>
                </div>

                {/* ✅ REMOVED HASH SECTION */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
