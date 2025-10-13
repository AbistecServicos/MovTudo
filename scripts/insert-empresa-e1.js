const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Verifique se o arquivo .env.local existe e tem as variáveis:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertEmpresaE1() {
  console.log('🏢 Inserindo empresa E1...\n')

  try {
    // Verificar se a empresa já existe
    console.log('1. Verificando se empresa E1 já existe...')
    const { data: existingEmpresa, error: checkError } = await supabase
      .from('empresas')
      .select('id_empresa')
      .eq('id_empresa', 'E1')
      .single()

    if (existingEmpresa) {
      console.log('⚠️  Empresa E1 já existe!')
      return
    }

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar empresa:', checkError.message)
      return
    }

    // Inserir empresa E1
    console.log('2. Inserindo empresa E1...')
    const empresaData = {
      id_empresa: 'E1',
      empresa_nome: 'Moto Taxi Express',
      cnpj: '12.345.678/0001-90',
      empresa_endereco: 'Rua das Flores, 123 - Centro',
      empresa_telefone: '(21) 99999-9999',
      empresa_cidade: 'Rio de Janeiro',
      empresa_estado: 'RJ',
      empresa_perimetro_entrega: 'Zona Sul e Centro',
      empresa_logo: null,
      slug: 'moto-taxi-express',
      cor_primaria: '#FF6B35',
      cor_secundaria: '#2ECC71',
      politica_privacidade: null,
      sobre_empresa: 'Sua empresa de moto-táxi confiável no Rio de Janeiro. Entregas rápidas e seguras.',
      ativa: true,
      data_criacao: new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    }

    const { data: newEmpresa, error: insertError } = await supabase
      .from('empresas')
      .insert(empresaData)
      .select()

    if (insertError) {
      console.error('❌ Erro ao inserir empresa:', insertError.message)
      console.error('Código do erro:', insertError.code)
      return
    }

    console.log('✅ Empresa E1 inserida com sucesso!')
    console.log('Dados inseridos:')
    console.log(JSON.stringify(newEmpresa[0], null, 2))

    // Verificar se foi inserida corretamente
    console.log('\n3. Verificando inserção...')
    const { data: verificacao, error: verifError } = await supabase
      .from('empresas')
      .select('*')
      .eq('id_empresa', 'E1')
      .single()

    if (verifError) {
      console.error('❌ Erro ao verificar inserção:', verifError.message)
    } else {
      console.log('✅ Empresa encontrada na base de dados:')
      console.log(`   Nome: ${verificacao.empresa_nome}`)
      console.log(`   ID: ${verificacao.id_empresa}`)
      console.log(`   Slug: ${verificacao.slug}`)
      console.log(`   Ativa: ${verificacao.ativa}`)
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar inserção
insertEmpresaE1()




