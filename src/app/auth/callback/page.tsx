'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro na sessão:', error)
          router.push('/login?error=callback_error')
          return
        }

        if (data.session) {
          // Sucesso! Redirecionar para o dashboard
          router.push('/admin')
        } else {
          // Sem sessão, redirecionar para login
          router.push('/login')
        }
      } catch (error) {
        console.error('Erro no callback:', error)
        router.push('/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Confirmando sua conta...
        </h2>
        <p className="text-gray-600">
          Aguarde enquanto processamos sua autenticação.
        </p>
      </div>
    </div>
  )
}
