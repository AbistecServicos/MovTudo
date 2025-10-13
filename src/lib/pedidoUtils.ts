import { supabase } from './supabase'

/**
 * Gera um número de pedido único para uma empresa
 * Formato: E1-001, E1-002, E2-003, etc.
 */
export async function generatePedidoNumber(idEmpresa: string): Promise<string> {
  try {
    // Buscar o último pedido da empresa
    const { data: lastPedido, error } = await supabase
      .from('corridas')
      .select('id')
      .eq('id_empresa', idEmpresa)
      .order('id', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Erro ao buscar último pedido:', error)
      // Em caso de erro, usar timestamp como fallback
      const timestamp = Date.now().toString().slice(-6)
      return `${idEmpresa}-${timestamp}`
    }

    // Se não há pedidos anteriores, começar com 001
    if (!lastPedido || lastPedido.length === 0) {
      return `${idEmpresa}-001`
    }

    // Extrair o número do último pedido e incrementar
    const lastId = lastPedido[0].id
    const nextNumber = lastId + 1
    const paddedNumber = nextNumber.toString().padStart(3, '0')
    
    return `${idEmpresa}-${paddedNumber}`
  } catch (error) {
    console.error('Erro ao gerar número do pedido:', error)
    // Fallback usando timestamp
    const timestamp = Date.now().toString().slice(-6)
    return `${idEmpresa}-${timestamp}`
  }
}

/**
 * Extrai o ID da empresa de um número de pedido
 * Exemplo: "E1-001" -> "E1"
 */
export function extractEmpresaIdFromPedido(pedidoNumber: string): string {
  const parts = pedidoNumber.split('-')
  return parts[0] || ''
}

/**
 * Extrai o número sequencial de um pedido
 * Exemplo: "E1-001" -> 1
 */
export function extractSequentialNumberFromPedido(pedidoNumber: string): number {
  const parts = pedidoNumber.split('-')
  const numberPart = parts[1] || '000'
  return parseInt(numberPart, 10)
}

/**
 * Valida se um número de pedido está no formato correto
 * Formato esperado: E1-001, E2-002, etc.
 */
export function validatePedidoNumber(pedidoNumber: string): boolean {
  const regex = /^E\d+-\d{3}$/
  return regex.test(pedidoNumber)
}

/**
 * Formata um número de pedido para exibição
 * Exemplo: "E1-001" -> "E1-001"
 */
export function formatPedidoNumber(pedidoNumber: string): string {
  if (validatePedidoNumber(pedidoNumber)) {
    return pedidoNumber
  }
  return pedidoNumber // Retorna como está se não estiver no formato esperado
}





