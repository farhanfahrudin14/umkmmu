"use client"

import { useFavorites } from "@/lib/favorites-context"
import UMKMCard from "@/components/umkm-card"
import { motion } from "framer-motion"

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorite UMKMs</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-muted-foreground">You haven't added any UMKMs to your favorites yet.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {favorites.map((umkm, index) => (
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
      )}
    </div>
  )
}

