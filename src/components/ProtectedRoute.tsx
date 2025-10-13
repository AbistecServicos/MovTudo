'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth, useUserType } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'gerente' | 'transportador' | 'cliente')[]
  requireAuth?: boolean
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requireAuth = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const userType = useUserType()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Aguardar carregamento
    if (loading) return

    // Se requer autenticação mas não está logado
    if (requireAuth && !user) {
      console.log('🚫 Rota protegida - redirecionando para login')
      router.push('/login')
      return
    }

    // Se tem roles permitidos e usuário não está nessa lista
    if (allowedRoles && userType && !allowedRoles.includes(userType)) {
      console.log(`🚫 Acesso negado - tipo ${userType} não permitido`)
      
      // Redirecionar para página adequada
      if (userType === 'admin') {
        router.push('/admin')
      } else if (userType === 'transportador') {
        router.push('/transportador')
      } else {
        router.push('/')
      }
      return
    }
  }, [user, userType, loading, pathname, allowedRoles, requireAuth])

  // Mostrar loading enquanto verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  // Se requer auth mas não está logado, não renderiza
  if (requireAuth && !user) {
    return null
  }

  // Se tem roles permitidos e usuário não está na lista, não renderiza
  if (allowedRoles && userType && !allowedRoles.includes(userType)) {
    return null
  }

  return <>{children}</>
}


