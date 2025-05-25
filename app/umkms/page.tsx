"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UMKMCard from "@/components/umkm-card";
import SearchFilter from "@/components/search-filter";

// Mock data for UMKMs
// const allUMKMs = [
//   {
//     id: "1",
//     name: "Batik Sekar",
//     description: "Traditional handmade batik from local artisans",
//     image: "/placeholder.svg?height=400&width=300&text=Batik+Sekar",
//     location: "Yogyakarta",
//     category: "Textiles",
//     openingTime: "09:00",
//     closingTime: "18:00",
//   },
//   {
//     id: "2",
//     name: "Warung Sate Pak Kumis",
//     description: "Delicious local satay with secret family recipe",
//     image: "/placeholder.svg?height=400&width=300&text=Warung+Sate",
//     location: "Jakarta",
//     category: "Food",
//     openingTime: "17:00",
//     closingTime: "23:00",
//   },
//   {
//     id: "3",
//     name: "Kerajinan Bambu Indah",
//     description: "Eco-friendly bamboo crafts and furniture",
//     image: "/placeholder.svg?height=400&width=300&text=Bamboo+Crafts",
//     location: "Bali",
//     category: "Handicrafts",
//     openingTime: "10:00",
//     closingTime: "20:00",
//   },
//   {
//     id: "4",
//     name: "Tenun Ikat Sumba",
//     description: "Exquisite hand-woven textiles from Sumba",
//     image: "/placeholder.svg?height=400&width=300&text=Tenun+Ikat",
//     location: "Sumba",
//     category: "Textiles",
//     openingTime: "08:00",
//     closingTime: "17:00",
//   },
//   {
//     id: "5",
//     name: "Kopi Luwak Authentic",
//     description: "Premium civet coffee from Indonesian plantations",
//     image: "/placeholder.svg?height=400&width=300&text=Kopi+Luwak",
//     location: "Aceh",
//     category: "Food",
//     openingTime: "07:00",
//     closingTime: "22:00",
//   },
//   {
//     id: "6",
//     name: "Perak Kotagede",
//     description: "Intricate silver jewelry and ornaments",
//     image: "/placeholder.svg?height=400&width=300&text=Perak+Kotagede",
//     location: "Yogyakarta",
//     category: "Jewelry",
//     openingTime: "09:00",
//     closingTime: "17:00",
//   },
//   {
//     id: "7",
//     name: "Gerabah Kasongan",
//     description: "Traditional pottery and ceramic crafts",
//     image: "/placeholder.svg?height=400&width=300&text=Gerabah+Kasongan",
//     location: "Yogyakarta",
//     category: "Handicrafts",
//     openingTime: "08:00",
//     closingTime: "16:00",
//   },
//   {
//     id: "8",
//     name: "Songket Palembang",
//     description: "Luxurious hand-woven fabric with gold threads",
//     image: "/placeholder.svg?height=400&width=300&text=Songket+Palembang",
//     location: "Palembang",
//     category: "Textiles",
//     openingTime: "09:00",
//     closingTime: "18:00",
//   },
// ]

interface UMKM {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  location: string;
  location_url?: string; // Sesuai dengan API
  address: string;
  category: string;
  openingTime: string;
  closingTime: string;
}

interface Category {
  id: string;
  name: string;
}

export default function UMKMsPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [filteredUMKMs, setFilteredUMKMs] = useState<UMKM[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchUMKMs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/umkms`
        );
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        // Proses parsing images dan kategori
        const processedData = data
          .filter((umkm: any) => umkm.status === "Active") // ✅ Hanya tampilkan UMKM dengan status "Active"
          .map((umkm: Record<string, unknown>) => {
            let imagesArray: string[] = [];
            let selectedImage: string = "/placeholder.png";

            if (typeof umkm.images === "string") {
              try {
                const parsedImages = JSON.parse(umkm.images as string);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  imagesArray = parsedImages;
                  selectedImage = `${
                    process.env.NEXT_PUBLIC_API_BASE_URL
                  }/storage/${String(imagesArray[0])}`;
                }
              } catch (error) {
                console.error("Error parsing images JSON:", error);
              }
            }

            // ✅ Format open/close time agar tidak menampilkan ":00"
            const formatTime = (time: string | null) =>
              time ? time.slice(0, 5) : "Unknown";

            return {
              ...umkm,
              image: selectedImage,
              openingTime: formatTime(umkm.open_time as string | null), // ✅ Paksa sebagai string | null
              closingTime: formatTime(umkm.close_time as string | null), // ✅ Paksa sebagai string | null
            };
          });

        setUmkms(processedData);
        setFilteredUMKMs(processedData);

        // Extract kategori unik dari data UMKM
        const uniqueCategories = Array.from(
          new Set(processedData.map((umkm: UMKM) => umkm.type))
        );

        setCategories([
          "All",
          ...uniqueCategories.filter(
            (cat): cat is string => typeof cat === "string"
          ),
        ]);
      } catch (error) {
        console.error("Failed to fetch UMKMs:", error);
      }
    };

    fetchUMKMs();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = umkms.filter((umkm) => {
      const name = typeof umkm.name === "string" ? umkm.name.toLowerCase() : "";
      const description =
        typeof umkm.description === "string"
          ? umkm.description.toLowerCase()
          : "";
      const address =
        typeof umkm.address === "string" ? umkm.address.toLowerCase() : "";
      const type = typeof umkm.type === "string" ? umkm.type.toLowerCase() : "";

      return (
        name.includes(query.toLowerCase()) ||
        description.includes(query.toLowerCase()) ||
        address.includes(query.toLowerCase()) ||
        type.includes(query.toLowerCase())
      );
    });

    setFilteredUMKMs(filtered);
  };

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      setFilteredUMKMs(umkms);
    } else {
      const filtered = umkms.filter((umkm) => umkm.type === category);
      setFilteredUMKMs(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore UMKMs</h1>
      <SearchFilter
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredUMKMs.map((umkm, index) => (
          <motion.div
            key={umkm.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <UMKMCard {...umkm} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
