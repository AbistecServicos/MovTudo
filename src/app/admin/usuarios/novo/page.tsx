'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserPlus, 
  Save, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Shield,
  Building2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NovoUsuarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error' | 'info', texto: string } | null>(null)

  const [formData, setFormData] = useState({
    nome_completo: '',
    nome_usuario: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    is_admin: false,
    id_empresa: '',
    funcao: 'cliente'
  })

  const handleInputChange = (campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const validarFormulario = () => {
    if (!formData.nome_completo.trim()) {
      setMensagem({ tipo: 'error', texto: 'Nome completo é obrigatório' })
      return false
    }
    if (!formData.email.trim()) {
      setMensagem({ tipo: 'error', texto: 'Email é obrigatório' })
      return false
    }
    if (!formData.senha.trim()) {
      setMensagem({ tipo: 'error', texto: 'Senha é obrigatória' })
      return false
    }
    if (formData.senha !== formData.confirmarSenha) {
      setMensagem({ tipo: 'error', texto: 'Senhas não coincidem' })
      return false
    }
    if (formData.senha.length < 6) {
      setMensagem({ tipo: 'error', texto: 'Senha deve ter pelo menos 6 caracteres' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    try {
      setLoading(true)
      setMensagem(null)

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome_completo: formData.nome_completo,
            nome_usuario: formData.nome_usuario
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Inserir dados do usuário na tabela usuarios
        const { error: userError } = await supabase
          .from('usuarios')
          .insert({
            uid: authData.user.id,
            email: formData.email,
            nome_usuario: formData.nome_usuario,
            nome_completo: formData.nome_completo,
            telefone: formData.telefone,
            is_admin: formData.is_admin
          })

        if (userError) throw userError

        // Se não for admin e tiver empresa/função, criar associação
        if (!formData.is_admin && formData.id_empresa && formData.funcao !== 'cliente') {
          const { error: associacaoError } = await supabase
            .from('empresa_associada')
            .insert({
              uid_usuario: authData.user.id,
              nome_completo: formData.nome_completo,
              funcao: formData.funcao,
              id_empresa: formData.id_empresa,
              status_vinculacao: 'ativo',
              empresa_nome: 'Empresa', // Seria buscado da tabela empresas
              email_usuario: formData.email
            })

          if (associacaoError) throw associacaoError
        }

        setMensagem({ tipo: 'success', texto: 'Usuário criado com sucesso!' })
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/admin/usuarios')
        }, 2000)
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error)
      setMensagem({ 
        tipo: 'error', 
        texto: error.message || 'Erro ao criar usuário' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/usuarios"
          className="btn btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Usuário</h1>
          <p className="mt-2 text-gray-600">
            Cadastre um novo usuário no sistema
          </p>
        </div>
      </div>

      {/* Mensagem de Status */}
      {mensagem && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          mensagem.tipo === 'success' ? 'bg-green-100 text-green-800' :
          mensagem.tipo === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {mensagem.tipo === 'success' && <CheckCircle className="h-5 w-5" />}
          {mensagem.tipo === 'error' && <AlertTriangle className="h-5 w-5" />}
          {mensagem.tipo === 'info' && <User className="h-5 w-5" />}
          {mensagem.texto}
        </div>
      )}

      {/* Formulário */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome_completo}
                    onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                    className="input"
                    placeholder="João da Silva"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={formData.nome_usuario}
                    onChange={(e) => handleInputChange('nome_usuario', e.target.value)}
                    className="input"
                    placeholder="joao.silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input"
                    placeholder="joao@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className="input"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Tipo de Usuário */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Tipo de Usuário
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={formData.is_admin}
                    onChange={(e) => handleInputChange('is_admin', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                    Administrador do Sistema
                  </label>
                </div>
                
                {!formData.is_admin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Função
                      </label>
                      <select
                        value={formData.funcao}
                        onChange={(e) => handleInputChange('funcao', e.target.value)}
                        className="input"
                      >
                        <option value="cliente">Cliente</option>
                        <option value="gerente">Gerente</option>
                        <option value="transportador">Transportador</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={formData.id_empresa}
                        onChange={(e) => handleInputChange('id_empresa', e.target.value)}
                        className="input"
                        placeholder="ID da empresa (ex: E1)"
                        disabled={formData.funcao === 'cliente'}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link
                href="/admin/usuarios"
                className="btn btn-secondary"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <div className="spinner h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}






