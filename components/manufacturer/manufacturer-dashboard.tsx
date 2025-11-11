"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart } from "lucide-react"
import { ProductSourcing } from "./product-sourcing"
import { OrderManagement } from "./order-management"
import { DistributorOrders } from "./distributor-orders"

export function ManufacturerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardStats, setDashboardStats] = useState({
    activeOrders: 0,
    totalProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch manufacturer orders (to/from farmers)
        const ordersRes = await fetch("/api/orders", { credentials: "include" })
        const ordersData = await ordersRes.json()

        // Fetch distributor→manufacturer orders
        const distributorRes = await fetch("/api/manufacturer/distributor-orders", { credentials: "include" })
        const distributorData = await distributorRes.json()

        // Fetch products
        const productsRes = await fetch("/api/products", { credentials: "include" })
        const productsData = await productsRes.json()

        // Combine all orders related to this manufacturer
        const allOrders = [
          ...(ordersData.orders || []),
          ...(distributorData.orders || []),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        const activeOrdersCount = allOrders.filter(
          (o) => o.status === "pending" || o.status === "confirmed"
        ).length

        setDashboardStats({
          activeOrders: activeOrdersCount,
          totalProducts: productsData.products?.length || 0,
        })

        setRecentOrders(allOrders.slice(0, 5))
      } catch (error) {
        console.error("Dashboard data load error:", error)
        setDashboardStats({ activeOrders: 0, totalProducts: 0 })
        setRecentOrders([])
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Manufacturer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage sourcing from farmers and distributor orders
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="distributor">Distributor Orders</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.activeOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Pending & confirmed orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Manufactured products</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{order.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              Buyer: {order.buyerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.quantity} {order.unit}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge
                              variant={
                                order.status === "pending"
                                  ? "secondary"
                                  : order.status === "confirmed"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No recent orders
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SOURCING TAB */}
          <TabsContent value="sourcing">
            <ProductSourcing />
          </TabsContent>

          {/* MANUFACTURER -> FARMER ORDERS */}
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          {/* DISTRIBUTOR -> MANUFACTURER ORDERS */}
          <TabsContent value="distributor">
            <DistributorOrders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
