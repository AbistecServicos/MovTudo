import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase usando variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validar
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing:');
  console.error('URL:', supabaseUrl || 'NOT FOUND');
  console.error('Key:', supabaseAnonKey ? 'EXISTS' : 'NOT FOUND');
  throw new Error('Supabase configuration is missing. Check your environment variables.')
}

// Cliente para uso no lado do cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para componentes React (com SSR)
export const createBrowserSupabaseClient = () => createClient(
  supabaseUrl,
  supabaseAnonKey
)

// Cliente para uso no servidor (com service role)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
)

// Tipos TypeScript baseados no banco de dados
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
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
        Insert: {
          id?: number
          uid: string
          email: string
          nome_usuario: string
          nome_completo: string
          telefone: string
          foto?: string | null
          data_cadastro?: string
          is_admin?: boolean
        }
        Update: {
          id?: number
          uid?: string
          email?: string
          nome_usuario?: string
          nome_completo?: string
          telefone?: string
          foto?: string | null
          data_cadastro?: string
          is_admin?: boolean
        }
      }
      empresas: {
        Row: {
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
        Insert: {
          id?: number
          id_empresa: string
          empresa_nome: string
          cnpj: string
          empresa_endereco: string
          empresa_telefone: string
          empresa_cidade?: string | null
          empresa_estado?: string | null
          empresa_perimetro_entrega?: string | null
          empresa_logo?: string | null
          slug?: string | null
          cor_primaria?: string
          cor_secundaria?: string
          politica_privacidade?: string | null
          sobre_empresa?: string | null
          ativa?: boolean
          data_criacao?: string
          data_atualizacao?: string
        }
        Update: {
          id?: number
          id_empresa?: string
          empresa_nome?: string
          cnpj?: string
          empresa_endereco?: string
          empresa_telefone?: string
          empresa_cidade?: string | null
          empresa_estado?: string | null
          empresa_perimetro_entrega?: string | null
          empresa_logo?: string | null
          slug?: string | null
          cor_primaria?: string
          cor_secundaria?: string
          politica_privacidade?: string | null
          sobre_empresa?: string | null
          ativa?: boolean
          data_criacao?: string
          data_atualizacao?: string
        }
      }
      corridas: {
        Row: {
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
        Insert: {
          id?: number
          id_empresa: string
          tipo: 'passageiro' | 'objeto'
          nome_cliente?: string | null
          email_cliente?: string | null
          telefone_cliente?: string | null
          origem_endereco: string
          origem_lat?: number | null
          origem_lng?: number | null
          destino_endereco: string
          destino_lat?: number | null
          destino_lng?: number | null
          distancia_km?: number | null
          tempo_estimado_min?: number | null
          preco_calculado?: number | null
          descricao_objeto?: string | null
          peso_kg?: number | null
          foto_objeto_url?: string | null
          status_transporte?: 'aguardando' | 'aceito' | 'coletando' | 'em_rota' | 'entregue' | 'cancelado' | 'revertido'
          aceito_por_nome?: string
          aceito_por_email?: string
          aceito_por_telefone?: string
          aceito_por_uid?: string | null
          forma_pagamento?: string | null
          frete_oferecido?: number | null
          frete_pago?: number | null
          status_pagamento?: boolean
          data_pagamento?: string | null
          frete_ja_processado?: boolean | null
          observacao_cliente?: string | null
          empresa_obs?: string | null
          empresa_nome?: string | null
          empresa_telefone?: string | null
          empresa_endereco?: string | null
          nota_cliente?: number | null
          comentario_cliente?: string | null
          nota_transportador?: number | null
          comentario_transportador?: string | null
          data?: string | null
          ultimo_status?: string
          data_aceite?: string | null
          data_conclusao?: string | null
          data_cancelamento?: string | null
        }
        Update: {
          id?: number
          id_empresa?: string
          tipo?: 'passageiro' | 'objeto'
          nome_cliente?: string | null
          email_cliente?: string | null
          telefone_cliente?: string | null
          origem_endereco?: string
          origem_lat?: number | null
          origem_lng?: number | null
          destino_endereco?: string
          destino_lat?: number | null
          destino_lng?: number | null
          distancia_km?: number | null
          tempo_estimado_min?: number | null
          preco_calculado?: number | null
          descricao_objeto?: string | null
          peso_kg?: number | null
          foto_objeto_url?: string | null
          status_transporte?: 'aguardando' | 'aceito' | 'coletando' | 'em_rota' | 'entregue' | 'cancelado' | 'revertido'
          aceito_por_nome?: string
          aceito_por_email?: string
          aceito_por_telefone?: string
          aceito_por_uid?: string | null
          forma_pagamento?: string | null
          frete_oferecido?: number | null
          frete_pago?: number | null
          status_pagamento?: boolean
          data_pagamento?: string | null
          frete_ja_processado?: boolean | null
          observacao_cliente?: string | null
          empresa_obs?: string | null
          empresa_nome?: string | null
          empresa_telefone?: string | null
          empresa_endereco?: string | null
          nota_cliente?: number | null
          comentario_cliente?: string | null
          nota_transportador?: number | null
          comentario_transportador?: string | null
          data?: string | null
          ultimo_status?: string
          data_aceite?: string | null
          data_conclusao?: string | null
          data_cancelamento?: string | null
        }
      }
    }
  }
}
