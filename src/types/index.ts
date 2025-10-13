// ============================================
// TIPOS TYPESCRIPT - MOVTUDO
// ============================================

export interface User {
  id: number
  uid: string
  email: string
  nome_usuario: string
  nome_completo: string
  telefone: string
  foto: string | null
  data_cadastro: string
  is_admin: boolean
}

export interface Empresa {
  id: number
  id_empresa: string
  empresa_nome: string
  cnpj: string
  empresa_endereco: string
  empresa_telefone: string
  empresa_cidade: string | null
  empresa_estado: string | null
  empresa_perimetro_entrega: string | null
  empresa_logo: string | null
  slug: string | null
  cor_primaria: string
  cor_secundaria: string
  politica_privacidade: string | null
  sobre_empresa: string | null
  ativa: boolean
  data_criacao: string
  data_atualizacao: string
}

export interface EmpresaAssociada {
  id: number
  uid_usuario: string
  nome_completo: string
  funcao: 'cliente' | 'transportador' | 'gerente' | 'admin'
  id_empresa: string
  status_vinculacao: 'ativo' | 'inativo' | 'desligado'
  ultimo_status_vinculacao: string
  data_desligamento: string | null
  empresa_nome: string
  empresa_endereco: string | null
  empresa_telefone: string | null
  perimetro_entrega: string | null
  veiculo: string | null
  carga_maxima: number | null
  semana_entregue: number
  semana_cancelado: number
  mes_entregue: number
  mes_cancelado: number
  ano_entregue: number
  ano_cancelado: number
  frete_pago_semana: number
  frete_pago_mes: number
  frete_pago_ano: number
  total_entregue_hoje: number
  total_cancelado_hoje: number
  total_frete_pago_hoje: number
  data_atualizacao_hoje: string
  ultima_atualizacao: string
  email_usuario: string | null
}

export interface Corrida {
  id: number
  id_empresa: string
  tipo: 'passageiro' | 'objeto'
  nome_cliente: string | null
  email_cliente: string | null
  telefone_cliente: string | null
  origem_endereco: string
  origem_lat: number | null
  origem_lng: number | null
  destino_endereco: string
  destino_lat: number | null
  destino_lng: number | null
  distancia_km: number | null
  tempo_estimado_min: number | null
  preco_calculado: number | null
  descricao_objeto: string | null
  peso_kg: number | null
  foto_objeto_url: string | null
  status_transporte: 'aguardando' | 'aceito' | 'coletando' | 'em_rota' | 'entregue' | 'cancelado' | 'revertido'
  aceito_por_nome: string
  aceito_por_email: string
  aceito_por_telefone: string
  aceito_por_uid: string | null
  forma_pagamento: string | null
  frete_oferecido: number | null
  frete_pago: number | null
  status_pagamento: boolean
  data_pagamento: string | null
  frete_ja_processado: boolean | null
  observacao_cliente: string | null
  empresa_obs: string | null
  empresa_nome: string | null
  empresa_telefone: string | null
  empresa_endereco: string | null
  nota_cliente: number | null
  comentario_cliente: string | null
  nota_transportador: number | null
  comentario_transportador: string | null
  data: string | null
  ultimo_status: string
  data_aceite: string | null
  data_conclusao: string | null
  data_cancelamento: string | null
}

