'use client'

import { useState, useEffect } from 'react'
import { Mail, Calendar, User, Phone, MessageCircle, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Mensagem {
  id: number
  nome: string
  email: string
  telefone: string | null
  assunto: string
  mensagem: string
  lida: boolean
  data_envio: string
  data_leitura: string | null
}

export default function MensagensPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todas' | 'nao_lidas' | 'lidas'>('todas')

  useEffect(() => {
    loadMensagens()
  }, [])

  const loadMensagens = async () => {
    try {
      const { data, error } = await supabase
        .from('mensagens_contato')
        .select('*')
        .order('data_envio', { ascending: false })

      if (error) {
        throw error
      }

      setMensagens(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error)
      toast.error('Erro ao carregar mensagens')
    } finally {
      setLoading(false)
    }
  }

  const marcarComoLida = async (id: number) => {
    try {
      const { error } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: true,
          data_leitura: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Mensagem marcada como lida')
      loadMensagens()
    } catch (error: any) {
      console.error('Erro ao marcar mensagem:', error)
      toast.error('Erro ao marcar mensagem')
    }
  }

  const marcarComoNaoLida = async (id: number) => {
    try {
      const { error } = await supabase
        .from('mensagens_contato')
        .update({ 
          lida: false,
          data_leitura: null
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Mensagem marcada como não lida')
      loadMensagens()
    } catch (error: any) {
      console.error('Erro ao marcar mensagem:', error)
      toast.error('Erro ao marcar mensagem')
    }
  }

  const mensagensFiltradas = mensagens.filter(msg => {
    if (filtro === 'nao_lidas') return !msg.lida
    if (filtro === 'lidas') return msg.lida
    return true
  })

  const naoLidas = mensagens.filter(m => !m.lida).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensagens de Contato</h1>
        <p className="text-gray-600">
          Mensagens enviadas através do formulário de contato do site
        </p>
      </div>

      {/* Filtros e Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setFiltro('todas')}
          className={`card p-4 text-left hover:shadow-md transition-shadow ${
            filtro === 'todas' ? 'ring-2 ring-primary-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{mensagens.length}</p>
            </div>
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
        </button>

        <button
          onClick={() => setFiltro('nao_lidas')}
          className={`card p-4 text-left hover:shadow-md transition-shadow ${
            filtro === 'nao_lidas' ? 'ring-2 ring-primary-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Não Lidas</p>
              <p className="text-2xl font-bold text-orange-600">{naoLidas}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
        </button>

        <button
          onClick={() => setFiltro('lidas')}
          className={`card p-4 text-left hover:shadow-md transition-shadow ${
            filtro === 'lidas' ? 'ring-2 ring-primary-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lidas</p>
              <p className="text-2xl font-bold text-green-600">{mensagens.length - naoLidas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </button>
      </div>

      {/* Lista de Mensagens */}
      {mensagensFiltradas.length === 0 ? (
        <div className="card p-12 text-center">
          <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma mensagem
          </h3>
          <p className="text-gray-600">
            {filtro === 'nao_lidas' && 'Não há mensagens não lidas'}
            {filtro === 'lidas' && 'Não há mensagens lidas'}
            {filtro === 'todas' && 'Ainda não há mensagens de contato'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mensagensFiltradas.map((msg) => (
            <div
              key={msg.id}
              className={`card p-6 ${
                !msg.lida ? 'ring-2 ring-orange-200 bg-orange-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.lida ? 'bg-gray-100' : 'bg-orange-100'
                  }`}>
                    {msg.lida ? (
                      <CheckCircle className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Mail className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {msg.nome}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                        {msg.assunto}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        <a href={`mailto:${msg.email}`} className="hover:text-primary-600">
                          {msg.email}
                        </a>
                      </div>
                      
                      {msg.telefone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <a href={`tel:${msg.telefone}`} className="hover:text-primary-600">
                            {msg.telefone}
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(msg.data_envio).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{msg.mensagem}</p>
                    </div>

                    <div className="flex gap-2">
                      {!msg.lida ? (
                        <button
                          onClick={() => marcarComoLida(msg.id)}
                          className="btn btn-sm btn-primary"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como Lida
                        </button>
                      ) : (
                        <button
                          onClick={() => marcarComoNaoLida(msg.id)}
                          className="btn btn-sm btn-outline"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Marcar como Não Lida
                        </button>
                      )}
                      
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${msg.assunto}`}
                        className="btn btn-sm btn-secondary"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Responder por Email
                      </a>

                      {msg.telefone && (
                        <a
                          href={`https://wa.me/${msg.telefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

