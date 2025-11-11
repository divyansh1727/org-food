// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Search, Eye, Star, Leaf, ShoppingCart, MapPin, Calendar } from "lucide-react"

// interface CustomerProduct {
//   id: string
//   name: string
//   retailer: string
//   price: number
//   rating: number
//   trustScore: number
//   certifications: string[]
//   description: string
//   category: string
//   inStock: boolean
//   traceability: {
//     farmer: string
//     farmerLocation: string
//     distributor: string
//     harvestDate: string
//     qualityScore: number
//     blockchainHash: string
//     aiTrustFactors: string[]
//   }
//   image?: string
// }

// export function CustomerPortal() {
//   const [products, setProducts] = useState<CustomerProduct[]>([
//     {
//       id: "CUST-001",
//       name: "Fresh Tomatoes",
//       retailer: "Fresh Market Chain",
//       price: 45,
//       rating: 4.8,
//       trustScore: 96,
//       certifications: ["Organic", "Pesticide-Free", "Fresh Harvest"],
//       description: "Premium organic tomatoes grown in Punjab with natural farming methods",
//       category: "Fresh Produce",
//       inStock: true,
//       traceability: {
//         farmer: "Green Valley Farm",
//         farmerLocation: "Ludhiana, Punjab",
//         distributor: "Fresh Distribution Co.",
//         harvestDate: "2025-08-20",
//         qualityScore: 94,
//         blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
//         aiTrustFactors: [
//           "Verified organic certification",
//           "Consistent quality metrics",
//           "Transparent supply chain",
//           "Sustainable farming practices",
//           "No pesticide residues detected",
//         ],
//       },
//     },
//     {
//       id: "CUST-002",
//       name: "Fresh Potatoes",
//       retailer: "Organic Foods Store",
//       price: 32,
//       rating: 4.6,
//       trustScore: 94,
//       certifications: ["Organic", "High Quality", "Fresh Harvest"],
//       description: "Fresh organic potatoes from Maharashtra with excellent texture and taste",
//       category: "Fresh Produce",
//       inStock: true,
//       traceability: {
//         farmer: "Sunny Acres Farm",
//         farmerLocation: "Nashik, Maharashtra",
//         distributor: "Healthy Foods Distribution",
//         harvestDate: "2025-08-18",
//         qualityScore: 92,
//         blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890ab",
//         aiTrustFactors: [
//           "Premium potato variety",
//           "Cold-chain maintained",
//           "Fresh harvest quality",
//           "High nutritional content",
//           "Sustainable packaging",
//         ],
//       },
//     },
//     {
//       id: "CUST-003",
//       name: "Fresh Brinjal",
//       retailer: "Healthy Living Market",
//       price: 58,
//       rating: 4.4,
//       trustScore: 92,
//       certifications: ["Organic", "Premium Quality", "Fresh Harvest"],
//       description: "Fresh organic brinjal from Karnataka farms with rich flavor and nutrients",
//       category: "Fresh Produce",
//       inStock: true,
//       traceability: {
//         farmer: "Leafy Greens Co.",
//         farmerLocation: "Bangalore, Karnataka",
//         distributor: "Organic Supply Chain",
//         harvestDate: "2025-08-19",
//         qualityScore: 90,
//         blockchainHash: "0x3c4d5e6f7890abcdef1234567890abcd",
//         aiTrustFactors: [
//           "Premium variety selection",
//           "Consistent quality maintained",
//           "Natural farming methods",
//           "No artificial treatments",
//           "Eco-friendly packaging",
//         ],
//       },
//     },
//   ])

//   const [searchTerm, setSearchTerm] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("all")
//   const [certificationFilter, setCertificationFilter] = useState("all")
//   const [selectedProduct, setSelectedProduct] = useState<CustomerProduct | null>(null)
//   const [isTraceabilityDialogOpen, setIsTraceabilityDialogOpen] = useState(false)

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
//     const matchesCertification =
//       certificationFilter === "all" ||
//       product.certifications.some((cert) => cert.toLowerCase().includes(certificationFilter.toLowerCase()))
//     return matchesSearch && matchesCategory && matchesCertification
//   })

