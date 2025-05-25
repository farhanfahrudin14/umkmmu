import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "@/lib/favorites-context"
import type React from "react"

export const metadata = {
  title: "UMKM Showcase",
  description: "Discover amazing local businesses and their unique products",
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