export interface Preco {
  id: string
  id_empresa: string
  tipo_veiculo: 'moto' | 'carro' | 'van' | null
  tipo_servico: 'passageiro' | 'objeto' | null
  taxa_base: number
  preco_por_km: number
  taxa_noturna_percent: number
  taxa_feriado_percent: number
  taxa_minima: number | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface TelegramConfig {
  id: string
  id_empresa: string
  bot_token: string
  chat_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TelegramTransportador {
  id: string
  uid_transportador: string
  id_empresa: string
  telegram_user_id: string | null
  telegram_username: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TelegramTemplate {
  id: string
  template_name: string
  template_content: string
  default_sound: string
  created_at: string
  updated_at: string
}

export interface TelegramNotification {
  id: string
  id_empresa: string
  corrida_id: number | null
  notification_type: string
  message_content: string
  telegram_response: any | null
  status: string
  error_message: string | null
  sent_at: string
}

export interface Notificacao {
  id: string
  usuario_id: string | null
  corrida_id: number | null
  tipo: 'telegram' | 'email' | 'push'
  mensagem: string | null
  enviado: boolean
  data_envio: string
}

export interface UserToken {
  id: number
  user_id: string
  token: string
  created_at: string
  updated_at: string
}

// ============================================
// TIPOS PARA FORMS
// ============================================

export interface NovaCorridaForm {
  tipo: 'passageiro' | 'objeto'
  origem: string
  destino: string
  nome_cliente?: string
  email_cliente?: string
  telefone_cliente?: string
  descricao_objeto?: string
  peso_kg?: number
  observacao_cliente?: string
  forma_pagamento?: string
}

export interface NovaEmpresaForm {
  id_empresa: string
  empresa_nome: string
  cnpj: string
  empresa_endereco: string
  empresa_telefone: string
  empresa_cidade?: string
  empresa_estado?: string
  empresa_perimetro_entrega?: string
  slug: string
  cor_primaria: string
  cor_secundaria: string
}

export interface NovoUsuarioForm {
  nome_completo: string
  nome_usuario: string
  email: string
  telefone: string
  funcao: 'cliente' | 'transportador' | 'gerente'
  id_empresa: string
  veiculo?: string
  carga_maxima?: number
}

export interface PrecoForm {
  id_empresa: string
  tipo_veiculo: 'moto' | 'carro' | 'van'
  tipo_servico: 'passageiro' | 'objeto'
  taxa_base: number
  preco_por_km: number
  taxa_noturna_percent: number
  taxa_feriado_percent: number
  taxa_minima?: number
}

// ============================================
// TIPOS PARA CONTEXT
// ============================================

export interface AuthContextType {
  user: User | null
  empresa: Empresa | null
  empresaAssociada: EmpresaAssociada | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export interface EmpresaContextType {
  empresa: Empresa | null
  loading: boolean
  refreshEmpresa: () => Promise<void>
  updateEmpresa: (data: Partial<Empresa>) => Promise<void>
}

// ============================================
// TIPOS PARA API RESPONSES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// TIPOS PARA STATS E RELATÓRIOS
// ============================================

export interface EmpresaStats {
  totalCorridas: number
  corridasHoje: number
  corridasMes: number
  transportadoresAtivos: number
  clientesAtivos: number
  faturamentoMes: number
  faturamentoHoje: number
  taxaEntrega: number
  tempoMedioEntrega: number
}

export interface TransportadorStats {
  corridasEntregues: number
  corridasCanceladas: number
  faturamentoTotal: number
  faturamentoMes: number
  faturamentoHoje: number
  avaliacaoMedia: number
  tempoMedioEntrega: number
}

export interface CorridaStats {
  porStatus: Record<string, number>
  porTipo: Record<string, number>
  porHorario: Record<string, number>
  porDia: Record<string, number>
}

// ============================================
// TIPOS PARA GOOGLE MAPS
// ============================================

export interface Location {
  lat: number
  lng: number
  address: string
}

export interface DistanceResult {
  distance: number
  duration: number
  status: string
}

export interface PriceCalculation {
  distance: number
  duration: number
  basePrice: number
  pricePerKm: number
  totalPrice: number
  nightFee?: number
  holidayFee?: number
}

// ============================================
// TIPOS PARA TELEGRAM
// ============================================

export interface TelegramMessage {
  chatId: string
  text: string
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  replyMarkup?: any
}

export interface TelegramNotification {
  type: 'nova_corrida' | 'corrida_aceita' | 'status_atualizado' | 'corrida_concluida' | 'corrida_cancelada'
  empresaId: string
  corridaId: number
  transportadorId?: string
  message: string
  data?: any
}
