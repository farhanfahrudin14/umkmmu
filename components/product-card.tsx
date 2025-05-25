"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ImageModal from "@/components/image-modal";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

export default function ProductCard({
  id,
  name,
  description,
  image,
  price,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openModal = () => {
    console.log("✅ Opening modal with image:", image); // 🔍 Debug URL sebelum dikirim ke modal
    setModalImage(image);
    setIsModalOpen(true);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <motion.div
        className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={400}
            height={200}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={openModal}
            unoptimized // ✅ Hindari `_next/image` agar URL tidak berubah
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={openModal}
            >
              View Image
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <p className="text-muted-foreground mb-2 line-clamp-2">
            {description}
          </p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">{formatRupiah(price)}</span>
          </div>
        </div>
      </motion.div>

      {/* ✅ Modal Image */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={modalImage}
        imageAlt={name}
      />
    </>
  );
}
