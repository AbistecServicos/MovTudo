'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Building2, Loader2, Upload, Image, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { NovaEmpresaForm } from '@/types'
import { uploadEmpresaLogo, formatFileSize, isImageFile } from '@/lib/storage'
import toast from 'react-hot-toast'

export default function NovaEmpresaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<NovaEmpresaForm>({
    id_empresa: '',
    empresa_nome: '',
    cnpj: '',
    empresa_endereco: '',
    empresa_telefone: '',
    empresa_cidade: '',
    empresa_estado: '',
    empresa_perimetro_entrega: '',
    slug: '',
    cor_primaria: '#3B82F6',
    cor_secundaria: '#10B981'
  })
  
  const [tipoEmpresa, setTipoEmpresa] = useState<'taxi' | 'transportadora' | 'delivery' | 'multisservico'>('taxi')
  const [servicosOferecidos, setServicosOferecidos] = useState<string[]>(['passageiro', 'objeto'])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleIdEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    // Permitir apenas formato E seguido de números
    const formattedValue = value.replace(/[^E0-9]/g, '')
    setFormData(prev => ({
      ...prev,
      id_empresa: formattedValue
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

  const handleTipoEmpresaChange = (tipo: 'taxi' | 'transportadora' | 'delivery' | 'multisservico') => {
    setTipoEmpresa(tipo)
    
    // Atualizar serviços padrão conforme o tipo
    const servicosPadrao = {
      taxi: ['passageiro', 'objeto'],
      transportadora: ['carga'],
      delivery: ['objeto'],
      multisservico: ['passageiro', 'objeto', 'carga']
    }
    setServicosOferecidos(servicosPadrao[tipo])
  }

  const handleServicoToggle = (servico: string) => {
    setServicosOferecidos(prev => {
      if (prev.includes(servico)) {
        return prev.filter(s => s !== servico)
      } else {
        return [...prev, servico]
      }
    })
  }

  const handleLogoUpload = async (file: File) => {
    if (!isImageFile(file)) {
      toast.error('Por favor, selecione apenas arquivos de imagem (JPG, PNG, WEBP, SVG)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 5MB')
      return
    }

    setUploadingLogo(true)
    try {
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      setLogoFile(file)
      toast.success('Logo selecionado com sucesso!')
    } catch (error) {
      console.error('Erro ao processar logo:', error)
      toast.error('Erro ao processar o arquivo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    toast.success('Logo removido')
  }

  const validateForm = () => {
    const required = ['id_empresa', 'empresa_nome', 'cnpj', 'empresa_endereco', 'empresa_telefone', 'slug']
    const missing = required.filter(field => !formData[field as keyof NovaEmpresaForm])
    
    if (missing.length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return false
    }

    // Validar formato do ID da empresa (E + números)
    const idRegex = /^E\d+$/
    if (!idRegex.test(formData.id_empresa)) {
      toast.error('ID da empresa deve estar no formato E1, E2, E3, etc.')
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

    // Validar serviços oferecidos
    if (servicosOferecidos.length === 0) {
      toast.error('Selecione pelo menos um serviço oferecido')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Verificar se o ID da empresa já existe
      const { data: existingEmpresa, error: checkError } = await supabase
        .from('empresas')
        .select('id_empresa')
        .eq('id_empresa', formData.id_empresa)
        .single()

      if (existingEmpresa) {
        toast.error('Já existe uma empresa com este ID. Escolha outro ID.')
        return
      }

      // Upload do logo se existir
      let logoUrl = null
      if (logoFile) {
        const uploadResult = await uploadEmpresaLogo(logoFile, formData.id_empresa)
        if (uploadResult.success && uploadResult.url) {
          logoUrl = uploadResult.url
        } else {
          throw new Error(uploadResult.error || 'Erro no upload do logo')
        }
      }

      const { error } = await supabase
        .from('empresas')
        .insert({
          id_empresa: formData.id_empresa,
          empresa_nome: formData.empresa_nome,
          cnpj: formData.cnpj,
          empresa_endereco: formData.empresa_endereco,
          empresa_telefone: formData.empresa_telefone,
          empresa_cidade: formData.empresa_cidade || null,
          empresa_estado: formData.empresa_estado || null,
          empresa_perimetro_entrega: formData.empresa_perimetro_entrega || null,
          empresa_logo: logoUrl,
          slug: formData.slug,
          cor_primaria: formData.cor_primaria,
          cor_secundaria: formData.cor_secundaria,
          tipo_empresa: tipoEmpresa,
          servicos_oferecidos: servicosOferecidos,
          ativa: true
        })

      if (error) {
        throw error
      }

      toast.success('Empresa criada com sucesso!')
      router.push('/admin/empresas')
    } catch (error: any) {
      console.error('Erro ao criar empresa:', error)
      if (error.code === '23505') {
        if (error.message.includes('id_empresa')) {
          toast.error('Já existe uma empresa com este ID. Escolha outro ID.')
        } else if (error.message.includes('cnpj')) {
          toast.error('Já existe uma empresa com este CNPJ')
        } else if (error.message.includes('slug')) {
          toast.error('Já existe uma empresa com este slug. Tente outro nome.')
        }
      } else {
        toast.error('Erro ao criar empresa')
      }
    } finally {
      setLoading(false)
    }
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
              Nova Empresa
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Cadastre uma nova empresa de transporte no sistema
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
                    disabled={loading}
                    required
                  />
                </div>

                {/* ID da Empresa */}
                <div className="form-group">
                  <label htmlFor="id_empresa" className="form-label">
                    ID da Empresa *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      id="id_empresa"
                      name="id_empresa"
                      value={formData.id_empresa}
                      onChange={handleIdEmpresaChange}
                      className="input flex-1"
                      placeholder="Ex: E1, E2, E3..."
                      disabled={loading}
                      required
                      maxLength={10}
                    />
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      Pedidos: {formData.id_empresa}-001, {formData.id_empresa}-002...
                    </div>
                  </div>
                  <p className="form-help">
                    Este ID será usado para identificar pedidos da empresa (ex: {formData.id_empresa || 'E1'}-001, {formData.id_empresa || 'E1'}-002)
                  </p>
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
                    disabled={loading}
                    required
                  />
                </div>

                {/* Tipo de Empresa */}
                <div className="form-group">
                  <label className="form-label">
                    Tipo de Empresa *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'taxi', label: '🚕 Taxi / Moto-Taxi', desc: 'Passageiros e objetos pequenos' },
                      { value: 'delivery', label: '📦 Entrega Express', desc: 'Apenas entregas' },
                      { value: 'transportadora', label: '🚚 Transportadora', desc: 'Cargas e mudanças' },
                      { value: 'multisservico', label: '🔄 Multisserviço', desc: 'Todos os tipos' }
                    ].map(tipo => (
                      <button
                        key={tipo.value}
                        type="button"
                        onClick={() => handleTipoEmpresaChange(tipo.value as any)}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          tipoEmpresa === tipo.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        disabled={loading}
                      >
                        <div className="font-medium text-sm">{tipo.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{tipo.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Serviços Oferecidos */}
                <div className="form-group">
                  <label className="form-label">
                    Serviços Oferecidos *
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'passageiro', label: '👤 Transporte de Passageiros', desc: 'Pessoas' },
                      { value: 'objeto', label: '📦 Entrega de Objetos', desc: 'Encomendas, documentos, comida' },
                      { value: 'carga', label: '🚚 Transporte de Carga', desc: 'Mudanças, cargas pesadas' }
                    ].map(servico => (
                      <label
                        key={servico.value}
                        className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={servicosOferecidos.includes(servico.value)}
                          onChange={() => handleServicoToggle(servico.value)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          disabled={loading}
                        />
                        <div className="ml-3">
                          <div className="font-medium text-sm">{servico.label}</div>
                          <div className="text-xs text-gray-500">{servico.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="form-help mt-2">
                    Selecionados: {servicosOferecidos.length > 0 
                      ? servicosOferecidos.join(', ') 
                      : 'Nenhum (selecione pelo menos um)'}
                  </p>
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
                    disabled={loading}
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
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
                    >
                      <option value="">Selecione...</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="SP">São Paulo</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="ES">Espírito Santo</option>
                      {/* Adicionar outros estados conforme necessário */}
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
                    disabled={loading}
                  />
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
                      disabled={loading}
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
                        disabled={loading}
                      />
                      <input
                        type="text"
                        value={formData.cor_primaria}
                        onChange={handleInputChange}
                        className="input flex-1"
                        disabled={loading}
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
                        disabled={loading}
                      />
                      <input
                        type="text"
                        value={formData.cor_secundaria}
                        onChange={handleInputChange}
                        className="input flex-1"
                        disabled={loading}
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
                    Logo da Empresa
                  </label>
                  
                  {!logoPreview ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="logo-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Fazer upload do logo</span>
                            <input
                              id="logo-upload"
                              name="logo-upload"
                              type="file"
                              className="sr-only"
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleLogoUpload(file)
                                }
                              }}
                              disabled={uploadingLogo || loading}
                            />
                          </label>
                          <p className="pl-1">ou arraste e solte aqui</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP, SVG até 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Preview do logo"
                          className="h-32 w-32 object-contain rounded-lg border border-gray-200 bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {logoFile && `${logoFile.name} (${formatFileSize(logoFile.size)})`}
                      </p>
                    </div>
                  )}

                  {uploadingLogo && (
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processando logo...
                    </div>
                  )}

                  <p className="form-help">
                    O logo será exibido na interface da empresa. Recomendamos uma imagem quadrada com fundo transparente.
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
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Criar Empresa
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
                <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-primary-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
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
