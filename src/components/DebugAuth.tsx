'use client'

import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

export default function DebugAuth() {
  const { user, empresa, empresaAssociada, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [sessionInfo, setSessionInfo] = useState<any>({})

  useEffect(() => {
    const getDebugInfo = async () => {
      try {
        // Informações da sessão atual
        const { data: { session } } = await supabase.auth.getSession()
        setSessionInfo(session)

        // Informações do localStorage
        const localStorageInfo: Record<string, string | null> = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('auth'))) {
            localStorageInfo[key] = localStorage.getItem(key)
          }
        }

        setDebugInfo({
          localStorage: localStorageInfo,
          sessionStorage: sessionStorage.length,
          cookies: document.cookie,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Erro ao obter debug info:', error)
      }
    }

    getDebugInfo()
  }, [])

  const clearAllData = async () => {
    try {
      // Logout do Supabase
      await supabase.auth.signOut()
      
      // Limpar storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Recarregar página
      window.location.reload()
    } catch (error) {
      console.error('Erro ao limpar dados:', error)
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs">
      <h3 className="font-bold mb-2">🔍 Debug Auth</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Loading:</strong> {loading ? 'Sim' : 'Não'}
        </div>
        
        <div>
          <strong>User:</strong> {user ? `${user.email} (${user.is_admin ? 'Admin' : 'User'})` : 'Não logado'}
        </div>
        
        <div>
          <strong>Empresa:</strong> {empresa ? empresa.empresa_nome : 'Nenhuma'}
        </div>
        
        <div>
          <strong>Associação:</strong> {empresaAssociada ? `${empresaAssociada.funcao} - ${empresaAssociada.empresa_nome}` : 'Nenhuma'}
        </div>
        
        <div>
          <strong>Sessão:</strong> {sessionInfo?.user ? 'Ativa' : 'Inativa'}
        </div>
        
        <div>
          <strong>Storage Items:</strong> {Object.keys(debugInfo.localStorage || {}).length}
        </div>
      </div>
      
      <button
        onClick={clearAllData}
        className="mt-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
      >
        🧹 Limpar Tudo
      </button>
    </div>
  )
}
