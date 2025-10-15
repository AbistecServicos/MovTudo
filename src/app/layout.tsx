import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'
import DebugAuth from '@/components/DebugAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MovTudo - Sistema de Transporte',
  description: 'Plataforma de transporte multiempresa conectando clientes e transportadores',
  keywords: 'transporte, taxi, mototaxi, entrega, logistica',
  authors: [{ name: 'MovTudo' }],
  robots: 'index, follow',
  openGraph: {
    title: 'MovTudo - Sistema de Transporte',
    description: 'Plataforma de transporte multiempresa conectando clientes e transportadores',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <DebugAuth />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
