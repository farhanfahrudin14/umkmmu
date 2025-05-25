"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Heart } from "lucide-react";
import ProductCard from "@/components/product-card";
import ImageGallery from "@/components/image-gallery";
import GoogleMap from "@/components/google-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites-context";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

interface Product {
  id: number;
  umkm_id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface UMKM {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  images?: string[];
  location?: string;
  location_url?: string;
  address: string;
  category: string;
  phone_number?: string;
  document?: string;
  status?: string;
  openingTime: string;
  closingTime: string;
  products?: Product[]; // ✅ Tambahkan produk
}

interface Category {
  id: string;
  name: string;
}

export default function UMKMDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter(); // ✅ Inisialisasi router

  if (!params?.id) {
    return <div>Error: Invalid ID</div>; // Bisa ganti dengan UI khusus
  }

  // Mock data - di real aplikasi ini bisa diganti dengan fetch dari API
  const [umkm, setUMKM] = useState<UMKM | null>(null);

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFavorited = umkm ? isFavorite(String(umkm.id)) : false;

  useEffect(() => {
    const fetchUMKMDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/umkms/${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch UMKM details");

        const data = await response.json();

        // ✅ Cek jika status UMKM bukan "Active", redirect ke halaman utama
        if (data.status !== "Active") {
          router.push("/");
          return;
        }

        console.log("✅ Raw API Response:", data);

        // ✅ Proses gambar UMKM (Fix JSON Parsing)
        let selectedImage = "/placeholder.svg";
        let imagesArray: string[] = [];

        if (data.images) {
          try {
            const parsedImages = JSON.parse(data.images.replace(/\\/g, ""));
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              imagesArray = parsedImages.map(cleanUMKMImageUrl);
              selectedImage = cleanUMKMImageUrl(parsedImages[0]);
            }
          } catch (error) {
            console.error("❌ Error parsing images JSON:", error);
          }
        }

        console.log("✅ UMKM Images Array:", imagesArray);

        // ✅ Proses gambar produk
        const products = data.products.map((product: any) => {
          const fixedImage = cleanProductImageUrl(product.image);
          console.log(`🔍 Product ${product.id} image:`, fixedImage);
          return {
            ...product,
            image: fixedImage,
          };
        });

        const processedUMKM = {
          id: data.id,
          name: data.name,
          type: data.type,
          description: data.description || "No description available",
          image: selectedImage,
          images: imagesArray,
          location_url: data.location_url || "",
          address: data.address || "Address not provided",
          category: data.type || "Unknown",
          phone_number: data.phone_number || "No phone number available",
          document: data.document || "",
          status: data.status || "Unknown",
          openingTime: data.open_time || "Unknown", // ✅ Ambil open_time dari API
          closingTime: data.close_time || "Unknown", // ✅ Ambil close_time dari API
          products, // ✅ Produk dengan gambar yang benar
        };

        console.log("✅ Processed UMKM Data:", processedUMKM);
        setUMKM(processedUMKM);
      } catch (error) {
        console.error("❌ Error fetching UMKM details:", error);
      }
    };

    if (params.id) {
      fetchUMKMDetail();
    }
  }, [params.id]);

  // ✅ Fungsi untuk membersihkan URL gambar UMKM (gunakan Next.js Image)
  const cleanUMKMImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg";

    let cleanUrl = url
      .replace(/\\/g, "")
      .replace(/\/?storage\/+storage\//g, "storage/");

    // ✅ Tambahkan `/` sebelum storage jika belum ada
    if (!cleanUrl.startsWith("http")) {
      cleanUrl = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/storage/${cleanUrl.replace(/^\/?/, "")}`;
    }

    return cleanUrl;
  };

  // ✅ Fungsi untuk membersihkan URL gambar produk
  const cleanProductImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg";

    let cleanUrl = url
      .replace(/\\/g, "")
      .replace(/\/?storage\/+storage\//g, "/storage/");

    // ✅ Perbaiki jika ada path yang salah di localhost
    cleanUrl = cleanUrl.replace(
      "localhost:8000storage",
      "localhost:8000/storage"
    );

    // ✅ Tambahkan '/' sebelum `storage/` jika belum ada
    if (!cleanUrl.startsWith("http")) {
      cleanUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${cleanUrl.replace(
        /^\/?/,
        ""
      )}`;
    }

    return cleanUrl;
  };

  if (!umkm) {
    return (
      <div className="text-center text-muted-foreground">
        Loading UMKM details...
      </div>
    );
  }

  const extractMapSrc = (iframeString: string) => {
    const match = iframeString.match(/src="([^"]+)"/);
    return match ? match[1] : "";
  };

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFavorite(String(umkm.id)); // ✅ Pastikan ID bertipe string
    } else {
      addFavorite({
        ...umkm,
        id: String(umkm.id), // ✅ Konversi ID ke string
        location: umkm.location ?? "", // ✅ Pastikan location memiliki nilai default
        openingTime: umkm.openingTime ?? "09:00", // ✅ Default jika tidak ada
        closingTime: umkm.closingTime ?? "18:00", // ✅ Default jika tidak ada
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <ImageGallery images={umkm?.images || [umkm?.image]} />
          </div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{umkm.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                aria-label={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorited
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>
            <div className="flex items-center mb-4">
              <Badge variant="secondary" className="mr-2">
                {umkm.category}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-6">{umkm.description}</p>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    <span>{umkm.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-primary" />
                    <span>{umkm?.phone_number || "No contact info"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    <span>
                      Open: {umkm.openingTime?.split(":").slice(0, 2).join(":")}{" "}
                      - {umkm.closingTime?.split(":").slice(0, 2).join(":")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="products" className="mb-8">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
            {umkm.products && umkm.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {umkm.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    description={product.description}
                    image={product.image}
                    price={parseFloat(product.price)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No products available.</p>
            )}
          </TabsContent>

          <TabsContent value="location">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <div className="w-full h-[450px] rounded-lg overflow-hidden">
              <iframe
                src={extractMapSrc(umkm.location_url || "")}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">About {umkm.name}</h2>
          <p className="text-muted-foreground mb-4">
            {umkm.name} is a proud member of the UMKM community, showcasing the
            best of Indonesian craftsmanship. Our dedication to preserving
            traditional techniques while embracing modern designs has made us a
            favorite among locals and tourists alike.
          </p>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            <span>
              Visit us to explore our full collection of handcrafted products!
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
