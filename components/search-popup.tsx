"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UMKM {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UMKM[]>([]);
  const [umkms, setUmkms] = useState<UMKM[]>([]);

  useEffect(() => {
    // Fetch UMKM data from backend
    const fetchUMKMs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/umkms`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch UMKMs");
        }
        const data = await response.json();

        // Process images to ensure correct URL format
        const processedData = data
          .filter((umkm: any) => umkm.status === "Active") // ✅ Hanya tampilkan UMKM dengan status "Active"
          .map((umkm: any) => {
            let imagesArray: string[] = [];
            let selectedImage = "/placeholder.png"; // Default jika tidak ada gambar

            if (umkm.images) {
              try {
                const parsedImages = JSON.parse(umkm.images);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  imagesArray = parsedImages;
                  selectedImage = `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${imagesArray[0]}`;
                }
              } catch (error) {
                console.error("Error parsing images JSON:", error);
              }
            }

            return {
              ...umkm,
              name: umkm.name || "",
              description: umkm.description || "",
              image: selectedImage,
            };
          });

        setUmkms(processedData);
      } catch (error) {
        console.error("Error fetching UMKMs:", error);
      }
    };

    fetchUMKMs();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        const filteredResults = umkms.filter((umkm) => {
          const name = umkm.name ? umkm.name.toLowerCase() : "";
          const description = umkm.description
            ? umkm.description.toLowerCase()
            : "";

          return (
            name.includes(searchQuery.toLowerCase()) ||
            description.includes(searchQuery.toLowerCase())
          );
        });

        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, umkms]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <div
            className="container mx-auto px-4 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center mb-4">
                <Search className="w-5 h-5 text-muted-foreground mr-2" />
                <Input
                  type="text"
                  placeholder="Search UMKMs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="ml-2"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
              <div className="space-y-4">
                {searchResults.map((umkm) => (
                  <Link
                    key={umkm.id}
                    href={`/umkm/${umkm.id}`}
                    onClick={onClose}
                  >
                    <div className="flex items-center space-x-4 p-2 hover:bg-accent rounded-md transition-colors">
                      <img
                        src={umkm.image || "/placeholder.png"}
                        alt={umkm.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{umkm.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {umkm.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {searchQuery && searchResults.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No results found
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
