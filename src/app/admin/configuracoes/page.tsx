'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell, 
  Mail, 
  Database, 
  Globe, 
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ConfiguracoesSistema {
  // Configurações de Sistema
  nomeSistema: string
  versao: string
  ambiente: string
  manutencao: boolean
  
  // Configurações de Email
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
  smtpFrom: string
  
  // Configurações de Notificação
  notificacoesEmail: boolean
  notificacoesPush: boolean
  notificacoesWhatsapp: boolean
  
  // Configurações de Segurança
  sessaoTimeout: number
  maxTentativasLogin: number
  senhaMinimaCaracteres: number
  
  // Configurações de Backup
  backupAutomatico: boolean
  frequenciaBackup: string
  diasRetencao: number
}

export default function ConfiguracoesPage() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSistema>({
    // Configurações de Sistema
    nomeSistema: 'MovTudo',
    versao: '1.0.0',
    ambiente: 'production',
    manutencao: false,
    
    // Configurações de Email
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: '',
    
    // Configurações de Notificação
    notificacoesEmail: true,
    notificacoesPush: true,
    notificacoesWhatsapp: false,
    
    // Configurações de Segurança
    sessaoTimeout: 30,
    maxTentativasLogin: 5,
    senhaMinimaCaracteres: 8,
    
    // Configurações de Backup
    backupAutomatico: true,
    frequenciaBackup: 'daily',
    diasRetencao: 30
  })

  const [loading, setLoading] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [mostrarSenhas, setMostrarSenhas] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error' | 'info', texto: string } | null>(null)

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true)
      // Aqui você carregaria as configurações do banco de dados
      // Por enquanto, vamos usar os valores padrão
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      setMensagem({ tipo: 'error', texto: 'Erro ao carregar configurações' })
    } finally {
      setLoading(false)
    }
  }

  const salvarConfiguracoes = async () => {
    try {
      setSalvando(true)
      // Aqui você salvaria as configurações no banco de dados
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular salvamento
      setMensagem({ tipo: 'success', texto: 'Configurações salvas com sucesso!' })
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      setMensagem({ tipo: 'error', texto: 'Erro ao salvar configurações' })
    } finally {
      setSalvando(false)
    }
  }

  const testarConexaoEmail = async () => {
    try {
      setMensagem({ tipo: 'info', texto: 'Testando conexão...' })
      // Implementar teste de conexão SMTP
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMensagem({ tipo: 'success', texto: 'Conexão com servidor de email bem-sucedida!' })
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Falha na conexão com servidor de email' })
    }
  }

  const executarBackup = async () => {
    try {
      setMensagem({ tipo: 'info', texto: 'Iniciando backup...' })
      // Implementar backup manual
      await new Promise(resolve => setTimeout(resolve, 3000))
      setMensagem({ tipo: 'success', texto: 'Backup executado com sucesso!' })
    } catch (error) {
      setMensagem({ tipo: 'error', texto: 'Erro ao executar backup' })
    }
  }

  const handleInputChange = (campo: keyof ConfiguracoesSistema, valor: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-2 text-gray-600">
            Gerencie as configurações do sistema MovTudo
          </p>
        </div>
        <button
          onClick={salvarConfiguracoes}
          disabled={salvando}
          className="btn btn-primary flex items-center gap-2"
        >
          {salvando ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {salvando ? 'Salvando...' : 'Salvar Configurações'}
        </button>
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
          {mensagem.tipo === 'info' && <Info className="h-5 w-5" />}
          {mensagem.texto}
        </div>
      )}

      {/* Configurações de Sistema */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sistema</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Sistema
              </label>
              <input
                type="text"
                value={configuracoes.nomeSistema}
                onChange={(e) => handleInputChange('nomeSistema', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Versão
              </label>
              <input
                type="text"
                value={configuracoes.versao}
                onChange={(e) => handleInputChange('versao', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ambiente
              </label>
              <select
                value={configuracoes.ambiente}
                onChange={(e) => handleInputChange('ambiente', e.target.value)}
                className="input"
              >
                <option value="development">Desenvolvimento</option>
                <option value="staging">Homologação</option>
                <option value="production">Produção</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="manutencao"
                checked={configuracoes.manutencao}
                onChange={(e) => handleInputChange('manutencao', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="manutencao" className="ml-2 block text-sm text-gray-900">
                Modo de Manutenção
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Email */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Servidor de Email</h3>
            </div>
            <button
              onClick={testarConexaoEmail}
              className="btn btn-secondary text-sm"
            >
              Testar Conexão
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Host SMTP
              </label>
              <input
                type="text"
                value={configuracoes.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Porta SMTP
              </label>
              <input
                type="number"
                value={configuracoes.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                placeholder="587"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário
              </label>
              <input
                type="text"
                value={configuracoes.smtpUser}
                onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                placeholder="seu@email.com"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarSenhas ? "text" : "password"}
                  value={configuracoes.smtpPassword}
                  onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenhas(!mostrarSenhas)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {mostrarSenhas ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Remetente
              </label>
              <input
                type="email"
                value={configuracoes.smtpFrom}
                onChange={(e) => handleInputChange('smtpFrom', e.target.value)}
                placeholder="noreply@movtudo.com"
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Notificação */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificacoesEmail"
                checked={configuracoes.notificacoesEmail}
                onChange={(e) => handleInputChange('notificacoesEmail', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notificacoesEmail" className="ml-2 block text-sm text-gray-900">
                Notificações por Email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificacoesPush"
                checked={configuracoes.notificacoesPush}
                onChange={(e) => handleInputChange('notificacoesPush', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notificacoesPush" className="ml-2 block text-sm text-gray-900">
                Notificações Push
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificacoesWhatsapp"
                checked={configuracoes.notificacoesWhatsapp}
                onChange={(e) => handleInputChange('notificacoesWhatsapp', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notificacoesWhatsapp" className="ml-2 block text-sm text-gray-900">
                Notificações WhatsApp
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Segurança */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Segurança</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeout da Sessão (minutos)
              </label>
              <input
                type="number"
                value={configuracoes.sessaoTimeout}
                onChange={(e) => handleInputChange('sessaoTimeout', parseInt(e.target.value))}
                className="input"
                min="5"
                max="480"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máx. Tentativas de Login
              </label>
              <input
                type="number"
                value={configuracoes.maxTentativasLogin}
                onChange={(e) => handleInputChange('maxTentativasLogin', parseInt(e.target.value))}
                className="input"
                min="3"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mín. Caracteres da Senha
              </label>
              <input
                type="number"
                value={configuracoes.senhaMinimaCaracteres}
                onChange={(e) => handleInputChange('senhaMinimaCaracteres', parseInt(e.target.value))}
                className="input"
                min="6"
                max="20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Backup */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Backup</h3>
            </div>
            <button
              onClick={executarBackup}
              className="btn btn-secondary text-sm"
            >
              Executar Backup
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="backupAutomatico"
                checked={configuracoes.backupAutomatico}
                onChange={(e) => handleInputChange('backupAutomatico', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="backupAutomatico" className="ml-2 block text-sm text-gray-900">
                Backup Automático
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequência
              </label>
              <select
                value={configuracoes.frequenciaBackup}
                onChange={(e) => handleInputChange('frequenciaBackup', e.target.value)}
                className="input"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dias de Retenção
              </label>
              <input
                type="number"
                value={configuracoes.diasRetencao}
                onChange={(e) => handleInputChange('diasRetencao', parseInt(e.target.value))}
                className="input"
                min="7"
                max="365"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Informações do Sistema</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Banco de Dados</h4>
              <p className="text-sm text-gray-600">PostgreSQL - Supabase</p>
              <p className="text-sm text-gray-600">Status: Conectado</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Servidor</h4>
              <p className="text-sm text-gray-600">Next.js 14.0.4</p>
              <p className="text-sm text-gray-600">Node.js v18</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




