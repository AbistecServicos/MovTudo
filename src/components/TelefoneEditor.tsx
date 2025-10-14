'use client'

import { useState } from 'react'
import { Phone, Edit2, Check, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface TelefoneEditorProps {
  currentTelefone: string
  userId: string
  disabled?: boolean
}

export default function TelefoneEditor({ 
  currentTelefone, 
  userId,
  disabled = false 
}: TelefoneEditorProps) {
  const { refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [telefone, setTelefone] = useState(currentTelefone)
  const [saving, setSaving] = useState(false)

  const formatTelefone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value)
    setTelefone(formatted)
  }

  const validateTelefone = (tel: string) => {
    // Remove formatação e verifica se tem 10 ou 11 dígitos
    const numbers = tel.replace(/\D/g, '')
    return numbers.length === 10 || numbers.length === 11
  }

  const handleSave = async () => {
    if (!validateTelefone(telefone)) {
      toast.error('Telefone deve ter 10 ou 11 dígitos')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ telefone })
        .eq('uid', userId)

      if (error) {
        throw error
      }

      await refreshUser()
      setIsEditing(false)
      toast.success('Telefone atualizado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao atualizar telefone:', error)
      toast.error('Erro ao atualizar telefone')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setTelefone(currentTelefone)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
      <Phone className="w-5 h-5 text-gray-400 mr-3" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">Telefone</p>
        
        {isEditing ? (
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="tel"
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder="(00) 00000-0000"
              className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={saving}
              maxLength={15}
            />
            <button
              onClick={handleSave}
              disabled={saving || !validateTelefone(telefone)}
              className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Salvar"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
              title="Cancelar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">{currentTelefone}</p>
            {!disabled && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Editar telefone"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}







