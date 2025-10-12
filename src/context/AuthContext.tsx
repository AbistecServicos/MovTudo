'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/auth-helpers-nextjs'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User, Empresa, EmpresaAssociada, AuthContextType } from '@/types'
import toast from 'react-hot-toast'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [empresaAssociada, setEmpresaAssociada] = useState<EmpresaAssociada | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Verificar sessão atual
    checkUser()

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setEmpresa(null)
        setEmpresaAssociada(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserData(session.user)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async (supabaseUser: SupabaseUser) => {
    try {
      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('uid', supabaseUser.id)
        .single()

      if (userError) {
        console.error('Erro ao buscar usuário:', userError)
        return
      }

      setUser(userData)

      // Se não for admin, buscar dados da empresa
      if (!userData.is_admin) {
        const { data: associacaoData, error: associacaoError } = await supabase
          .from('empresa_associada')
          .select('*')
          .eq('uid_usuario', supabaseUser.id)
          .eq('status_vinculacao', 'ativo')
          .single()

        if (associacaoError) {
          console.error('Erro ao buscar associação:', associacaoError)
          return
        }

        setEmpresaAssociada(associacaoData)

        // Buscar dados da empresa
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('*')
          .eq('id_empresa', associacaoData.id_empresa)
          .single()

        if (empresaError) {
          console.error('Erro ao buscar empresa:', empresaError)
          return
        }

        setEmpresa(empresaData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        await loadUserData(data.user)
        toast.success('Login realizado com sucesso!')
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
      toast.error(error.message || 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Criar registro na tabela usuarios
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert({
            uid: data.user.id,
            email: data.user.email!,
            nome_usuario: userData.nome_usuario || '',
            nome_completo: userData.nome_completo || '',
            telefone: userData.telefone || '',
            is_admin: userData.is_admin || false,
          })

        if (insertError) {
          throw insertError
        }

        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.')
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      toast.error(error.message || 'Erro ao criar conta')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      
      setUser(null)
      setEmpresa(null)
      setEmpresaAssociada(null)
      toast.success('Logout realizado com sucesso!')
    } catch (error: any) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (supabaseUser) {
        await loadUserData(supabaseUser)
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const value: AuthContextType = {
    user,
    empresa,
    empresaAssociada,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Hook para verificar se usuário é admin
export function useIsAdmin() {
  const { user } = useAuth()
  return user?.is_admin || false
}

// Hook para verificar função do usuário na empresa
export function useUserRole() {
  const { empresaAssociada } = useAuth()
  return empresaAssociada?.funcao || null
}

// Hook para verificar se usuário está logado
export function useIsAuthenticated() {
  const { user, loading } = useAuth()
  return { isAuthenticated: !!user, loading }
}
