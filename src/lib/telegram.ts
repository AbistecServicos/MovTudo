import axios from 'axios'

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

class TelegramService {
  private baseUrl = 'https://api.telegram.org/bot'

  /**
   * Envia mensagem para um chat específico
   */
  async sendMessage(message: TelegramMessage, botToken: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}${botToken}/sendMessage`,
        {
          chat_id: message.chatId,
          text: message.text,
          parse_mode: message.parseMode || 'HTML',
          reply_markup: message.replyMarkup
        }
      )

      return response.data.ok === true
    } catch (error) {
      console.error('Erro ao enviar mensagem Telegram:', error)
      return false
    }
  }

  /**
   * Envia mensagem para múltiplos chats
   */
  async sendBulkMessage(
    messages: TelegramMessage[],
    botToken: string
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0
    let failed = 0

    for (const message of messages) {
      const success = await this.sendMessage(message, botToken)
      if (success) {
        sent++
      } else {
        failed++
      }
    }

    return { sent, failed }
  }

  /**
   * Cria template de mensagem para nova corrida
   */
  createNovaCorridaTemplate(data: {
    empresaNome: string
    tipo: 'passageiro' | 'objeto'
    origem: string
    destino: string
    distancia: number
    preco: number
    clienteNome?: string
    clienteTelefone?: string
    descricaoObjeto?: string
    pesoObjeto?: number
  }): string {
    const { empresaNome, tipo, origem, destino, distancia, preco, clienteNome, clienteTelefone, descricaoObjeto, pesoObjeto } = data

    let template = `🚗 <b>NOVA CORRIDA - ${empresaNome.toUpperCase()}</b>\n\n`
    
    template += `📋 <b>Tipo:</b> ${tipo === 'passageiro' ? '👤 Passageiro' : '📦 Objeto'}\n`
    template += `📍 <b>Origem:</b> ${origem}\n`
    template += `🎯 <b>Destino:</b> ${destino}\n`
    template += `📏 <b>Distância:</b> ${distancia.toFixed(1)} km\n`
    template += `💰 <b>Valor:</b> R$ ${preco.toFixed(2)}\n\n`

    if (tipo === 'objeto' && descricaoObjeto) {
      template += `📦 <b>Descrição:</b> ${descricaoObjeto}\n`
      if (pesoObjeto) {
        template += `⚖️ <b>Peso:</b> ${pesoObjeto} kg\n`
      }
      template += `\n`
    }

    if (clienteNome) {
      template += `👤 <b>Cliente:</b> ${clienteNome}\n`
    }
    if (clienteTelefone) {
      template += `📱 <b>Telefone:</b> ${clienteTelefone}\n`
    }

    template += `\n⏰ <b>Hora:</b> ${new Date().toLocaleString('pt-BR')}`

    return template
  }

  /**
   * Cria template para atualização de status
   */
  createStatusUpdateTemplate(data: {
    empresaNome: string
    tipo: 'passageiro' | 'objeto'
    status: string
    transportadorNome: string
    origem?: string
    destino?: string
    tempoEstimado?: number
  }): string {
    const { empresaNome, tipo, status, transportadorNome, origem, destino, tempoEstimado } = data

    const statusEmojis: Record<string, string> = {
      'aceito': '✅',
      'coletando': '🚗',
      'em_rota': '🚛',
      'entregue': '🎉',
      'cancelado': '❌'
    }

    const statusTexts: Record<string, string> = {
      'aceito': 'ACEITA',
      'coletando': 'INDO BUSCAR',
      'em_rota': 'EM TRANSPORTE',
      'entregue': 'CONCLUÍDA',
      'cancelado': 'CANCELADA'
    }

    let template = `${statusEmojis[status]} <b>${statusTexts[status]} - ${empresaNome.toUpperCase()}</b>\n\n`
    
    template += `📋 <b>Tipo:</b> ${tipo === 'passageiro' ? '👤 Passageiro' : '📦 Objeto'}\n`
    template += `🚗 <b>Transportador:</b> ${transportadorNome}\n`
    
    if (origem && destino) {
      template += `📍 <b>De:</b> ${origem}\n`
      template += `🎯 <b>Para:</b> ${destino}\n`
    }

    if (tempoEstimado) {
      template += `⏱️ <b>Tempo estimado:</b> ${tempoEstimado} min\n`
    }

    template += `\n⏰ <b>Hora:</b> ${new Date().toLocaleString('pt-BR')}`

    return template
  }

  /**
   * Cria botões inline para aceitar/rejeitar corrida
   */
  createInlineKeyboard(corridaId: number, transportadorId: string): any {
    return {
      inline_keyboard: [
        [
          {
            text: '✅ Aceitar',
            callback_data: JSON.stringify({
              action: 'accept',
              corridaId,
              transportadorId
            })
          },
          {
            text: '❌ Recusar',
            callback_data: JSON.stringify({
              action: 'reject',
              corridaId,
              transportadorId
            })
          }
        ]
      ]
    }
  }

  /**
   * Processa callback de botões inline
   */
  processCallback(callbackData: string): { action: string; corridaId: number; transportadorId: string } | null {
    try {
      const data = JSON.parse(callbackData)
      return {
        action: data.action,
        corridaId: data.corridaId,
        transportadorId: data.transportadorId
      }
    } catch (error) {
      console.error('Erro ao processar callback:', error)
      return null
    }
  }

  /**
   * Envia notificação para transportadores de uma empresa
   */
  async notifyTransportadores(
    empresaId: string,
    message: string,
    botToken: string,
    corridaId?: number,
    transportadorId?: string
  ): Promise<boolean> {
    try {
      // Buscar transportadores ativos da empresa
      // Esta função será implementada no serviço principal
      
      const replyMarkup = corridaId && transportadorId 
        ? this.createInlineKeyboard(corridaId, transportadorId)
        : undefined

      // Por enquanto, vamos simular o envio
      // TODO: Implementar busca real dos transportadores
      console.log(`Enviando notificação para empresa ${empresaId}:`, message)
      
      return true
    } catch (error) {
      console.error('Erro ao notificar transportadores:', error)
      return false
    }
  }

  /**
   * Valida se o token do bot é válido
   */
  async validateBotToken(botToken: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}${botToken}/getMe`)
      return response.data.ok === true
    } catch (error) {
      return false
    }
  }

  /**
   * Obtém informações do bot
   */
  async getBotInfo(botToken: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}${botToken}/getMe`)
      return response.data.ok ? response.data.result : null
    } catch (error) {
      console.error('Erro ao obter info do bot:', error)
      return null
    }
  }
}

// Instância singleton
export const telegramService = new TelegramService()

// Funções utilitárias exportadas
export const sendTelegramMessage = (message: TelegramMessage, botToken: string) =>
  telegramService.sendMessage(message, botToken)

export const createNovaCorridaMessage = (data: any) =>
  telegramService.createNovaCorridaTemplate(data)

export const createStatusUpdateMessage = (data: any) =>
  telegramService.createStatusUpdateTemplate(data)
