"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
}: ImageModalProps) {
  console.log("✅ Modal Image URL:", imageSrc); // 🔍 Debug URL gambar yang dikirim ke modal

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative bg-background rounded-lg max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={800}
                height={600}
                className="w-full h-full object-contain"
                unoptimized // ✅ Hindari `_next/image` agar URL tidak berubah
                loading="eager" // ✅ Langsung load gambar di modal
              />
            ) : (
              <p className="text-center text-muted-foreground">
                No Image Available
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
