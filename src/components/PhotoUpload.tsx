'use client'

import { useState } from 'react'
import { Upload, User, X, Loader2 } from 'lucide-react'
import { uploadUserPhoto, formatFileSize, isImageFile } from '@/lib/storage'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface PhotoUploadProps {
  currentPhoto?: string | null
  onPhotoUpdate?: (photoUrl: string) => void
  userId?: string
  disabled?: boolean
}

export default function PhotoUpload({ 
  currentPhoto, 
  onPhotoUpdate, 
  userId, 
  disabled = false 
}: PhotoUploadProps) {
  const { user, refreshUser } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    if (!isImageFile(file)) {
      toast.error('Por favor, selecione apenas arquivos de imagem (JPG, PNG, WEBP, SVG)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 5MB')
      return
    }

    setUploading(true)
    
    try {
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Fazer upload
      const targetUserId = userId || user?.uid
      if (!targetUserId) {
        throw new Error('ID do usuário não encontrado')
      }

      const uploadResult = await uploadUserPhoto(file, targetUserId)
      
      if (uploadResult.success && uploadResult.url) {
        // Atualizar no banco de dados
        const { error } = await supabase
          .from('usuarios')
          .update({ foto: uploadResult.url })
          .eq('uid', targetUserId)

        if (error) {
          throw error
        }

        // Atualizar contexto
        if (targetUserId === user?.uid) {
          await refreshUser()
        }

        // Callback para componente pai
        onPhotoUpdate?.(uploadResult.url)

        toast.success('Foto de perfil atualizada com sucesso!')
      } else {
        throw new Error(uploadResult.error || 'Erro no upload')
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload da foto:', error)
      toast.error(error.message || 'Erro ao fazer upload da foto')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = async () => {
    if (!user?.uid) return

    setUploading(true)
    try {
      // Deletar arquivo do storage se existir
      if (currentPhoto) {
        // Extrair o caminho do arquivo da URL
        const url = new URL(currentPhoto)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]
        const folder = pathParts[pathParts.length - 2]
        const filePath = `${folder}/${fileName}`

        // Deletar do storage
        const { error: deleteError } = await supabase.storage
          .from('box')
          .remove([filePath])

        if (deleteError) {
          console.warn('Erro ao deletar arquivo do storage:', deleteError)
          // Continua mesmo se não conseguir deletar do storage
        }
      }

      // Remover referência no banco de dados
      const { error } = await supabase
        .from('usuarios')
        .update({ foto: null })
        .eq('uid', user.uid)

      if (error) {
        throw error
      }

      await refreshUser()
      onPhotoUpdate?.('')
      setPreview(null)
      toast.success('Foto removida com sucesso!')
    } catch (error: any) {
      console.error('Erro ao remover foto:', error)
      toast.error('Erro ao remover foto')
    } finally {
      setUploading(false)
    }
  }

  const displayPhoto = preview || currentPhoto

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Foto atual/preview */}
      <div className="relative">
        {displayPhoto ? (
          <div className="relative">
            <img
              src={displayPhoto}
              alt="Foto de perfil"
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {!disabled && (
              <button
                onClick={removePhoto}
                disabled={uploading}
                className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
            <User className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Botão de upload */}
      {!disabled && (
        <div className="text-center">
          <div className="space-y-2">
            <label
              htmlFor="photo-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploading ? 'Enviando...' : displayPhoto ? 'Alterar Foto' : 'Adicionar Foto'}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileSelect(file)
                }
                // Limpar o input para permitir selecionar o mesmo arquivo novamente
                e.target.value = ''
              }}
              className="hidden"
              disabled={uploading}
            />
            
            {displayPhoto && (
              <button
                onClick={removePhoto}
                disabled={uploading}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <X className="h-3 w-3 mr-1" />
                Remover Foto
              </button>
            )}
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG, WEBP, SVG até 5MB
          </p>
        </div>
      )}
    </div>
  )
}
