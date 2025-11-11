"use client"

import { useEffect, useState } from "react"

interface Order {
  _id: string
  orderNumber: string
  productName: string
  quantity: number
  pricePerUnit: number
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()
        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (err) {
        console.error("❌ Error fetching orders:", err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
      <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-800">
        My Orders
      </h2>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Order #</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Quantity</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4">{order.productName}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4">
                    ₹{order.totalAmount?.toFixed(2) ?? 0}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile view */}
      <div className="grid md:hidden gap-4">
        {loading ? (
          <p className="text-center text-gray-400 py-4">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {order.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Order #{order.orderNumber}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "shipped"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  Quantity: <span className="font-medium">{order.quantity}</span>
                </p>
                <p>
                  Total: ₹
                  <span className="font-medium">
                    {order.totalAmount?.toFixed(2) ?? 0}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
