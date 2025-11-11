"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, PackageSearch } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TraceRecord {
  _id: string;
  productId: string;
  orderId: string;
  stage: "farm" | "processing" | "distribution" | "retail" | "customer";
  actorName: string;
  actorRole: string;
  action: string;
  description: string;
  verificationStatus: string;
  location: {
    name: string;
    address: string;
  };
  createdAt: string;
}

export default function ProductTrace() {
  const [traceRecords, setTraceRecords] = useState<TraceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // ✅ Fetch all traceable products (unique product IDs with names)
  const [availableProducts, setAvailableProducts] = useState<
    { productId: string; productName: string }[]
  >([]);

  useEffect(() => {
    async function fetchAvailableTraces() {
      try {
        const res = await fetch("/api/traceability/products");
        const data = await res.json();
        setAvailableProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching traceable products:", error);
      }
    }
    fetchAvailableTraces();
  }, []);

  // ✅ Fetch product trace when product selected
  useEffect(() => {
    if (!selectedProduct) return;
    async function fetchTrace() {
      setLoading(true);
      try {
        const res = await fetch(`/api/traceability/${selectedProduct}`);
        const data = await res.json();
        setTraceRecords(data.records || []);
      } catch (error) {
        console.error("Error fetching product trace:", error);
        setTraceRecords([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrace();
  }, [selectedProduct]);

  const handleTraceRefresh = async () => {
    if (!selectedProduct) return;
    toast({ title: "Refreshing trace data..." });
    await new Promise((r) => setTimeout(r, 500));
    setSelectedProduct(selectedProduct);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        🔗 Product Traceability
      </h2>

      {/* Product Selector */}
      <div className="mb-6 flex gap-3 items-center">
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select a product to trace</option>
          {availableProducts.map((p) => (
            <option key={p.productId} value={p.productId}>
              {p.productName}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          onClick={handleTraceRefresh}
          disabled={!selectedProduct}
        >
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          Loading trace records...
        </div>
      ) : !selectedProduct ? (
        <p className="text-center text-gray-500 py-8">
          Select a product above to view its trace history.
        </p>
      ) : traceRecords.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No traceability data found for this product.
        </p>
      ) : (
        <div className="space-y-6">
          {traceRecords.map((record, idx) => (
            <Card
              key={record._id || idx}
              className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PackageSearch className="text-green-600" size={22} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {record.stage.charAt(0).toUpperCase() +
                          record.stage.slice(1)}{" "}
                        Stage
                      </h3>
                      <p className="text-sm text-gray-600">
                        Action: <span className="font-medium">{record.action}</span>
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      record.verificationStatus === "verified"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {record.verificationStatus}
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <p>
                    <strong>Actor:</strong> {record.actorName} (
                    {record.actorRole})
                  </p>
                  <p>
                    <strong>Description:</strong> {record.description}
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin size={14} /> {record.location.name},{" "}
                    {record.location.address}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

