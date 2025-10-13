'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Empresa } from '@/types'
import { Car, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { signIn, user } = useAuth()
  
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (slug && !empresa) {
      loadEmpresa()
    }
  }, [slug])

  // Redirecionar se já está logado
  useEffect(() => {
    if (user && !loading) {
      router.push(`/${slug}`)
    }
  }, [user, loading])

  const loadEmpresa = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('slug', slug)
        .eq('ativa', true)
        .single()

      if (error || !data) {
        toast.error('Empresa não encontrada')
        router.push('/')
        return
      }

      setEmpresa(data)
    } catch (error) {
      console.error('Erro ao carregar empresa:', error)
      toast.error('Erro ao carregar empresa')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Preencha todos os campos')
      return
    }

    setSubmitting(true)

    try {
      const success = await signIn(formData.email, formData.password)
      
      if (success) {
        // Salvar empresa preferida do cliente
        if (user && !user.is_admin && empresa) {
          await supabase
            .from('usuarios')
            .update({ 
              // Podemos adicionar campo id_empresa_preferida depois
            })
            .eq('uid', user.uid)
        }
        
        // Redirecionamento será feito pelo AuthContext
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: `linear-gradient(135deg, ${empresa.cor_primaria}15 0%, ${empresa.cor_secundaria}15 100%)`
    }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${slug}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              {empresa.empresa_logo && (
                <img
                  src={empresa.empresa_logo}
                  alt={empresa.empresa_nome}
                  className="h-10 w-10 object-contain"
                />
              )}
              <span className="text-lg font-semibold" style={{ color: empresa.cor_primaria }}>
                {empresa.empresa_nome}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Car className="mx-auto h-12 w-12" style={{ color: empresa.cor_primaria }} />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Entrar
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Acesse sua conta na {empresa.empresa_nome}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    placeholder="seu@email.com"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn btn-primary btn-lg"
                style={{ backgroundColor: empresa.cor_primaria }}
              >
                {submitting ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Ainda não tem conta?{' '}
                <Link 
                  href={`/${slug}/cadastro`} 
                  className="font-medium hover:underline"
                  style={{ color: empresa.cor_primaria }}
                >
                  Cadastre-se aqui
                </Link>
              </p>
              
              <p className="mt-4 text-sm text-gray-600">
                É transportador ou gerente?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-gray-700 hover:underline"
                >
                  Acesse o portal profissional
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} {empresa.empresa_nome}
        </div>
      </footer>
    </div>
  )
}

