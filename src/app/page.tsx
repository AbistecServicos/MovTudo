import Link from 'next/link'
import { ArrowRight, Car, Package, Users, MapPin, Clock, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">MovTudo</h1>
                <p className="text-sm text-gray-500">Sistema de Transporte</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Administração
              </Link>
              <Link href="/login" className="btn btn-primary">
                Entrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Conectando
              <span className="text-gradient block">Transporte e Pessoas</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plataforma completa para empresas de transporte gerenciarem corridas, 
              transportadores e clientes de forma eficiente e organizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn btn-primary btn-lg">
                <ArrowRight className="mr-2 h-5 w-5" />
                Acessar Sistema
              </Link>
              <Link href="/cadastro" className="btn btn-secondary btn-lg">
                <Users className="mr-2 h-5 w-5" />
                Cadastrar-se
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos Principais
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seu negócio de transporte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                WebApp Personalizado
              </h3>
              <p className="text-gray-600">
                A MovTudo lhe fornecerá um webapp exclusivo e escalável, acessível via diretório dedicado no site movtudo.com, com domínio próprio incluso para total personalização. Assim, você gerencia seus transportadores de forma independente, segura e totalmente adaptada às suas necessidades.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-lg mb-4">
                <Car className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transporte Completo
              </h3>
              <p className="text-gray-600">
                Passageiros e objetos, com cálculo automático de preços e rotas otimizadas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Google Maps
              </h3>
              <p className="text-gray-600">
                Integração completa com Google Maps para cálculo de distância e navegação.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Notificações
              </h3>
              <p className="text-gray-600">
                Sistema de notificações via Telegram para transportadores e clientes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tempo Real
              </h3>
              <p className="text-gray-600">
                Acompanhamento em tempo real do status das corridas e localização dos transportadores.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Segurança
              </h3>
              <p className="text-gray-600">
                Sistema de permissões robusto com Row Level Security e autenticação segura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Entre em contato com a Abistec Serviços Tecnológicos para ativar o sistema e começar a gerenciar sua frota de transportadores ou transportes individuais de passageiros, objetos e cargas de forma eficiente, rápida e totalmente organizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
              <ArrowRight className="mr-2 h-5 w-5" />
              Acessar Sistema
            </Link>
            <a href="https://wa.me/552132727548" className="btn btn-lg bg-green-600 text-white hover:bg-green-700" target="_blank" rel="noopener noreferrer">
              <Users className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Car className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">MovTudo</span>
              </div>
              <p className="text-gray-400 mb-4">
                Sistema completo de gestão para empresas de transporte, 
                conectando clientes e transportadores de forma eficiente.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Sistema</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin" className="hover:text-white">Administração</Link></li>
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
                <li><Link href="/cadastro" className="hover:text-white">Cadastro</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
                <li><Link href="/ajuda" className="hover:text-white">Ajuda</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentação</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MovTudo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
