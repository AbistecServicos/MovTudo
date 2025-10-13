'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Car, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome_completo: '',
    nome_usuario: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signUp } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    const { nome_completo, nome_usuario, email, telefone, password, confirmPassword } = formData

    if (!nome_completo || !nome_usuario || !email || !telefone || !password || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return false
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Por favor, insira um email válido')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      await signUp(formData.email, formData.password, {
        nome_completo: formData.nome_completo,
        nome_usuario: formData.nome_usuario,
        telefone: formData.telefone,
        is_admin: false
      })
      
      toast.success('Conta criada com sucesso!')
      router.push('/login')
    } catch (error) {
      // Error já é tratado no AuthContext
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Car className="h-12 w-12 text-primary-600" />
            <div className="ml-3">
              <h1 className="text-3xl font-bold text-gray-900">MovTudo</h1>
              <p className="text-sm text-gray-500">Sistema de Transporte</p>
            </div>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Criar conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            faça login na sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome_completo" className="form-label">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome_completo"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleInputChange}
                className="input"
                placeholder="Ex: João Silva"
                disabled={loading}
                required
              />
            </div>

            {/* Nome de Usuário */}
            <div>
              <label htmlFor="nome_usuario" className="form-label">
                Nome de Usuário
              </label>
              <input
                type="text"
                id="nome_usuario"
                name="nome_usuario"
                value={formData.nome_usuario}
                onChange={handleInputChange}
                className="input"
                placeholder="Ex: joaosilva"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                placeholder="seu@email.com"
                disabled={loading}
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="form-label">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                className="input"
                placeholder="(00) 00000-0000"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
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
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Criar Conta
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Informações</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>💡 Sobre o cadastro:</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use um email válido que você tenha acesso</li>
                <li>• Você receberá um email de confirmação</li>
                <li>• Após confirmar, poderá fazer login</li>
                <li>• Para se tornar transportador, entre em contato com uma empresa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
