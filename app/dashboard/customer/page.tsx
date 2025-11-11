// import CustomerDashboard from "@/components/customer/customer-dashboard"

// export default function CustomerDashboardPage() {
//   return (
//     <main className="min-h-screen bg-background">
//       <CustomerDashboard />
//     </main>
//   )
// }
// "use client";

// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ProductCatalog from "@/components/customer/product-catalog";
// import CustomerOrders from "@/components/customer/order";
// import ProductTrace from "@/components/customer/product-trace";

// export default function CustomerDashboardPage() {
//   const [activeTab, setActiveTab] = useState("catalog");

//   return (
//     <main className="min-h-screen bg-gray-50 py-10 px-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-gray-800">
//           👤 Customer Dashboard
//         </h1>

//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="bg-white shadow-md rounded-xl border border-gray-100 p-4"
//         >
//           {/* Tab Buttons */}
//           <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 rounded-lg">
//             <TabsTrigger
//               value="catalog"
//               className={`py-2 text-sm font-medium ${
//                 activeTab === "catalog" ? "bg-white shadow" : ""
//               }`}
//             >
//               🛒 Product Catalog
//             </TabsTrigger>
//             <TabsTrigger
//               value="orders"
//               className={`py-2 text-sm font-medium ${
//                 activeTab === "orders" ? "bg-white shadow" : ""
//               }`}
//             >
//               📦 My Orders
//             </TabsTrigger>
//             <TabsTrigger
//               value="trace"
//               className={`py-2 text-sm font-medium ${
//                 activeTab === "trace" ? "bg-white shadow" : ""
//               }`}
//             >
//               🔗 Product Trace
//             </TabsTrigger>
//           </TabsList>

//           {/* Tabs Content */}
//           <TabsContent value="catalog">
//             <ProductCatalog />
//           </TabsContent>

//           <TabsContent value="orders">
//             <CustomerOrders />
//           </TabsContent>

//           <TabsContent value="trace">
//             <ProductTrace />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </main>
//   );
// }
// "use client";

// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ProductCatalog from "@/components/customer/product-catalog";
// import CustomerOrders from "@/components/customer/order";
// import ProductTrace from "@/components/customer/product-trace";

// export default function CustomerDashboardPage(): JSX.Element {
//   const [activeTab, setActiveTab] = useState<string>("catalog");

//   return (
//     <main className="min-h-screen bg-gray-50 py-10 px-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <h1 className="text-3xl font-bold mb-8 text-gray-800">
//           👤 Customer Dashboard
//         </h1>

//         {/* Tabs Wrapper */}
//         <Tabs
//           value={activeTab}
//           onValueChange={(val: string) => setActiveTab(val)}
//           className="bg-white shadow-md rounded-xl border border-gray-100 p-4"
//         >
//           {/* Tabs Navigation */}
//           <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 rounded-lg">
//             <TabsTrigger
//               value="catalog"
//               className={`py-2 text-sm font-medium transition ${
//                 activeTab === "catalog"
//                   ? "bg-white shadow text-gray-900"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               🛒 Product Catalog
//             </TabsTrigger>

//             <TabsTrigger
//               value="orders"
//               className={`py-2 text-sm font-medium transition ${
//                 activeTab === "orders"
//                   ? "bg-white shadow text-gray-900"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               📦 My Orders
//             </TabsTrigger>

//             <TabsTrigger
//               value="trace"
//               className={`py-2 text-sm font-medium transition ${
//                 activeTab === "trace"
//                   ? "bg-white shadow text-gray-900"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               🔗 Product Trace
//             </TabsTrigger>
//           </TabsList>

//           {/* Tabs Content */}
//           <TabsContent value="catalog">
//             <ProductCatalog />
//           </TabsContent>

//           <TabsContent value="orders">
//             <CustomerOrders />
//           </TabsContent>

//           <TabsContent value="trace">
//             <ProductTrace />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCatalog from "@/components/customer/product-catalog";
import CustomerOrders from "@/components/customer/order";
// ❌ Removed ProductTrace import
// import ProductTrace from "@/components/customer/product-trace";

export default function CustomerDashboardPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("catalog");

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          👤 Customer Dashboard
        </h1>

        {/* Tabs Wrapper */}
        <Tabs
          value={activeTab}
          onValueChange={(val: string) => setActiveTab(val)}
          className="bg-white shadow-md rounded-xl border border-gray-100 p-4"
        >
          {/* Tabs Navigation */}
          {/* 🟢 Changed grid-cols-3 → grid-cols-2 */}
          <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 rounded-lg">
            <TabsTrigger
              value="catalog"
              className={`py-2 text-sm font-medium transition ${
                activeTab === "catalog"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🛒 Product Catalog
            </TabsTrigger>

            <TabsTrigger
              value="orders"
              className={`py-2 text-sm font-medium transition ${
                activeTab === "orders"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📦 My Orders
            </TabsTrigger>

            {/* ❌ Removed Product Trace Tab */}
            {/*
            <TabsTrigger
              value="trace"
              className={`py-2 text-sm font-medium transition ${
                activeTab === "trace"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🔗 Product Trace
            </TabsTrigger>
            */}
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="catalog">
            <ProductCatalog />
          </TabsContent>

          <TabsContent value="orders">
            <CustomerOrders />
          </TabsContent>

          {/* ❌ Removed Product Trace Content */}
          {/*
          <TabsContent value="trace">
            <ProductTrace />
          </TabsContent>
          */}
        </Tabs>
      </div>
    </main>
  );
}
