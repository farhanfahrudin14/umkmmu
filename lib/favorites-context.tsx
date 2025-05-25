"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface UMKM {
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

interface FavoritesContextType {
  favorites: UMKM[];
  addFavorite: (umkm: UMKM) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<UMKM[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (umkm: UMKM) => {
    setFavorites((prevFavorites) => [...prevFavorites, umkm]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((umkm) => umkm.id !== id)
    );
  };

  const isFavorite = (id: string) => {
    return favorites.some((umkm) => umkm.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
