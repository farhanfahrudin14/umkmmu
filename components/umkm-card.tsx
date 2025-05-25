"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites-context";

interface UMKMCardProps {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  images?: string[];
  location_url?: string; // Sesuai dengan API
  location: string;
  address: string;
  category: string;
  phone_number?: string; // Sesuai dengan API
  document?: string; // Sesuai dengan API
  status?: string;
  openingTime: string;
  closingTime: string;
}

const UMKMCard: React.FC<UMKMCardProps> = ({
  id,
  name,
  type,
  description,
  image,
  location,
  location_url, // Sesuai dengan API
  address,
  category,
  openingTime = "Unknown", // Default value as placeholder
  closingTime = "Unknown", // Default value as placeholder
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite({
        id,
        name,
        type,
        description,
        image,
        location,
        location_url,
        address,
        category,
        openingTime,
        closingTime,
      });
    }
  };

  const fixImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg";

    let fixedUrl = url.replace(/\\/g, ""); // Hapus karakter backslash
    fixedUrl = fixedUrl.replace(/\/?storage\/+storage\//g, "/storage/"); // Perbaiki path storage yang dobel

    // ✅ Tambahkan "/storage/" jika hilang
    if (!fixedUrl.includes("/storage/")) {
      fixedUrl = fixedUrl.replace("/umkm_images/", "/storage/umkm_images/");
    }

    // ✅ Pastikan URL lengkap
    if (!fixedUrl.startsWith("http")) {
      fixedUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${fixedUrl.replace(
        /^\/?/,
        ""
      )}`;
    }

    return fixedUrl;
  };

  return (
    <motion.div
      className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-48">
        <img
          src={fixImageUrl(image)}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-semibold">
          {type}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">{name}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 ${
                favorite ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{address}</span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {openingTime} - {closingTime}
          </span>
        </div>
        <Link href={`/umkm/${id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default UMKMCard;
