import type { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;

  // Basic product details
  name: string;
  description: string;
  category: string;

  // Original farmer info
  farmerId: ObjectId;
  farmerName: string;

  // ✅ Added: permanent ownership tracking (for orders)
  ownerId: ObjectId;     // same as farmerId when farmer creates product
  ownerName: string;     // same as farmerName when farmer creates product

  // Product details
  quantity: number;
  unit: string;
  pricePerUnit: number;
  harvestDate: Date;
  expiryDate?: Date;
  certifications: string[];
  images: string[];

  // Location info
  location: {
    farm: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Traceability & growth data
  traceabilityData: {
    seedSource?: string;
    fertilizers?: string[];
    pesticides?: string[];
    irrigationMethod?: string;
    soilType?: string;
  };

  // Product status
  status: "available" | "reserved" | "sold" | "expired";

  // System timestamps
  createdAt: Date;
  updatedAt: Date;
}

