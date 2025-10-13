'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle, Car, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleWhatsApp = () => {
    const { nome, assunto, mensagem } = formData
    const texto = encodeURIComponent(
      `*Contato MovTudo*\n\n` +
      `*Nome:* ${nome || '(não informado)'}\n` +
      `*Assunto:* ${assunto || '(não informado)'}\n\n` +
      `*Mensagem:*\n${mensagem || '(não informado)'}`
    )
    window.open(`https://wa.me/552132727548?text=${texto}`, '_blank')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email || !formData.assunto || !formData.mensagem) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor, insira um email válido')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('mensagens_contato')
        .insert([{
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
          assunto: formData.assunto,
          mensagem: formData.mensagem
        }])

      if (error) {
        throw error
      }

      setEnviado(true)
      toast.success('Mensagem enviada com sucesso!')
      
      // Resetar formulário após 3 segundos
      setTimeout(() => {
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          assunto: '',
          mensagem: ''
        })
        setEnviado(false)
      }, 3000)
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem. Tente pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Link>
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Car className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-lg font-bold text-gray-900">MovTudo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através de qualquer um dos canais abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contato via WhatsApp */}
          <div className="card p-8">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">WhatsApp</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Fale diretamente conosco pelo WhatsApp. Resposta rápida e atendimento personalizado.
            </p>
            <a 
              href="https://wa.me/552132727548" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Abrir WhatsApp
            </a>
          </div>

          {/* Contato via Email */}
          <div className="card p-8">
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Email</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Envie um email para nós. Respondemos em até 24 horas úteis.
            </p>
            <a 
              href="mailto:comercial@abistec.com.br" 
              className="btn btn-secondary w-full"
            >
              <Mail className="mr-2 h-5 w-5" />
              comercial@abistec.com.br
            </a>
          </div>

          {/* Telefone */}
          <div className="card p-8">
            <div className="flex items-center mb-4">
              <div className="bg-secondary-100 p-3 rounded-lg">
                <Phone className="h-8 w-8 text-secondary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Telefone</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Ligue para nós durante o horário comercial.
            </p>
            <a 
              href="tel:+552132727548" 
              className="btn btn-secondary w-full"
            >
              <Phone className="mr-2 h-5 w-5" />
              (21) 3272-7548
            </a>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Segunda a Sexta: 9h às 18h
            </p>
          </div>

          {/* Endereço */}
          <div className="card p-8">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Endereço</h2>
            </div>
            <p className="text-gray-600 mb-2">
              <strong>Abistec Serviços Tecnológicos LTDA</strong>
            </p>
            <p className="text-gray-600">
              Rio de Janeiro - RJ<br />
              Brasil
            </p>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Ou envie uma mensagem
          </h2>
          
          {enviado ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Mensagem Enviada!
              </h3>
              <p className="text-gray-600">
                Recebemos sua mensagem e entraremos em contato em breve.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Seu nome"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="seu@email.com"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="(00) 00000-0000"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto *
                </label>
                <select
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleInputChange}
                  className="input w-full"
                  disabled={loading}
                  required
                >
                  <option value="">Selecione um assunto</option>
                  <option value="comercial">Informações Comerciais</option>
                  <option value="suporte">Suporte Técnico</option>
                  <option value="duvida">Dúvidas Gerais</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={6}
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Escreva sua mensagem aqui..."
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full btn-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  disabled={loading}
                  className="btn btn-secondary w-full btn-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Ou Enviar via WhatsApp
                </button>
              </div>

              <p className="text-xs text-center text-gray-500">
                * Campos obrigatórios
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

