import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "@/lib/favorites-context"
import type React from "react"

export const metadata = {
  title: "UMKM MU - Direktori UMKM Kota MU",
  description: "Temukan berbagai usaha lokal terbaik di Kota MU. Direktori lengkap UMKM dan produk-produk unggulan.",
  keywords: [
    "UMKM",
    "UMKM MU",
    "UMKM Kota MU",
    "usaha kecil",
    "usaha mikro",
    "direktori UMKM",
    "produk lokal",
  ],
  authors: [{ name: "UMKMMU Team" }],
  creator: "UMKMMU",
  openGraph: {
    title: "UMKM MU - Direktori UMKM Kota MU",
    description: "Temukan berbagai usaha lokal terbaik di Kota MU.",
    url: "https://pengunjung-umkmmu.vercel.app",
    siteName: "UMKM MU",
    type: "website",
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <FavoritesProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

