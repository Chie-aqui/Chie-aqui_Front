import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Chie Aqui - Plataforma de Reclamações",
  description: "Sua voz importa. Registre reclamações e encontre soluções.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