//   const handleViewTraceability = (product: CustomerProduct) => {
//     setSelectedProduct(product)
//     setIsTraceabilityDialogOpen(true)
//   }

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* Header */}
//       <div className="bg-background border-b border-border px-6 py-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif font-bold text-foreground">Trust Trace Marketplace</h1>
//           <p className="text-muted-foreground mt-1">Discover the journey of your fresh vegetables from farm to table</p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Search and Filters */}
//         <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
//           <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search vegetables..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 w-full md:w-[300px]"
//               />
//             </div>
//             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <SelectValue placeholder="All Categories" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 <SelectItem value="Fresh Produce">Fresh Produce</SelectItem>
//                 <SelectItem value="Vegetables">Vegetables</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={certificationFilter} onValueChange={setCertificationFilter}>
//               <SelectTrigger className="w-full md:w-[180px]">
//                 <SelectValue placeholder="All Certifications" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Certifications</SelectItem>
//                 <SelectItem value="organic">Organic</SelectItem>
//                 <SelectItem value="pesticide-free">Pesticide-Free</SelectItem>
//                 <SelectItem value="fresh">Fresh Harvest</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProducts.map((product) => (
//             <Card key={product.id} className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-lg">{product.name}</CardTitle>
//                     <p className="text-sm text-muted-foreground">{product.retailer}</p>
//                   </div>
//                   <Badge variant={product.inStock ? "default" : "secondary"}>
//                     {product.inStock ? "In Stock" : "Out of Stock"}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <p className="text-sm text-muted-foreground">{product.description}</p>

