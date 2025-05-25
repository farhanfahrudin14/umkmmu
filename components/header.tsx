"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useFavorites } from "@/lib/favorites-context";
import { Badge } from "./ui/badge";
import SearchPopup from "./search-popup";

const navItems = [
  { name: "Home", href: "/" },
  { name: "UMKMs", href: "/umkms" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";
  const loginURL = isProduction
    ? "https://seller.ahmakbar.site"
    : "http://localhost:3001";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            UMKM Showcase
          </Link>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Favorites"
                className="relative"
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href={loginURL}>
              <Button variant="default">Login UMKM</Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search UMKMs
                </Button>
                <Link href="/favorites" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full relative">
                    <Heart className="h-5 w-5 mr-2" />
                    View Favorites
                    {favorites.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                      >
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href={loginURL} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login UMKM
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </motion.header>
  );
}
