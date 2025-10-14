import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

export interface UploadOptions {
  folder: 'imagens' | 'foto_perfil' | 'logo' | 'pdf'
  fileName?: string
  userId?: string
  empresaId?: string
}

/**
 * Upload de arquivo para o Supabase Storage
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Validar tipo de arquivo
    const validation = validateFile(file, options.folder)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Gerar nome único para o arquivo
    const fileName = options.fileName || generateUniqueFileName(file, options)
    const filePath = `${options.folder}/${fileName}`

    // Fazer upload do arquivo
    const { data, error } = await supabase.storage
      .from('box')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Erro no upload:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('box')
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    }

  } catch (error: any) {
    console.error('Erro no upload:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido no upload'
    }
  }
}

/**
 * Deletar arquivo do Supabase Storage
 */
export async function deleteFile(filePath: string): Promise<UploadResult> {
  try {
    const { error } = await supabase.storage
      .from('box')
      .remove([filePath])

    if (error) {
      console.error('Erro ao deletar arquivo:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }

  } catch (error: any) {
    console.error('Erro ao deletar arquivo:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao deletar arquivo'
    }
  }
}

/**
 * Obter URL pública de um arquivo
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('box')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

/**
 * Validar arquivo antes do upload
 */
function validateFile(file: File, folder: string): { valid: boolean; error?: string } {
  // Tamanho máximo: 5MB
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 5MB'
    }
  }

  // Validar tipos de arquivo por pasta
  const validTypes = {
    imagens: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    foto_perfil: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    logo: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
    pdf: ['application/pdf']
  }

  const allowedTypes = validTypes[folder as keyof typeof validTypes]
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Gerar nome único para o arquivo
 */
function generateUniqueFileName(file: File, options: UploadOptions): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = file.name.split('.').pop()
  
  let prefix = ''
  if (options.userId) {
    prefix = `user_${options.userId}_`
  } else if (options.empresaId) {
    prefix = `empresa_${options.empresaId}_`
  }

  return `${prefix}${timestamp}_${random}.${extension}`
}

/**
 * Upload de logo da empresa
 */
export async function uploadEmpresaLogo(
  file: File,
  empresaId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    folder: 'logo',
    empresaId,
    fileName: `logo_${empresaId}_${Date.now()}.${file.name.split('.').pop()}`
  })
}

/**
 * Upload de foto de perfil do usuário
 */
export async function uploadUserPhoto(
  file: File,
  userId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    folder: 'foto_perfil',
    userId,
    fileName: `perfil_${userId}_${Date.now()}.${file.name.split('.').pop()}`
  })
}

/**
 * Upload de imagem de objeto para transporte
 */
export async function uploadObjectImage(
  file: File,
  userId: string
): Promise<UploadResult> {
  return uploadFile(file, {
    folder: 'imagens',
    userId
  })
}

/**
 * Upload de PDF
 */
export async function uploadPDF(
  file: File,
  userId: string,
  fileName?: string
): Promise<UploadResult> {
  return uploadFile(file, {
    folder: 'pdf',
    userId,
    fileName
  })
}

/**
 * Formatar tamanho do arquivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Verificar se o arquivo é uma imagem
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Verificar se o arquivo é um PDF
 */
export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf'
}






