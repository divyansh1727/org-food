// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Package, ShoppingCart, TrendingUp, Users, Star } from "lucide-react"
// import { ProductCatalog } from "./product-catalog"
// import { InventoryManagement } from "./inventory-management"
// import { CustomerInquiries } from "./customer-inquiries"

// export function RetailerDashboard() {
//   const [activeTab, setActiveTab] = useState("overview")
//   const [dashboardStats, setDashboardStats] = useState<any>({
//     totalProducts: 0,
//     activeOrders: 0,
//     monthlySales: 0,
//     customerInquiries: 0,
//     averageRating: 0,
//   })
//   const [recentSales, setRecentSales] = useState<any[]>([])
//   const [topProducts, setTopProducts] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch("/api/retailer-dashboard")
//         const data = await res.json()
//         setDashboardStats(data.dashboardStats)
//         setRecentSales(data.recentSales)
//         setTopProducts(data.topProducts)
//       } catch (err) {
//         console.error("Error fetching dashboard data", err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   if (loading) {
//     return (
//       <div className="p-6">
//         <h1 className="text-xl font-bold">Loading dashboard...</h1>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* Header */}
//       <div className="bg-background border-b border-border px-6 py-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif font-bold text-foreground">
//             Retailer Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage inventory, sales, and customer relationships
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="catalog">Catalog</TabsTrigger>
//             <TabsTrigger value="inventory">Inventory</TabsTrigger>
//             <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview" className="space-y-6">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//               {/* 5 Cards */}
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Products</CardTitle>
//                   <Package className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
//                   <p className="text-xs text-muted-foreground">In catalog</p>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
//                   <ShoppingCart className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{dashboardStats.activeOrders}</div>
//                   <p className="text-xs text-muted-foreground">From distributors</p>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
//                   <TrendingUp className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     ₹{dashboardStats.monthlySales.toLocaleString()}
//                   </div>
//                   <p className="text-xs text-muted-foreground">+0% from last month</p>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Customer Inquiries</CardTitle>
//                   <Users className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{dashboardStats.customerInquiries}</div>
//                   <p className="text-xs text-muted-foreground">Pending responses</p>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
//                   <Star className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{dashboardStats.averageRating}</div>
//                   <p className="text-xs text-muted-foreground">Customer satisfaction</p>
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Recent Sales */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recent Sales</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {recentSales.length === 0 && (
//                     <p className="text-muted-foreground text-sm">
//                       No recent sales yet.
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Top Products */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Top Performing Products</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {topProducts.length === 0 && (
//                     <p className="text-muted-foreground text-sm">
//                       No top products yet.
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="catalog">
//             <ProductCatalog />
//           </TabsContent>

//           <TabsContent value="inventory">
//             <InventoryManagement />
//           </TabsContent>

//           <TabsContent value="inquiries">
//             <CustomerInquiries />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import PlaceOrder from "./place-order"
// import InventoryManagement from "./inventory-management"
// import CustomerOrders from "./customer-orders"

// export default function RetailerDashboard() {
//   const [activeTab, setActiveTab] = useState("place-order")

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* Header */}
//       <div className="bg-background border-b border-border px-6 py-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif font-bold text-foreground">Retailer Dashboard</h1>
//           <p className="text-muted-foreground mt-1">
//             Manage your stock, place orders from distributors, and handle customer orders efficiently.
//           </p>
//         </div>
//       </div>

//       {/* Main Tabs */}
//       <div className="max-w-7xl mx-auto p-6">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
//             <TabsTrigger value="place-order">Place Order</TabsTrigger>
//             <TabsTrigger value="inventory">Inventory</TabsTrigger>
//             <TabsTrigger value="customer-orders">Customer Orders</TabsTrigger>
//           </TabsList>

//           {/* Place Order */}
//           <TabsContent value="place-order">
//             <PlaceOrder />
//           </TabsContent>

//           {/* Inventory */}
//           <TabsContent value="inventory">
//             <InventoryManagement />
//           </TabsContent>

//           {/* Customer Orders */}
//           <TabsContent value="customer-orders">
//             <CustomerOrders />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Package, ShoppingCart, Users } from "lucide-react"
// import PlaceOrder from "./place-order"
// import InventoryManagement from "./inventory-management"
// import CustomerOrders from "./customer-orders"

// export default function RetailerDashboard() {
//   const [activeTab, setActiveTab] = useState("place-order")
//   const [stats, setStats] = useState({
//     inventory: 0,
//     customerOrders: 0,
//     activeOrders: 0,
//   })

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         const [inventoryRes, ordersRes] = await Promise.all([
//           fetch("/api/retailer/inventory"),
//           fetch("/api/retailer/orders"),
//         ])

//         const inventoryData = await inventoryRes.json()
//         const ordersData = await ordersRes.json()

//         setStats({
//           inventory: Array.isArray(inventoryData) ? inventoryData.length : 0,
//           customerOrders: Array.isArray(ordersData.orders)
//             ? ordersData.orders.length
//             : 0,
//           activeOrders: Array.isArray(ordersData.orders)
//             ? ordersData.orders.filter((o: any) => o.status !== "delivered")
//                 .length
//             : 0,
//         })
//       } catch (error) {
//         console.error("Error fetching retailer stats:", error)
//       }
//     }

//     fetchStats()
//   }, [])

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* ===== Header ===== */}
//       <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif font-bold text-foreground">
//             Retailer Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage your stock, track orders, and serve customers efficiently.
//           </p>
//         </div>
//       </header>

//       {/* ===== Stats Overview ===== */}
//       <section className="max-w-7xl mx-auto px-6 mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Inventory Items</p>
//               <p className="text-2xl font-semibold">{stats.inventory}</p>
//             </div>
//             <Package className="w-8 h-8 text-primary" />
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Customer Orders</p>
//               <p className="text-2xl font-semibold">{stats.customerOrders}</p>
//             </div>
//             <Users className="w-8 h-8 text-blue-500" />
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Active Orders</p>
//               <p className="text-2xl font-semibold">{stats.activeOrders}</p>
//             </div>
//             <ShoppingCart className="w-8 h-8 text-green-600" />
//           </CardContent>
//         </Card>
//       </section>

//       {/* ===== Main Tabs ===== */}
//       <main className="max-w-7xl mx-auto p-6">
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-6"
//         >
//           <TabsList className="w-full lg:w-[600px] grid grid-cols-3 mx-auto border rounded-lg bg-white shadow-sm">
//             <TabsTrigger
//               value="place-order"
//               className="text-sm font-medium py-2"
//             >
//               Place Order
//             </TabsTrigger>
//             <TabsTrigger
//               value="inventory"
//               className="text-sm font-medium py-2"
//             >
//               Inventory
//             </TabsTrigger>
//             <TabsTrigger
//               value="customer-orders"
//               className="text-sm font-medium py-2"
//             >
//               Customer Orders
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="place-order">
//             <PlaceOrder />
//           </TabsContent>

//           <TabsContent value="inventory">
//             <InventoryManagement />
//           </TabsContent>

//           <TabsContent value="customer-orders">
//             <CustomerOrders />
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   )
// }
// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Package, ShoppingCart, Users } from "lucide-react";
// import PlaceOrder from "./place-order";
// import InventoryManagement from "./inventory-management";
// import CustomerOrders from "./customer-orders";

// export default function RetailerDashboard() {
//   const [activeTab, setActiveTab] = useState("place-order");
//   const [stats, setStats] = useState({
//     inventory: 0,
//     customerOrders: 0,
//     activeOrders: 0,
//   });

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         const [inventoryRes, ordersRes] = await Promise.all([
//           fetch("/api/retailer/inventory"),
//           fetch("/api/retailer/orders"),
//         ]);

//         const inventoryData = await inventoryRes.json();
//         const ordersData = await ordersRes.json();

//         setStats({
//           inventory: Array.isArray(inventoryData) ? inventoryData.length : 0,
//           customerOrders: Array.isArray(ordersData.orders)
//             ? ordersData.orders.length
//             : 0,
//           activeOrders: Array.isArray(ordersData.orders)
//             ? ordersData.orders.filter((o: any) => o.status !== "delivered")
//                 .length
//             : 0,
//         });
//       } catch (error) {
//         console.error("Error fetching retailer stats:", error);
//       }
//     }

//     fetchStats();
//   }, []);

//   const tabs = [
//     { id: "place-order", label: "Place Order" },
//     { id: "inventory", label: "Inventory" },
//     { id: "customer-orders", label: "Customer Orders" },
//   ];

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* ===== Header ===== */}
//       <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif font-bold text-foreground">
//             Retailer Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage your stock, track orders, and serve customers efficiently.
//           </p>
//         </div>
//       </header>

//       {/* ===== Stats Overview ===== */}
//       <section className="max-w-7xl mx-auto px-6 mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Inventory Items</p>
//               <p className="text-2xl font-semibold text-emerald-900">
//                 {stats.inventory}
//               </p>
//             </div>
//             <Package className="w-8 h-8 text-emerald-700" />
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Customer Orders</p>
//               <p className="text-2xl font-semibold text-emerald-900">
//                 {stats.customerOrders}
//               </p>
//             </div>
//             <Users className="w-8 h-8 text-blue-600" />
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Active Orders</p>
//               <p className="text-2xl font-semibold text-emerald-900">
//                 {stats.activeOrders}
//               </p>
//             </div>
//             <ShoppingCart className="w-8 h-8 text-green-600" />
//           </CardContent>
//         </Card>
//       </section>

//       {/* ===== Navigation Tabs (like Manufacturer Dashboard) ===== */}
//       <nav className="max-w-7xl mx-auto mt-10 border-b border-border px-6">
//         <ul className="flex flex-wrap gap-4 sm:gap-8 text-sm font-medium text-gray-600">
//           {tabs.map((tab) => (
//             <li
//               key={tab.id}
//               className={`pb-2 cursor-pointer border-b-2 transition-colors ${
//                 activeTab === tab.id
//                   ? "border-emerald-700 text-emerald-800 font-semibold"
//                   : "border-transparent hover:text-emerald-700"
//               }`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               {tab.label}
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* ===== Main Content ===== */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {activeTab === "place-order" && <PlaceOrder />}
//         {activeTab === "inventory" && <InventoryManagement />}
//         {activeTab === "customer-orders" && <CustomerOrders />}
//       </main>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Package, ShoppingCart, Users, Star, LineChart } from "lucide-react";
// import PlaceOrder from "./place-order";
// import InventoryManagement from "./inventory-management";
// import CustomerOrders from "./customer-orders";

// export default function RetailerDashboard() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({
//     totalProducts: 0,
//     activeOrders: 0,
//     monthlySales: 0,
//     customerInquiries: 0,
//     averageRating: 0,
//     recentSales: [],
//     topProducts: [],
//   });

//   // ✅ Fetch dashboard data from /api/retailer-dashboard
//   useEffect(() => {
//     async function fetchDashboardData() {
//       try {
//         const res = await fetch("/api/retailer-dashboard");
//         const data = await res.json();
//         setDashboardData(data.dashboardStats);
//       } catch (error) {
//         console.error("Error fetching retailer dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDashboardData();
//   }, []);

//   const tabs = [
//     { id: "overview", label: "Overview" },
//     { id: "place-order", label: "Place Order" },
//     { id: "inventory", label: "Inventory" },
//     { id: "customer-orders", label: "Customer Orders" },
//   ];

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* ===== Header ===== */}
//       <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif font-bold text-foreground">
//             Retailer Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage stock, place distributor orders, and serve customers efficiently.
//           </p>
//         </div>
//       </header>

//       {/* ===== Top Navigation Tabs ===== */}
//       <nav className="bg-background border-b border-border">
//         <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-3 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === tab.id
//                   ? "border-emerald-700 text-emerald-800 font-semibold"
//                   : "border-transparent text-gray-600 hover:text-emerald-700"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* ===== Overview Section ===== */}
//       {activeTab === "overview" && (
//         <section className="max-w-7xl mx-auto px-6 mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           <Card className="bg-white shadow-sm border">
//             <CardContent className="flex items-center justify-between p-5">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Products</p>
//                 <p className="text-2xl font-semibold text-emerald-900">
//                   {loading ? "…" : dashboardData.totalProducts}
//                 </p>
//               </div>
//               <Package className="w-8 h-8 text-emerald-700" />
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-sm border">
//             <CardContent className="flex items-center justify-between p-5">
//               <div>
//                 <p className="text-sm text-muted-foreground">Active Orders</p>
//                 <p className="text-2xl font-semibold text-emerald-900">
//                   {loading ? "…" : dashboardData.activeOrders}
//                 </p>
//               </div>
//               <ShoppingCart className="w-8 h-8 text-blue-600" />
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-sm border">
//             <CardContent className="flex items-center justify-between p-5">
//               <div>
//                 <p className="text-sm text-muted-foreground">Monthly Sales</p>
//                 <p className="text-2xl font-semibold text-emerald-900">
//                   {loading ? "…" : `₹${dashboardData.monthlySales}`}
//                 </p>
//               </div>
//               <LineChart className="w-8 h-8 text-orange-600" />
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-sm border">
//             <CardContent className="flex items-center justify-between p-5">
//               <div>
//                 <p className="text-sm text-muted-foreground">Customer Inquiries</p>
//                 <p className="text-2xl font-semibold text-emerald-900">
//                   {loading ? "…" : dashboardData.customerInquiries}
//                 </p>
//               </div>
//               <Users className="w-8 h-8 text-gray-700" />
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-sm border">
//             <CardContent className="flex items-center justify-between p-5">
//               <div>
//                 <p className="text-sm text-muted-foreground">Average Rating</p>
//                 <p className="text-2xl font-semibold text-emerald-900">
//                   {loading ? "…" : dashboardData.averageRating.toFixed(1)}
//                 </p>
//               </div>
//               <Star className="w-8 h-8 text-yellow-500" />
//             </CardContent>
//           </Card>
//         </section>
//       )}

//       {/* ===== Other Sections ===== */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {activeTab === "place-order" && <PlaceOrder />}
//         {activeTab === "inventory" && <InventoryManagement />}
//         {activeTab === "customer-orders" && <CustomerOrders />}
//       </main>
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Package, ShoppingCart, Users } from "lucide-react";
// import PlaceOrder from "./place-order";
// import InventoryManagement from "./inventory-management";
// import CustomerOrders from "./customer-orders";

// export default function RetailerDashboard() {
//   const [activeTab, setActiveTab] = useState("place-order");

//   const tabs = [
//     { id: "place-order", label: "Place Order" },
//     { id: "inventory", label: "Inventory" },
//     { id: "customer-orders", label: "Customer Orders" },
//   ];

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* ===== Header ===== */}
//       <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif font-bold text-foreground">
//             Retailer Dashboard
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Manage your stock, track orders, and serve customers efficiently.
//           </p>
//         </div>
//       </header>

//       {/* ===== Top Navigation Tabs ===== */}
//       <nav className="bg-background border-b border-border">
//         <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-3 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === tab.id
//                   ? "border-emerald-700 text-emerald-800 font-semibold"
//                   : "border-transparent text-gray-600 hover:text-emerald-700"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* ===== Stats Summary (Optional, simplified) ===== */}
//       <section className="max-w-7xl mx-auto px-6 mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Inventory</p>
//               <p className="text-2xl font-semibold text-emerald-900">—</p>
//             </div>
//             <Package className="w-8 h-8 text-emerald-700" />
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Active Orders</p>
//               <p className="text-2xl font-semibold text-emerald-900">—</p>
//             </div>
//             <ShoppingCart className="w-8 h-8 text-blue-600" />
//           </CardContent>
//         </Card>

//         <Card className="bg-white shadow-sm border">
//           <CardContent className="flex items-center justify-between p-5">
//             <div>
//               <p className="text-sm text-muted-foreground">Customer Orders</p>
//               <p className="text-2xl font-semibold text-emerald-900">—</p>
//             </div>
//             <Users className="w-8 h-8 text-green-600" />
//           </CardContent>
//         </Card>
//       </section>

//       {/* ===== Main Content ===== */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {activeTab === "place-order" && <PlaceOrder />}
//         {activeTab === "inventory" && <InventoryManagement />}
//         {activeTab === "customer-orders" && <CustomerOrders />}
//       </main>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import PlaceOrder from "./place-order";
import InventoryManagement from "./inventory-management";
import CustomerOrders from "./customer-orders";

export default function RetailerDashboard() {
  const [activeTab, setActiveTab] = useState("place-order");

  const tabs = [
    { id: "place-order", label: "Place Order" },
    { id: "inventory", label: "Inventory" },
    { id: "customer-orders", label: "Customer Orders" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ===== Header ===== */}
      <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Retailer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your stock, track orders, and serve customers efficiently.
          </p>
        </div>
      </header>

      {/* ===== Top Navigation Tabs ===== */}
      <nav className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-emerald-700 text-emerald-800 font-semibold"
                  : "border-transparent text-gray-600 hover:text-emerald-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "place-order" && <PlaceOrder />}
        {activeTab === "inventory" && <InventoryManagement />}
        {activeTab === "customer-orders" && <CustomerOrders />}
      </main>
    </div>
  );
}
