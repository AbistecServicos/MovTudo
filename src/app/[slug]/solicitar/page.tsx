'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Empresa } from '@/types'
import { 
  Car, 
  MapPin, 
  Package, 
  User as UserIcon, 
  Mail, 
  Phone, 
  ArrowLeft,
  Send,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SolicitarCorridaPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user } = useAuth()
  
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    // Dados do cliente (se visitante)
    nome_cliente: '',
    email_cliente: '',
    telefone_cliente: '',
    
    // Tipo de serviço
    tipo: 'passageiro' as 'passageiro' | 'objeto',
    
    // Endereços
    origem_endereco: '',
    destino_endereco: '',
    
    // Detalhes do objeto (se aplicável)
    descricao_objeto: '',
    peso_kg: '',
    
    // Observações
    observacao_cliente: ''
  })

  useEffect(() => {
    if (slug) {
      loadEmpresa()
    }
  }, [slug])

  // Pré-preencher dados se usuário está logado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome_cliente: user.nome_completo || '',
        email_cliente: user.email || '',
        telefone_cliente: user.telefone || ''
      }))
    }
  }, [user])

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
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formData.origem_endereco || !formData.destino_endereco) {
      toast.error('Preencha origem e destino')
      return
    }

    if (!user) {
      // Se visitante, validar dados pessoais
      if (!formData.nome_cliente || !formData.email_cliente || !formData.telefone_cliente) {
        toast.error('Preencha seus dados de contato')
        return
      }
    }

    if (formData.tipo === 'objeto' && !formData.descricao_objeto) {
      toast.error('Descreva o objeto a ser transportado')
      return
    }

    setSubmitting(true)

    try {
      console.log('📤 Criando pedido de corrida...')
      
      const corridaData = {
        id_empresa: empresa!.id_empresa,
        
        // Dados do cliente
        cliente_uid: user?.uid || null,
        nome_cliente: user ? user.nome_completo : formData.nome_cliente,
        email_cliente: user ? user.email : formData.email_cliente,
        telefone_cliente: user ? user.telefone : formData.telefone_cliente,
        
        // Tipo
        tipo: formData.tipo,
        
        // Endereços
        origem_endereco: formData.origem_endereco,
        destino_endereco: formData.destino_endereco,
        
        // Detalhes do objeto
        descricao_objeto: formData.tipo === 'objeto' ? formData.descricao_objeto : null,
        peso_kg: formData.tipo === 'objeto' && formData.peso_kg ? parseFloat(formData.peso_kg) : null,
        
        // Observações
        observacao_cliente: formData.observacao_cliente || null,
        
        // Status inicial
        status_transporte: 'aguardando',
        
        // Dados da empresa (duplicados para performance)
        empresa_nome: empresa!.empresa_nome,
        empresa_telefone: empresa!.empresa_telefone,
        empresa_endereco: empresa!.empresa_endereco,
        
        // Data
        data: new Date().toISOString()
      }

      const { data: corrida, error } = await supabase
        .from('corridas')
        .insert(corridaData)
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log('✅ Corrida criada:', corrida.id)
      toast.success('Pedido enviado com sucesso!')
      
      // Redirecionar para página de acompanhamento
      setTimeout(() => {
        router.push(`/${slug}/corrida/${corrida.id}`)
      }, 1500)
      
    } catch (error: any) {
      console.error('Erro ao criar corrida:', error)
      toast.error('Erro ao enviar pedido. Tente novamente.')
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

      {/* Form */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Car className="mx-auto h-12 w-12" style={{ color: empresa.cor_primaria }} />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Solicitar Corrida
            </h1>
            <p className="mt-2 text-gray-600">
              {user ? `Olá, ${user.nome_completo}!` : 'Preencha os dados abaixo'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card de dados pessoais (apenas se visitante) */}
            {!user && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">
                    Seus Dados
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ou{' '}
                    <Link 
                      href={`/${slug}/login`}
                      className="font-medium hover:underline"
                      style={{ color: empresa.cor_primaria }}
                    >
                      faça login
                    </Link>
                    {' '}para preencher automaticamente
                  </p>
                </div>
                <div className="card-body space-y-4">
                  {/* Nome */}
                  <div className="form-group">
                    <label htmlFor="nome" className="form-label">
                      <UserIcon className="inline h-4 w-4 mr-1" />
                      Nome Completo *
                    </label>
                    <input
                      id="nome"
                      type="text"
                      required
                      value={formData.nome_cliente}
                      onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
                      className="input"
                      placeholder="João Silva"
                      disabled={submitting}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email_cliente}
                      onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
                      className="input"
                      placeholder="seu@email.com"
                      disabled={submitting}
                    />
                  </div>

                  {/* Telefone */}
                  <div className="form-group">
                    <label htmlFor="telefone" className="form-label">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Telefone *
                    </label>
                    <input
                      id="telefone"
                      type="tel"
                      required
                      value={formData.telefone_cliente}
                      onChange={(e) => setFormData({ ...formData, telefone_cliente: e.target.value })}
                      className="input"
                      placeholder="(21) 99999-9999"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Card de tipo de serviço */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Tipo de Serviço
                </h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'passageiro' })}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.tipo === 'passageiro'
                        ? 'border-2 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={formData.tipo === 'passageiro' ? { borderColor: empresa.cor_primaria } : {}}
                    disabled={submitting}
                  >
                    <Car className="mx-auto h-8 w-8 mb-2" style={formData.tipo === 'passageiro' ? { color: empresa.cor_primaria } : { color: '#9CA3AF' }} />
                    <div className="font-medium">Passageiro</div>
                    <div className="text-xs text-gray-500">Transporte de pessoa</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: 'objeto' })}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.tipo === 'objeto'
                        ? 'border-2 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={formData.tipo === 'objeto' ? { borderColor: empresa.cor_secundaria } : {}}
                    disabled={submitting}
                  >
                    <Package className="mx-auto h-8 w-8 mb-2" style={formData.tipo === 'objeto' ? { color: empresa.cor_secundaria } : { color: '#9CA3AF' }} />
                    <div className="font-medium">Objeto</div>
                    <div className="text-xs text-gray-500">Entrega de encomenda</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Card de endereços */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Endereços
                </h3>
              </div>
              <div className="card-body space-y-4">
                {/* Origem */}
                <div className="form-group">
                  <label htmlFor="origem" className="form-label">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Origem *
                  </label>
                  <input
                    id="origem"
                    type="text"
                    required
                    value={formData.origem_endereco}
                    onChange={(e) => setFormData({ ...formData, origem_endereco: e.target.value })}
                    className="input"
                    placeholder="Rua das Flores, 123 - Centro"
                    disabled={submitting}
                  />
                  <p className="form-help">
                    Endereço de partida
                  </p>
                </div>

                {/* Destino */}
                <div className="form-group">
                  <label htmlFor="destino" className="form-label">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Destino *
                  </label>
                  <input
                    id="destino"
                    type="text"
                    required
                    value={formData.destino_endereco}
                    onChange={(e) => setFormData({ ...formData, destino_endereco: e.target.value })}
                    className="input"
                    placeholder="Av. Atlântica, 456 - Copacabana"
                    disabled={submitting}
                  />
                  <p className="form-help">
                    Endereço de chegada
                  </p>
                </div>
              </div>
            </div>

            {/* Card de detalhes do objeto (se tipo = objeto) */}
            {formData.tipo === 'objeto' && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalhes do Objeto
                  </h3>
                </div>
                <div className="card-body space-y-4">
                  {/* Descrição */}
                  <div className="form-group">
                    <label htmlFor="descricao" className="form-label">
                      Descrição do Objeto *
                    </label>
                    <textarea
                      id="descricao"
                      required
                      value={formData.descricao_objeto}
                      onChange={(e) => setFormData({ ...formData, descricao_objeto: e.target.value })}
                      className="input"
                      rows={3}
                      placeholder="Ex: Caixa com documentos"
                      disabled={submitting}
                    />
                  </div>

                  {/* Peso */}
                  <div className="form-group">
                    <label htmlFor="peso" className="form-label">
                      Peso Estimado (kg)
                    </label>
                    <input
                      id="peso"
                      type="number"
                      step="0.1"
                      value={formData.peso_kg}
                      onChange={(e) => setFormData({ ...formData, peso_kg: e.target.value })}
                      className="input"
                      placeholder="5.0"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Card de observações */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Observações
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="observacoes" className="form-label">
                    Informações Adicionais (opcional)
                  </label>
                  <textarea
                    id="observacoes"
                    value={formData.observacao_cliente}
                    onChange={(e) => setFormData({ ...formData, observacao_cliente: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Ex: Portão azul, interfone 201"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Botão de envio */}
            <div className="flex justify-end space-x-3">
              <Link href={`/${slug}`} className="btn btn-secondary">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ backgroundColor: empresa.cor_primaria }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Solicitar Corrida
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} {empresa.empresa_nome}
        </div>
      </footer>
    </div>
  )
}


