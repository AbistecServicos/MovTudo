import axios from 'axios'

export interface GoogleMapsConfig {
  apiKey: string
}

export interface Location {
  lat: number
  lng: number
  address: string
}

export interface DistanceResult {
  distance: number // em km
  duration: number // em minutos
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

class GoogleMapsService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  }

  /**
   * Geocodifica um endereço para coordenadas lat/lng
   */
  async geocode(address: string): Promise<Location | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: this.apiKey,
            region: 'br', // Brasil
            language: 'pt-BR'
          }
        }
      )

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0]
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address
        }
      }

      return null
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error)
      return null
    }
  }

  /**
   * Calcula distância e tempo entre dois pontos
   */
  async calculateDistance(
    origin: string,
    destination: string
  ): Promise<DistanceResult | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`,
        {
          params: {
            origins: origin,
            destinations: destination,
            key: this.apiKey,
            units: 'metric',
            language: 'pt-BR',
            mode: 'driving',
            traffic_model: 'best_guess'
          }
        }
      )

      if (response.data.status === 'OK' && response.data.rows.length > 0) {
        const element = response.data.rows[0].elements[0]
        
        if (element.status === 'OK') {
          return {
            distance: element.distance.value / 1000, // converter metros para km
            duration: Math.ceil(element.duration.value / 60), // converter segundos para minutos
            status: 'OK'
          }
        }
      }

      return null
    } catch (error) {
      console.error('Erro ao calcular distância:', error)
      return null
    }
  }

  /**
   * Calcula distância usando coordenadas
   */
  async calculateDistanceByCoords(
    origin: Location,
    destination: Location
  ): Promise<DistanceResult | null> {
    const originStr = `${origin.lat},${origin.lng}`
    const destinationStr = `${destination.lat},${destination.lng}`
    
    return this.calculateDistance(originStr, destinationStr)
  }

  /**
   * Calcula preço da corrida baseado em distância e tipo de serviço
   */
  calculatePrice(
    distance: number,
    duration: number,
    basePrice: number,
    pricePerKm: number,
    vehicleType: 'moto' | 'carro' | 'van' = 'moto',
    serviceType: 'passageiro' | 'objeto' = 'passageiro',
    isNightTime: boolean = false,
    isHoliday: boolean = false
  ): PriceCalculation {
    // Preço base + (distância * preço por km)
    let totalPrice = basePrice + (distance * pricePerKm)

    // Ajustes por tipo de veículo
    const vehicleMultipliers = {
      moto: 1.0,
      carro: 1.3,
      van: 1.5
    }

    totalPrice *= vehicleMultipliers[vehicleType]

    // Ajustes por tipo de serviço
    if (serviceType === 'objeto') {
      totalPrice *= 1.2 // 20% mais caro para objetos
    }

    // Taxa noturna (22h às 6h)
    const nightFee = isNightTime ? totalPrice * 0.2 : 0

    // Taxa de feriado
    const holidayFee = isHoliday ? totalPrice * 0.3 : 0

    totalPrice += nightFee + holidayFee

    // Arredondar para cima
    totalPrice = Math.ceil(totalPrice)

    return {
      distance,
      duration,
      basePrice,
      pricePerKm,
      totalPrice,
      nightFee: isNightTime ? nightFee : undefined,
      holidayFee: isHoliday ? holidayFee : undefined
    }
  }

  /**
   * Verifica se é horário noturno (22h às 6h)
   */
  isNightTime(): boolean {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 22 || hour < 6
  }

  /**
   * Verifica se é feriado (lista básica de feriados brasileiros)
   */
  isHoliday(): boolean {
    const now = new Date()
    const year = now.getFullYear()
    
    const holidays = [
      new Date(year, 0, 1),   // Ano Novo
      new Date(year, 3, 21),  // Tiradentes
      new Date(year, 4, 1),   // Dia do Trabalhador
      new Date(year, 8, 7),   // Independência
      new Date(year, 9, 12),  // Nossa Senhora Aparecida
      new Date(year, 10, 2),  // Finados
      new Date(year, 10, 15), // Proclamação da República
      new Date(year, 11, 25), // Natal
    ]

    return holidays.some(holiday => 
      holiday.getDate() === now.getDate() &&
      holiday.getMonth() === now.getMonth()
    )
  }

  /**
   * Busca sugestões de endereços (Autocomplete)
   */
  async getPlaceSuggestions(input: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: input,
            key: this.apiKey,
            language: 'pt-BR',
            region: 'br',
            types: 'geocode'
          }
        }
      )

      if (response.data.status === 'OK') {
        return response.data.predictions.map((prediction: any) => prediction.description)
      }

      return []
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
      return []
    }
  }

  /**
   * Obtém detalhes de um lugar específico
   */
  async getPlaceDetails(placeId: string): Promise<Location | null> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: this.apiKey,
            language: 'pt-BR',
            fields: 'geometry,formatted_address'
          }
        }
      )

      if (response.data.status === 'OK') {
        const place = response.data.result
        return {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          address: place.formatted_address
        }
      }

      return null
    } catch (error) {
      console.error('Erro ao obter detalhes do lugar:', error)
      return null
    }
  }
}

// Instância singleton
export const googleMapsService = new GoogleMapsService()

// Funções utilitárias exportadas
export const geocode = (address: string) => googleMapsService.geocode(address)
export const calculateDistance = (origin: string, destination: string) => 
  googleMapsService.calculateDistance(origin, destination)
export const calculatePrice = (
  distance: number,
  duration: number,
  basePrice: number,
  pricePerKm: number,
  vehicleType?: 'moto' | 'carro' | 'van',
  serviceType?: 'passageiro' | 'objeto'
) => googleMapsService.calculatePrice(
  distance, duration, basePrice, pricePerKm, vehicleType, serviceType,
  googleMapsService.isNightTime(), googleMapsService.isHoliday()
)
