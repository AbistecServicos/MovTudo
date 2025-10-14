'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useIsAdmin } from '@/context/AuthContext'
import Link from 'next/link'
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react'

export default function GuiaTestesAdminPage() {
  const { user } = useAuth()
  const isAdmin = useIsAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (isAdmin === false) {
      router.push('/')
      return
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/guia-testes/GUIA_TESTES_AUGUSTO.pdf" 
                target="_blank"
                className="btn btn-secondary flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver PDF
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
            Guia de Testes - MovTudo
          </h1>
          <p className="text-lg text-gray-600">
            Manual completo para testar todas as funcionalidades do sistema
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Acesso restrito aos administradores do sistema
          </div>
        </div>

        {/* HTML Content Container */}
        <div className="card p-0 overflow-hidden">
          <div className="bg-primary-600 text-white p-4">
            <h2 className="text-lg font-semibold">Conteúdo do Guia de Testes</h2>
            <p className="text-primary-100 text-sm">Documentação completa em formato HTML</p>
          </div>
          
          {/* Embed HTML Content */}
          <div className="p-6">
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm">
                    <strong>Dica:</strong> Os links do índice funcionam melhor quando abertos em nova aba. 
                    Use o botão abaixo para melhor experiência de navegação.
                  </p>
                </div>
              </div>
            </div>
            
            <iframe
              src="/guia-testes/GUIA_TESTES_AUGUSTO.html"
              className="w-full h-[800px] border border-gray-200 rounded-lg"
              title="Guia de Testes MovTudo"
              onError={(e) => {
                console.error('Erro ao carregar HTML:', e)
                // Fallback content
                const target = e.target as HTMLIFrameElement
                if (target) {
                  target.style.display = 'none'
                  const fallback = document.createElement('div')
                  fallback.innerHTML = `
                    <div class="text-center py-8">
                      <BookOpen class="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 class="text-lg font-semibold text-gray-900 mb-2">Guia de Testes</h3>
                      <p class="text-gray-600 mb-4">Erro ao carregar o conteúdo</p>
                      <a href="/guia-testes/GUIA_TESTES_AUGUSTO.html" target="_blank" class="btn btn-primary">
                        Abrir em nova aba
                      </a>
                    </div>
                  `
                  target.parentNode?.appendChild(fallback)
                }
              }}
            />
            
            {/* Action Links */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link 
                href="/guia-testes/GUIA_TESTES_AUGUSTO.html" 
                target="_blank"
                className="btn btn-outline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir HTML em Nova Aba
              </Link>
              
              <Link 
                href="/guia-testes/GUIA_TESTES_AUGUSTO.pdf" 
                target="_blank"
                className="btn btn-secondary flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Baixar PDF
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/admin/empresas" 
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gerenciar Empresas</h3>
            <p className="text-gray-600 text-sm">Criar e editar empresas para teste</p>
          </Link>

          <Link 
            href="/admin/usuarios" 
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gerenciar Usuários</h3>
            <p className="text-gray-600 text-sm">Criar usuários de teste</p>
          </Link>

          <Link 
            href="/docs" 
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentação Técnica</h3>
            <p className="text-gray-600 text-sm">Manual técnico completo</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
