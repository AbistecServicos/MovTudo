'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Building2, Loader2, Upload, Image, X, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadEmpresaLogo, deleteFile } from '@/lib/storage'
import { Empresa } from '@/types'
import toast from 'react-hot-toast'

export default function EditarEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const empresaId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    empresa_nome: '',
    cnpj: '',
    empresa_endereco: '',
    empresa_telefone: '',
    empresa_cidade: '',
    empresa_estado: '',
    empresa_perimetro_entrega: '',
    slug: '',
    cor_primaria: '#3B82F6',
    cor_secundaria: '#10B981',
    sobre_empresa: '',
    ativa: true
  })

  useEffect(() => {
    loadEmpresa()
  }, [empresaId])

  const loadEmpresa = async () => {
    try {
      console.log('🔍 Carregando empresa ID:', empresaId)
      
      // Busca pela coluna 'id' (número inteiro)
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', parseInt(empresaId))
        .single()

      if (error) {
        console.error('❌ Erro ao buscar empresa:', error)
        toast.error('Empresa não encontrada')
        router.push('/admin/empresas')
        return
      }

      console.log('✅ Empresa encontrada:', data.empresa_nome)
      setEmpresa(data)
      setLogoPreview(data.empresa_logo)
      
      // Preencher formulário
      setFormData({
        empresa_nome: data.empresa_nome || '',
        cnpj: data.cnpj || '',
        empresa_endereco: data.empresa_endereco || '',
        empresa_telefone: data.empresa_telefone || '',
        empresa_cidade: data.empresa_cidade || '',
        empresa_estado: data.empresa_estado || '',
        empresa_perimetro_entrega: data.empresa_perimetro_entrega || '',
        slug: data.slug || '',
        cor_primaria: data.cor_primaria || '#3B82F6',
        cor_secundaria: data.cor_secundaria || '#10B981',
        sobre_empresa: data.sobre_empresa || '',
        ativa: data.ativa
      })
    } catch (error: any) {
      console.error('Erro ao carregar empresa:', error)
      toast.error('Erro ao carregar empresa')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value
    setFormData(prev => ({
      ...prev,
      empresa_nome: nome,
      slug: generateSlug(nome)
    }))
  }

  const validateForm = () => {
    const required = ['empresa_nome', 'cnpj', 'empresa_endereco', 'empresa_telefone', 'slug']
    const missing = required.filter(field => !formData[field as keyof typeof formData])
    
    if (missing.length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return false
    }

    // Validar CNPJ (formato básico)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    if (!cnpjRegex.test(formData.cnpj)) {
      toast.error('CNPJ deve estar no formato 00.000.000/0000-00')
      return false
    }

    // Validar telefone (formato básico)
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    if (!phoneRegex.test(formData.empresa_telefone)) {
      toast.error('Telefone deve estar no formato (00) 00000-0000')
      return false
    }

    return true
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast.error('Por favor, selecione uma imagem válida (JPG, PNG, WEBP ou SVG)')
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    // Criar preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    setNewLogoFile(file)
  }

  const handleUploadLogo = async () => {
    if (!newLogoFile || !empresa) return

    setUploadingLogo(true)
    try {
      console.log('📤 Fazendo upload do logo...')
      
      // Fazer upload
      const uploadResult = await uploadEmpresaLogo(newLogoFile, empresa.id_empresa)
      
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || 'Erro ao fazer upload')
      }

      // Deletar logo antigo se existir
      if (empresa.empresa_logo) {
        const oldLogoUrl = new URL(empresa.empresa_logo)
        const pathParts = oldLogoUrl.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]
        const folder = pathParts[pathParts.length - 2]
        const oldPath = `${folder}/${fileName}`
        await deleteFile(oldPath)
      }

      // Atualizar no banco de dados
      const { error } = await supabase
        .from('empresas')
        .update({ 
          empresa_logo: uploadResult.url,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', parseInt(empresaId))

      if (error) throw error

      console.log('✅ Logo atualizado com sucesso')
      toast.success('Logo atualizado com sucesso!')
      setNewLogoFile(null)
      await loadEmpresa() // Recarregar dados
    } catch (error: any) {
      console.error('Erro ao atualizar logo:', error)
      toast.error(error.message || 'Erro ao atualizar logo')
      // Restaurar preview anterior
      setLogoPreview(empresa?.empresa_logo || null)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleRemoveLogo = async () => {
    if (!empresa?.empresa_logo) return

    if (!confirm('Tem certeza que deseja remover o logo da empresa?')) {
      return
    }

    setUploadingLogo(true)
    try {
      console.log('🗑️ Removendo logo...')

      // Deletar do storage
      const logoUrl = new URL(empresa.empresa_logo)
      const pathParts = logoUrl.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      const folder = pathParts[pathParts.length - 2]
      const filePath = `${folder}/${fileName}`
      
      await deleteFile(filePath)

      // Remover do banco de dados
      const { error } = await supabase
        .from('empresas')
        .update({ 
          empresa_logo: null,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', parseInt(empresaId))

      if (error) throw error

      console.log('✅ Logo removido com sucesso')
      toast.success('Logo removido com sucesso!')
      setLogoPreview(null)
      await loadEmpresa() // Recarregar dados
    } catch (error: any) {
      console.error('Erro ao remover logo:', error)
      toast.error('Erro ao remover logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      console.log('💾 Salvando alterações da empresa...')
      
      const { error } = await supabase
        .from('empresas')
        .update({
          empresa_nome: formData.empresa_nome,
          cnpj: formData.cnpj,
          empresa_endereco: formData.empresa_endereco,
          empresa_telefone: formData.empresa_telefone,
          empresa_cidade: formData.empresa_cidade || null,
          empresa_estado: formData.empresa_estado || null,
          empresa_perimetro_entrega: formData.empresa_perimetro_entrega || null,
          slug: formData.slug,
          cor_primaria: formData.cor_primaria,
          cor_secundaria: formData.cor_secundaria,
          sobre_empresa: formData.sobre_empresa || null,
          ativa: formData.ativa,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', parseInt(empresaId))

      if (error) {
        throw error
      }

      console.log('✅ Empresa atualizada com sucesso')
      toast.success('Empresa atualizada com sucesso!')
      router.push('/admin/empresas')
    } catch (error: any) {
      console.error('Erro ao atualizar empresa:', error)
      if (error.code === '23505') {
        if (error.message.includes('cnpj')) {
          toast.error('Já existe uma empresa com este CNPJ')
        } else if (error.message.includes('slug')) {
          toast.error('Já existe uma empresa com este slug. Tente outro nome.')
        }
      } else {
        toast.error('Erro ao atualizar empresa')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Empresa não encontrada
        </h3>
        <div className="mt-6">
          <Link href="/admin/empresas" className="btn btn-primary">
            Voltar para empresas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/empresas"
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Editar Empresa
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Atualize as informações da empresa {empresa.empresa_nome}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Informações Básicas
                </h3>
              </div>
              <div className="card-body space-y-4">
                {/* ID da Empresa (Read-only) */}
                <div className="form-group">
                  <label className="form-label">
                    ID da Empresa
                  </label>
                  <div className="input bg-gray-50 text-gray-500 cursor-not-allowed">
                    {empresa.id_empresa}
                  </div>
                  <p className="form-help">
                    O ID da empresa não pode ser alterado
                  </p>
                </div>

                {/* Nome da Empresa */}
                <div className="form-group">
                  <label htmlFor="empresa_nome" className="form-label">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    id="empresa_nome"
                    name="empresa_nome"
                    value={formData.empresa_nome}
                    onChange={handleNomeChange}
                    className="input"
                    placeholder="Ex: Mototáxi Express"
                    disabled={saving}
                    required
                  />
                </div>

                {/* CNPJ */}
                <div className="form-group">
                  <label htmlFor="cnpj" className="form-label">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="00.000.000/0000-00"
                    disabled={saving}
                    required
                  />
                </div>

                {/* Endereço */}
                <div className="form-group">
                  <label htmlFor="empresa_endereco" className="form-label">
                    Endereço *
                  </label>
                  <textarea
                    id="empresa_endereco"
                    name="empresa_endereco"
                    value={formData.empresa_endereco}
                    onChange={handleInputChange}
                    className="input"
                    rows={3}
                    placeholder="Rua, número, bairro, cidade - UF"
                    disabled={saving}
                    required
                  />
                </div>

                {/* Telefone */}
                <div className="form-group">
                  <label htmlFor="empresa_telefone" className="form-label">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="empresa_telefone"
                    name="empresa_telefone"
                    value={formData.empresa_telefone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="(00) 00000-0000"
                    disabled={saving}
                    required
                  />
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="empresa_cidade" className="form-label">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="empresa_cidade"
                      name="empresa_cidade"
                      value={formData.empresa_cidade}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Ex: Rio de Janeiro"
                      disabled={saving}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="empresa_estado" className="form-label">
                      Estado
                    </label>
                    <select
                      id="empresa_estado"
                      name="empresa_estado"
                      value={formData.empresa_estado}
                      onChange={handleInputChange}
                      className="input"
                      disabled={saving}
                    >
                      <option value="">Selecione...</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="SP">São Paulo</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="ES">Espírito Santo</option>
                    </select>
                  </div>
                </div>

                {/* Perímetro de Entrega */}
                <div className="form-group">
                  <label htmlFor="empresa_perimetro_entrega" className="form-label">
                    Perímetro de Entrega
                  </label>
                  <input
                    type="text"
                    id="empresa_perimetro_entrega"
                    name="empresa_perimetro_entrega"
                    value={formData.empresa_perimetro_entrega}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ex: Zona Sul, Centro, Zona Norte"
                    disabled={saving}
                  />
                </div>

                {/* Sobre a Empresa */}
                <div className="form-group">
                  <label htmlFor="sobre_empresa" className="form-label">
                    Sobre a Empresa
                  </label>
                  <textarea
                    id="sobre_empresa"
                    name="sobre_empresa"
                    value={formData.sobre_empresa}
                    onChange={handleInputChange}
                    className="input"
                    rows={4}
                    placeholder="Breve descrição sobre a empresa..."
                    disabled={saving}
                  />
                </div>

                {/* Status Ativa */}
                <div className="form-group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ativa"
                      name="ativa"
                      checked={formData.ativa}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={saving}
                    />
                    <label htmlFor="ativa" className="ml-2 block text-sm text-gray-900">
                      Empresa ativa (disponível para receber corridas)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* URL Personalizada */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  URL Personalizada
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="slug" className="form-label">
                    Slug da Empresa *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      movtudo.com/
                    </span>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="mototaxi-express"
                      disabled={saving}
                      required
                    />
                  </div>
                  <p className="form-help">
                    URL personalizada para a empresa. Será usado para acessar: movtudo.com/{formData.slug}
                  </p>
                </div>
              </div>
            </div>

            {/* Cores */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Personalização Visual
                </h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="cor_primaria" className="form-label">
                      Cor Primária
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        id="cor_primaria"
                        name="cor_primaria"
                        value={formData.cor_primaria}
                        onChange={handleInputChange}
                        className="h-10 w-16 rounded border border-gray-300"
                        disabled={saving}
                      />
                      <input
                        type="text"
                        value={formData.cor_primaria}
                        readOnly
                        className="input flex-1 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cor_secundaria" className="form-label">
                      Cor Secundária
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        id="cor_secundaria"
                        name="cor_secundaria"
                        value={formData.cor_secundaria}
                        onChange={handleInputChange}
                        className="h-10 w-16 rounded border border-gray-300"
                        disabled={saving}
                      />
                      <input
                        type="text"
                        value={formData.cor_secundaria}
                        readOnly
                        className="input flex-1 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo da Empresa */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">
                  Logo da Empresa
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">
                    Logo Atual
                  </label>
                  
                  {logoPreview ? (
                    <div className="mt-1">
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Logo da empresa"
                          className="h-32 w-32 object-contain rounded-lg border border-gray-200 bg-gray-50 p-2"
                        />
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="mt-4 flex space-x-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingLogo || saving}
                          className="btn btn-secondary btn-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Trocar Logo
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          disabled={uploadingLogo || saving}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover Logo
                        </button>
                      </div>

                      {/* Botão de salvar novo logo (aparece após selecionar) */}
                      {newLogoFile && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={handleUploadLogo}
                            disabled={uploadingLogo}
                            className="btn btn-primary btn-sm"
                          >
                            {uploadingLogo ? (
                              <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                Salvando...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Novo Logo
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewLogoFile(null)
                              setLogoPreview(empresa?.empresa_logo || null)
                            }}
                            disabled={uploadingLogo}
                            className="ml-2 btn btn-secondary btn-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1">
                      <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm mb-3">Nenhum logo cadastrado</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingLogo || saving}
                          className="btn btn-primary btn-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Fazer Upload do Logo
                        </button>
                      </div>
                      
                      {/* Preview após selecionar (sem logo existente) */}
                      {newLogoFile && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={handleUploadLogo}
                            disabled={uploadingLogo}
                            className="btn btn-primary btn-sm"
                          >
                            {uploadingLogo ? (
                              <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                Salvando...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Logo
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewLogoFile(null)
                              setLogoPreview(null)
                            }}
                            disabled={uploadingLogo}
                            className="ml-2 btn btn-secondary btn-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Input oculto para seleção de arquivo */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Formatos aceitos: JPG, PNG, WEBP ou SVG. Tamanho máximo: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Link href="/admin/empresas" className="btn btn-secondary">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Preview da Empresa
              </h3>
            </div>
            <div className="card-body">
              <div className="text-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="mx-auto h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <Building2 className="h-8 w-8 text-primary-600" />
                  </div>
                )}
                <h4 className="text-lg font-semibold text-gray-900 mt-4">
                  {formData.empresa_nome || 'Nome da Empresa'}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.empresa_cidade && formData.empresa_estado
                    ? `${formData.empresa_cidade}, ${formData.empresa_estado}`
                    : 'Localização não informada'
                  }
                </p>
                {formData.slug && (
                  <p className="text-xs text-primary-600 mt-2">
                    movtudo.com/{formData.slug}
                  </p>
                )}
                
                {/* Status Badge */}
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.ativa
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-700 w-20">CNPJ:</span>
                  <span className="text-gray-500">
                    {formData.cnpj || 'Não informado'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-700 w-20">Telefone:</span>
                  <span className="text-gray-500">
                    {formData.empresa_telefone || 'Não informado'}
                  </span>
                </div>
                {formData.empresa_perimetro_entrega && (
                  <div className="flex items-start text-sm">
                    <span className="font-medium text-gray-700 w-20">Área:</span>
                    <span className="text-gray-500">
                      {formData.empresa_perimetro_entrega}
                    </span>
                  </div>
                )}
              </div>

              {/* Cores Preview */}
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Cores da Empresa
                </h5>
                <div className="flex space-x-2">
                  <div
                    className="h-8 w-8 rounded border border-gray-300"
                    style={{ backgroundColor: formData.cor_primaria }}
                  ></div>
                  <div
                    className="h-8 w-8 rounded border border-gray-300"
                    style={{ backgroundColor: formData.cor_secundaria }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


