'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Car, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [senhaRedefinida, setSenhaRedefinida] = useState(false)
  const [tokenValido, setTokenValido] = useState(true)
  
  const router = useRouter()

  useEffect(() => {
    // Verificar se há um hash na URL (token de recuperação)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    
    if (!accessToken) {
      setTokenValido(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setSenhaRedefinida(true)
      toast.success('Senha redefinida com sucesso!')
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error)
      toast.error(error.message || 'Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex items-center">
              <Car className="h-12 w-12 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-3xl font-bold text-gray-900">MovTudo</h1>
                <p className="text-sm text-gray-500">Sistema de Transporte</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="card py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Link Inválido
                </h2>
                
                <p className="text-gray-600 mb-6">
                  O link de recuperação está inválido ou expirado.
                </p>
                
                <div className="space-y-3">
                  <Link href="/esqueci-senha" className="btn btn-primary w-full">
                    Solicitar Novo Link
                  </Link>
                  
                  <Link href="/login" className="btn btn-outline w-full">
                    Voltar para Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (senhaRedefinida) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex items-center">
              <Car className="h-12 w-12 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-3xl font-bold text-gray-900">MovTudo</h1>
                <p className="text-sm text-gray-500">Sistema de Transporte</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="card py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Senha Redefinida!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Sua senha foi alterada com sucesso. Você será redirecionado para a página de login em alguns segundos...
                </p>
                
                <Link href="/login" className="btn btn-primary w-full">
                  Ir para Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center">
            <Car className="h-12 w-12 text-primary-600" />
            <div className="ml-3">
              <h1 className="text-3xl font-bold text-gray-900">MovTudo</h1>
              <p className="text-sm text-gray-500">Sistema de Transporte</p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Redefinir senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digite sua nova senha abaixo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nova Senha */}
            <div>
              <label htmlFor="password" className="form-label">
                Nova Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Mínimo de 6 caracteres
              </p>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Nova Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Redefinindo...
                  </>
                ) : (
                  'Redefinir Senha'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}






