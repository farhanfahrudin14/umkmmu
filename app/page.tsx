"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";
import UMKMCard from "@/components/umkm-card";
import SearchFilter from "@/components/search-filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

const stats = [
  {
    icon: <Users className="w-6 h-6" />,
    value: "1000+",
    label: "Local Businesses",
  },
  {
    icon: <Search className="w-6 h-6" />,
    value: "50k+",
    label: "Monthly Searches",
  },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [filteredUMKMs, setFilteredUMKMs] = useState<UMKM[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUmkms = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/umkms`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();

        const processedData = data
          .filter((umkm: any) => umkm.status === "Active") // ✅ Hanya tampilkan UMKM dengan status "Active"
          .map((umkm: any) => {
            let imagesArray: string[] = [];
            let selectedImage = "/placeholder.png"; // Default jika tidak ada gambar

            if (umkm.images) {
              try {
                const parsedImages = JSON.parse(umkm.images.replace(/\\/g, "")); // ✅ Fix parsing JSON
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  imagesArray = parsedImages.map(cleanImageUrl);
                  selectedImage = cleanImageUrl(parsedImages[0]);
                }
              } catch (error) {
                console.error("❌ Error parsing images JSON:", error);
              }
            }

            console.log("✅ Fetched UMKM Image:", selectedImage); // 🔍 Debug hasil gambar

            // ✅ Format jam agar tidak menampilkan ":00"
            const formatTime = (time: string | null) =>
              time ? time.slice(0, 5) : "Unknown";

            return {
              ...umkm,
              image: selectedImage,
              openingTime: formatTime(umkm.open_time), // ✅ Format 24 jam tanpa detik
              closingTime: formatTime(umkm.close_time), // ✅ Format 24 jam tanpa detik
            };
          });

        setUmkms(processedData);
        setFilteredUMKMs(processedData);
      } catch (error) {
        console.error("❌ Failed to fetch UMKMs:", error);
      }
    };

    fetchUmkms();
  }, []);

  const cleanImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg";

    let cleanUrl = url
      .replace(/\\/g, "") // ✅ Hapus karakter backslash yang tidak perlu
      .replace(/\/?storage\/+storage\//g, "/storage/") // ✅ Fix path storage dobel
      .replace("localhost:8000storage", "localhost:8000/storage"); // ✅ Fix path aneh di localhost

    // ✅ Pastikan ada `/storage/` jika tidak ada
    if (!cleanUrl.includes("/storage/")) {
      cleanUrl = cleanUrl.replace("/umkm_images/", "/storage/umkm_images/");
    }

    // ✅ Pastikan URL lengkap dengan http/https
    if (!cleanUrl.startsWith("http")) {
      cleanUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${cleanUrl.replace(
        /^\/?/,
        ""
      )}`;
    }

    return cleanUrl;
  };

  /** ✅ Handle Search */
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = umkms.filter((umkm) => {
      const name = umkm.name ? umkm.name.toLowerCase() : "";
      const description = umkm.description
        ? umkm.description.toLowerCase()
        : "";
      const address = umkm.address ? umkm.address.toLowerCase() : "";
      const type = umkm.type ? umkm.type.toLowerCase() : "";

      return (
        name.includes(query.toLowerCase()) ||
        description.includes(query.toLowerCase()) ||
        address.includes(query.toLowerCase()) ||
        type.includes(query.toLowerCase())
      );
    });

    setFilteredUMKMs(filtered);
  };

  /** ✅ Handle Category Change */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    if (category === "all") {
      setFilteredUMKMs(umkms);
    } else {
      const filtered = umkms.filter((umkm) => umkm.type === category);
      setFilteredUMKMs(filtered);
    }
  };

  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const animateCarousel = async () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        await controls.start({
          x: [-containerWidth, 0],
          transition: {
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          },
        });
      }
    };

    animateCarousel();
  }, [controls]);

  return (
    <div>
      <section className="relative bg-background overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Discover Indonesia's Hidden Gems
            </h1>
            <p className="text-xl mb-8">
              Explore a world of unique products and services from local
              artisans and entrepreneurs
            </p>
            <Link href="/umkms">
              <Button size="lg" className="group">
                Start Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="overflow-hidden" ref={containerRef}>
            <motion.div
              className="flex gap-4"
              animate={controls}
              style={{ width: `${filteredUMKMs.length * 320 * 2}px` }}
            >
              {filteredUMKMs.map((umkm: UMKM, index: number) => (
                <Card
                  key={`${umkm.id}-${index}`}
                  className="w-[300px] flex-shrink-0"
                >
                  <CardContent className="p-4">
                    <Image
                      src={cleanImageUrl(umkm.image) || "/placeholder.svg"}
                      alt={umkm.name}
                      width={280}
                      height={200}
                      className="rounded-lg mb-4 object-cover max-h-40"
                      unoptimized={true} // ✅ Pastikan Next.js tidak mengubah URL
                      loading="eager" // ✅ Pastikan gambar langsung dimuat
                    />
                    <h3 className="text-lg font-semibold mb-2">{umkm.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {umkm.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{umkm.address}</span>
                      <span className="text-sm">{umkm.type}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-primary rounded-full p-4 mb-4 text-primary-foreground">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative bg-background overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          {/* ✅ Search & Filter */}
          <SearchFilter
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            categories={Array.from(new Set(umkms.map((umkm) => umkm.type)))} // Auto extract unique types
          />

          {/* ✅ List UMKM */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
      </section>
    </div>
  );
}
