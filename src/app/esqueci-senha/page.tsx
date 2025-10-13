'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Car, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Por favor, insira seu email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Por favor, insira um email válido')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })

      if (error) {
        throw error
      }

      setEmailEnviado(true)
      toast.success('Email de recuperação enviado!')
    } catch (error: any) {
      console.error('Erro ao enviar email:', error)
      toast.error(error.message || 'Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  if (emailEnviado) {
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
                  Email Enviado!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Enviamos um link de recuperação para:
                </p>
                
                <p className="text-lg font-medium text-primary-600 mb-6">
                  {email}
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>📧 Próximos passos:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1 text-left">
                    <li>• Verifique sua caixa de entrada</li>
                    <li>• Clique no link enviado por email</li>
                    <li>• Defina sua nova senha</li>
                    <li>• Faça login com a nova senha</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Não recebeu o email? Verifique a pasta de spam ou aguarde alguns minutos.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setEmailEnviado(false)}
                    className="btn btn-secondary w-full"
                  >
                    Enviar Novamente
                  </button>
                  
                  <Link href="/login" className="btn btn-outline w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
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
          Esqueceu sua senha?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sem problemas! Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>💡 Importante:</strong> O link de recuperação expira em 1 hora.
              </p>
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
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Enviar Link de Recuperação
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Voltar */}
          <div className="mt-6">
            <Link
              href="/login"
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="font-medium text-primary-600 hover:text-primary-500">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}






