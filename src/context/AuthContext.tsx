'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User, Empresa, EmpresaAssociada, AuthContextType } from '@/types'
import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [empresaAssociada, setEmpresaAssociada] = useState<EmpresaAssociada | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

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
      console.log('🔍 Buscando dados do usuário:', supabaseUser.id)
      console.log('📧 Email do usuário:', supabaseUser.email)
      
      // Buscar dados do usuário
      console.log('🔄 Executando query na tabela usuarios...')
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('uid', supabaseUser.id)
        .single()

      console.log('📊 Resultado da query:', { userData, userError })

      if (userError) {
        console.error('❌ Erro ao buscar usuário:', userError)
        console.error('❌ Detalhes do erro:', {
          code: userError.code,
          message: userError.message,
          details: userError.details,
          hint: userError.hint
        })
        toast.error(`Erro ao carregar dados do usuário: ${userError.message}`)
        setLoading(false)
        return
      }

      if (!userData) {
        console.error('❌ Usuário não encontrado na tabela usuarios')
        console.error('❌ UID procurado:', supabaseUser.id)
        toast.error('Usuário não encontrado na base de dados')
        setLoading(false)
        return
      }

      console.log('✅ Usuário encontrado:', userData.email, '| Admin:', userData.is_admin)
      setUser(userData)

      // Se for admin, não precisa buscar empresa
      if (userData.is_admin) {
        console.log('👑 Usuário é administrador - login completo')
        setEmpresa(null)
        setEmpresaAssociada(null)
        setLoading(false)
        return
      }

      console.log('👤 Buscando empresa associada...')
      
      // Se não for admin, buscar dados da empresa
      const { data: associacaoData, error: associacaoError } = await supabase
        .from('empresa_associada')
        .select('*')
        .eq('uid_usuario', supabaseUser.id)
        .eq('status_vinculacao', 'ativo')
        .single()

      if (associacaoError) {
        console.log('⚠️ Nenhuma empresa associada encontrada:', associacaoError.message)
        setLoading(false)
        return
      }

      setEmpresaAssociada(associacaoData)
      console.log('✅ Empresa associada encontrada')

      // Buscar dados da empresa
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id_empresa', associacaoData.id_empresa)
        .single()

      if (empresaError) {
        console.error('❌ Erro ao buscar empresa:', empresaError)
        setLoading(false)
        return
      }

      setEmpresa(empresaData)
      console.log('✅ Dados da empresa carregados')
      setLoading(false)
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error)
      toast.error('Erro ao carregar dados')
      setLoading(false)
    }
  }

  // Função para redirecionar usuário após login (APENAS na página de login)
  const redirectAfterLogin = () => {
    // Só redireciona se estiver em uma página de login
    if (!pathname.includes('/login')) return
    
    // Não redireciona se já está carregando ou se não tem usuário
    if (loading || !user) return

    // 1. ADMINISTRADOR → /admin
    if (user.is_admin === true) {
      console.log('🔀 Redirecionando admin para /admin')
      router.push('/admin')
      return
    }

    // 2. TEM VÍNCULO COM EMPRESA?
    if (empresaAssociada && empresa) {
      
      // 2a. GERENTE → /gerente
      if (empresaAssociada.funcao === 'gerente') {
        console.log('🔀 Redirecionando gerente para /gerente')
        router.push('/gerente')
        return
      }
      
           // 2b. TRANSPORTADOR → /transportador ou /transportador-transportadora
           if (empresaAssociada.funcao === 'transportador') {
             // Se for transportador de transportadora, vai para página específica
             if (empresa && empresa.tipo_empresa === 'transportadora') {
               console.log('🔀 Redirecionando transportador de transportadora para /transportador-transportadora')
               router.push('/transportador-transportadora')
               return
             } else {
               console.log('🔀 Redirecionando transportador para /transportador')
               router.push('/transportador')
               return
             }
           }
    }
    
    // 3. CLIENTE → Raiz
    console.log('👤 Redirecionando cliente para raiz')
    router.push('/')
  }

  // Executar redirecionamento apenas quando pathname for uma página de login
  useEffect(() => {
    if (pathname.includes('/login')) {
      redirectAfterLogin()
    }
  }, [user, empresaAssociada, empresa, loading, pathname])

  const signIn = async (email: string, password: string): Promise<boolean> => {
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
        return true
      }
      return false
    } catch (error: any) {
      console.error('Erro no login:', error)
      toast.error(error.message || 'Erro ao fazer login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true)

      // Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            nome_usuario: userData.nome_usuario,
            nome_completo: userData.nome_completo,
            telefone: userData.telefone
          }
        }
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
            is_admin: false, // Sempre false inicialmente
          })

        if (insertError) {
          throw insertError
        }

        // Se marcou como admin, vamos atualizar depois
        if (userData.is_admin) {
          toast.success('Conta criada com sucesso! Você será promovido a administrador em alguns segundos.')
          
          // Aguardar um pouco e atualizar para admin
          setTimeout(async () => {
            try {
              await supabase
                .from('usuarios')
                .update({ is_admin: true })
                .eq('uid', data.user?.id || '')
              
              toast.success('✅ Você agora é administrador do sistema!')
            } catch (updateError) {
              console.error('Erro ao promover a admin:', updateError)
              toast.error('Erro ao promover a admin. Faça manualmente no banco.')
            }
          }, 3000)
        } else {
          toast.success('Conta criada com sucesso!')
        }
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      
      // Se for erro de CORS/403, sugerir configuração manual
      if (error.message.includes('CORS') || error.message.includes('403')) {
        toast.error('Erro de configuração. Configure o Supabase Auth primeiro.')
        toast.success('💡 Acesse: Supabase → Authentication → Settings')
      } else {
        toast.error(error.message || 'Erro ao criar conta')
      }
      
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

// Hook para obter tipo de usuário
export function useUserType(): 'admin' | 'gerente' | 'transportador' | 'cliente' | null {
  const { user, empresaAssociada } = useAuth()
  
  if (!user) return null
  
  // 1. Admin?
  if (user.is_admin) return 'admin'
  
  // 2. Gerente ou Transportador?
  if (empresaAssociada) {
    if (empresaAssociada.funcao === 'gerente') return 'gerente'
    if (empresaAssociada.funcao === 'transportador') return 'transportador'
  }
  
  // 3. Cliente (logado mas sem empresa_associada)
  return 'cliente'
}
