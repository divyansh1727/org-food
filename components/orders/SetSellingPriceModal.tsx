"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Props {
  orderId: string;
  currentPrice?: number;
  onSuccess?: () => void;
}

/**
 * SetSellingPriceModal
 * --------------------
 * Used by sellers (manufacturer/distributor/retailer)
 * when marking an order as "shipped".
 * Allows input of pricePerUnit and sends PATCH request to /api/orders/[id].
 */
export function SetSellingPriceModal({ orderId, currentPrice = 0, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(currentPrice || 0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth-token");
  };

  async function handleShipOrder() {
    if (!price || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price per unit before shipping.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: "shipped",
          pricePerUnit: Number(price),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to ship order");

      toast({
        title: "Order Shipped ✅",
        description: `Selling price set to ₹${price}/unit`,
      });

      setOpen(false);
      if (onSuccess) onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-center">
          🚚 Ship Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Selling Price</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <label className="text-sm font-medium">Enter Selling Price (₹ per unit)</label>
          <Input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="e.g., 50"
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleShipOrder} disabled={loading}>
              {loading ? "Shipping…" : "Confirm & Ship"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
