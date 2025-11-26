"use client";

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth";

// Metadata can't be exported from a client component, so we keep it separate if needed.
// For simplicity, if you don't need server-side metadata generation, you can remove it.
// export const metadata: Metadata = {
//   title: "Chie Aqui - Plataforma de Reclamações",
//   description: "Sua voz importa. Registre reclamações e encontre soluções.",
//   generator: "v0.app",
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <AuthProvider> {/* Wrap the entire application with the AuthProvider */}
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
