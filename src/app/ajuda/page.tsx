import Link from 'next/link'
import { ArrowLeft, HelpCircle, User, Building2, Car, Package, MessageCircle } from 'lucide-react'

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Link>
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Car className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-lg font-bold text-gray-900">MovTudo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Central de Ajuda
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais frequentes sobre o MovTudo
          </p>
        </div>

        {/* Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="#para-empresas" className="card p-6 hover:shadow-lg transition-shadow">
            <Building2 className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Para Empresas</h3>
            <p className="text-gray-600">Como contratar e gerenciar o sistema</p>
          </Link>

          <Link href="#para-transportadores" className="card p-6 hover:shadow-lg transition-shadow">
            <Car className="h-12 w-12 text-secondary-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Para Transportadores</h3>
            <p className="text-gray-600">Como aceitar e gerenciar corridas</p>
          </Link>

          <Link href="#para-clientes" className="card p-6 hover:shadow-lg transition-shadow">
            <User className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Para Clientes</h3>
            <p className="text-gray-600">Como solicitar transporte</p>
          </Link>
        </div>

        {/* FAQ Para Empresas */}
        <div id="para-empresas" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="h-8 w-8 text-primary-600 mr-3" />
            Para Empresas
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Como contratar o MovTudo?
              </h3>
              <p className="text-gray-600">
                Entre em contato com a Abistec pelo WhatsApp <a href="https://wa.me/552132727548" className="text-primary-600 hover:underline">(21) 3272-7548</a> ou email <a href="mailto:abistec.almir@gmail.com" className="text-primary-600 hover:underline">abistec.almir@gmail.com</a>. Faremos uma demonstração e configuraremos seu acesso personalizado.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qual o custo do sistema?
              </h3>
              <p className="text-gray-600">
                O MovTudo funciona como uma plataforma SaaS com planos mensais. Entre em contato para receber uma proposta personalizada de acordo com o tamanho da sua frota e volume de corridas.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Como funciona o acesso personalizado?
              </h3>
              <p className="text-gray-600">
                Cada empresa recebe um "slug" único (ex: /moto-taxi-express) onde seus clientes podem acessar diretamente. Você também pode ter um domínio próprio apontando para sua área no sistema.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Posso cadastrar quantos transportadores?
              </h3>
              <p className="text-gray-600">
                O número de transportadores varia de acordo com o plano contratado. Nosso sistema é escalável e suporta desde pequenas operações até grandes frotas.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Para Transportadores */}
        <div id="para-transportadores" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Car className="h-8 w-8 text-secondary-600 mr-3" />
            Para Transportadores
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Como faço para começar a trabalhar?
              </h3>
              <p className="text-gray-600">
                Entre em contato com a empresa de transporte à qual você deseja se vincular. O gerente da empresa fará seu cadastro e enviará suas credenciais de acesso.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Como aceito corridas?
              </h3>
              <p className="text-gray-600">
                Após fazer login, você verá todas as corridas disponíveis da sua empresa. Basta clicar em "Aceitar" na corrida desejada e seguir o fluxo de atualização de status (indo buscar → em rota → entregue).
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Recebo notificações de novas corridas?
              </h3>
              <p className="text-gray-600">
                Sim! O sistema envia notificações via Telegram quando há novas corridas disponíveis. Você também pode configurar notificações por email.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Para Clientes */}
        <div id="para-clientes" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <User className="h-8 w-8 text-green-600 mr-3" />
            Para Clientes
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Como solicito uma corrida?
              </h3>
              <p className="text-gray-600">
                Acesse a página da empresa de transporte desejada (ex: movtudo.netlify.app/moto-taxi), faça login ou cadastro, e preencha origem, destino e tipo de transporte. O sistema calculará o preço automaticamente.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Preciso ter cadastro?
              </h3>
              <p className="text-gray-600">
                Não necessariamente. Algumas empresas permitem solicitações como visitante, onde você preenche seus dados básicos (nome, telefone, email) e acompanha o status da corrida via link.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Como acompanho minha corrida?
              </h3>
              <p className="text-gray-600">
                Se estiver logado, acesse seu perfil e veja o histórico de corridas. Se for visitante, você receberá um link por SMS/WhatsApp para acompanhar o status em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="card p-8 text-center bg-primary-50">
          <HelpCircle className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Não encontrou o que procurava?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Entre em contato conosco pelo WhatsApp ou email. Estamos prontos para ajudar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/552132727548" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </a>
            <Link href="/contato" className="btn btn-secondary">
              Página de Contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