//                 <div className="flex items-center justify-between">
//                   <div className="text-2xl font-bold">₹{product.price}/kg</div>
//                   <div className="flex items-center gap-1">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span className="font-medium">{product.rating}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-1">
//                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                     <span className="text-sm font-medium">Trust Score: {product.trustScore}%</span>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-sm text-muted-foreground mb-2">Certifications</p>
//                   <div className="flex flex-wrap gap-1">
//                     {product.certifications.map((cert, index) => (
//                       <Badge key={index} variant="outline" className="text-xs">
//                         <Leaf className="h-2 w-2 mr-1" />
//                         {cert}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex space-x-2">
//                   <Button size="sm" className="flex-1" disabled={!product.inStock}>
//                     <ShoppingCart className="h-3 w-3 mr-1" />
//                     {product.inStock ? "Add to Cart" : "Notify Me"}
//                   </Button>
//                   <Button size="sm" variant="outline" onClick={() => handleViewTraceability(product)}>
//                     <Eye className="h-3 w-3 mr-1" />
//                     Trace
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {filteredProducts.length === 0 && (
//           <Card>
//             <CardContent className="text-center py-8">
//               <p className="text-muted-foreground">No vegetables found matching your criteria.</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Traceability Dialog */}
//         <Dialog open={isTraceabilityDialogOpen} onOpenChange={setIsTraceabilityDialogOpen}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Complete Vegetable Journey</DialogTitle>
//             </DialogHeader>
//             {selectedProduct && (
//               <div className="space-y-6">
//                 <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
//                   <h3 className="font-semibold text-xl">{selectedProduct.name}</h3>
//                   <p className="text-muted-foreground mt-1">{selectedProduct.description}</p>
//                   <div className="flex items-center gap-4 mt-3">
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span className="font-medium">{selectedProduct.rating} rating</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span className="font-medium">{selectedProduct.trustScore}% trust score</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h4 className="font-semibold text-lg">Supply Chain Journey</h4>

//                   <div className="space-y-4">
//                     <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
//                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <span className="text-green-600 font-bold">1</span>
//                       </div>
//                       <div className="flex-1">
//                         <h5 className="font-medium text-lg">Farm Origin</h5>
//                         <p className="text-muted-foreground">{selectedProduct.traceability.farmer}</p>
//                         <div className="flex items-center gap-1 mt-1">
//                           <MapPin className="h-3 w-3 text-muted-foreground" />
//                           <span className="text-sm text-muted-foreground">
//                             {selectedProduct.traceability.farmerLocation}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-1 mt-1">
//                           <Calendar className="h-3 w-3 text-muted-foreground" />
//                           <span className="text-sm text-muted-foreground">
//                             Harvested: {selectedProduct.traceability.harvestDate}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
//                       <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <span className="text-purple-600 font-bold">2</span>
//                       </div>
//                       <div className="flex-1">
//                         <h5 className="font-medium text-lg">Distribution</h5>
//                         <p className="text-muted-foreground">{selectedProduct.traceability.distributor}</p>
//                         <p className="text-sm text-muted-foreground mt-1">Cold chain maintained throughout transport</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
//                       <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <span className="text-orange-600 font-bold">3</span>
//                       </div>
//                       <div className="flex-1">
//                         <h5 className="font-medium text-lg">Retail</h5>
//                         <p className="text-muted-foreground">{selectedProduct.retailer}</p>
//                         <p className="text-sm text-muted-foreground mt-1">Available for purchase</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <h4 className="font-semibold">Blockchain Verification</h4>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <p className="text-sm text-muted-foreground mb-2">Blockchain Hash</p>
//                       <p className="font-mono text-xs break-all">{selectedProduct.traceability.blockchainHash}</p>
//                       <Badge variant="outline" className="mt-2">
//                         ✓ Verified on Blockchain
//                       </Badge>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <h4 className="font-semibold">AI Trust Factors</h4>
//                     <div className="space-y-2">
//                       {selectedProduct.traceability.aiTrustFactors.map((factor, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                           <span className="text-sm">{factor}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <h4 className="font-semibold text-green-800">Certifications Verified</h4>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {selectedProduct.certifications.map((cert, index) => (
//                       <Badge key={index} variant="outline" className="bg-white">
//                         <Leaf className="h-3 w-3 mr-1" />
//                         {cert}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useEffect, useState } from "react"
// import { Star } from "lucide-react"

// interface Product {
//   _id: string
//   productName: string
//   ownerName: string
//   pricePerUnit: number
//   unit: string
//   trustScore: number
//   description?: string
//   status: string
// }

// export default function CustomerDashboard() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchRetailerProducts() {
//       try {
//         const res = await fetch("/api/customer/retailer-products")
//         const data = await res.json()
//         setProducts(Array.isArray(data) ? data : data.products || [])
//       } catch (error) {
//         console.error("Error fetching retailer products:", error)
//         setProducts([])
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchRetailerProducts()
//   }, [])

//   return (
//     <div className="min-h-screen bg-muted/30">
//       {/* ===== Header ===== */}
//       <header className="bg-background border-b border-border px-8 py-6">
//         <h1 className="text-3xl font-serif font-bold text-foreground">
//           Trust Trace Marketplace
//         </h1>
//         <p className="text-muted-foreground mt-1">
//           Discover the journey of your fresh vegetables — from farm to table.
//         </p>
//       </header>

//       {/* ===== Product Grid ===== */}
//       <main className="max-w-7xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {loading ? (
//           <p className="col-span-full text-center text-muted-foreground py-10">
//             Loading products…
//           </p>
//         ) : products.length === 0 ? (
//           <p className="col-span-full text-center text-muted-foreground py-10">
//             No products found in retailer inventory.
//           </p>
//         ) : (
//           products.map((p) => (
//             <div
//               key={p._id}
//               className="bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
//             >
//               <div className="p-6 space-y-3">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-semibold text-foreground">
//                     {p.productName}
//                   </h2>
//                   <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
//                     In Stock
//                   </span>
//                 </div>

//                 <p className="text-sm text-muted-foreground">
//                   Sold by {p.ownerName || "Retailer"}
//                 </p>

//                 <p className="text-base text-muted-foreground line-clamp-2">
//                   {p.description || "Fresh organic produce from local farms."}
//                 </p>

//                 <p className="text-2xl font-bold text-emerald-700">
//                   ₹{p.pricePerUnit || 0}/{p.unit || "kg"}
//                 </p>

//                 {/* Trust Score and Rating */}
//                 <div className="flex justify-between items-center text-sm mt-2">
//                   <div className="flex items-center gap-1 text-yellow-600">
//                     <Star className="w-4 h-4 fill-yellow-400" /> 
//                     <span>{(p.trustScore || 90).toFixed(0)}%</span>
//                   </div>
//                   <span className="text-emerald-700 font-medium">
//                     Trust Score
//                   </span>
//                 </div>

//                 {/* Certifications (Mock Example) */}
//                 <div className="mt-3 text-xs text-muted-foreground space-x-3">
//                   <span className="inline-block">🌿 Organic</span>
//                   <span className="inline-block">✅ Verified Source</span>
//                   <span className="inline-block">🥬 Fresh Harvest</span>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-between items-center pt-4">
//                   <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-4 rounded-lg text-sm">
//                     🛒 Add to Cart
//                   </button>
//                   <button className="border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white font-medium py-2 px-4 rounded-lg text-sm">
//                     🔗 Trace
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </main>
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface Product {
  _id: string
  productName: string
  ownerId: string
  ownerName: string
  pricePerUnit: number
  unit: string
  trustScore: number
  description?: string
  status: string
}

export default function CustomerDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRetailerProducts() {
      try {
        const res = await fetch("/api/customer/retailer-products")
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : data.products || [])
      } catch (error) {
        console.error("Error fetching retailer products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchRetailerProducts()
  }, [])

  // 🟢 Handle Buy Now
  async function handleBuyNow(product: Product) {
    try {
      setBuying(product._id)

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1, // default to 1 for now
          shippingAddress: {
            street: "Customer Address",
            city: "Local City",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
          },
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(`✅ Order placed successfully for ${product.productName}!`)
      } else {
        alert(`❌ Failed to place order: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error buying product:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setBuying(null)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ===== Header ===== */}
      <header className="bg-background border-b border-border px-8 py-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Trust Trace Marketplace
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover the journey of your fresh vegetables — from farm to table.
        </p>
      </header>

      {/* ===== Product Grid ===== */}
      <main className="max-w-7xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-muted-foreground py-10">
            Loading products…
          </p>
        ) : products.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-10">
            No products found in retailer inventory.
          </p>
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-foreground">
                    {p.productName}
                  </h2>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
                    In Stock
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Sold by {p.ownerName || "Retailer"}
                </p>

                <p className="text-base text-muted-foreground line-clamp-2">
                  {p.description || "Fresh organic produce from local farms."}
                </p>

                <p className="text-2xl font-bold text-emerald-700">
                  ₹{p.pricePerUnit || 0}/{p.unit || "kg"}
                </p>

                {/* Trust Score */}
                <div className="flex justify-between items-center text-sm mt-2">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4 fill-yellow-400" /> 
                    <span>{(p.trustScore || 90).toFixed(0)}%</span>
                  </div>
                  <span className="text-emerald-700 font-medium">
                    Trust Score
                  </span>
                </div>

                <div className="mt-3 text-xs text-muted-foreground space-x-3">
                  <span className="inline-block">🌿 Organic</span>
                  <span className="inline-block">✅ Verified Source</span>
                  <span className="inline-block">🥬 Fresh Harvest</span>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => handleBuyNow(p)}
                    disabled={buying === p._id}
                    className={`${
                      buying === p._id
                        ? "bg-gray-400"
                        : "bg-emerald-700 hover:bg-emerald-800"
                    } text-white font-medium py-2 px-4 rounded-lg text-sm`}
                  >
                    {buying === p._id ? "Processing..." : "🛒 Buy Now"}
                  </button>

                  <button className="border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white font-medium py-2 px-4 rounded-lg text-sm">
                    🔗 Trace
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
