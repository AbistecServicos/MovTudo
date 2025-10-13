const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEmpresas() {
  console.log('🔍 Testando consulta de empresas...\n')

  try {
    // 1. Consultar todas as empresas
    console.log('1. Consultando todas as empresas...')
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('*')
      .order('data_criacao', { ascending: false })

    if (error) {
      console.error('❌ Erro na consulta:', error.message)
      return
    }

    console.log(`✅ Encontradas ${empresas.length} empresas:`)
    empresas.forEach((empresa, index) => {
      console.log(`\n${index + 1}. ${empresa.empresa_nome}`)
      console.log(`   ID: ${empresa.id_empresa}`)
      console.log(`   Slug: ${empresa.slug}`)
      console.log(`   Ativa: ${empresa.ativa}`)
      console.log(`   Criada em: ${new Date(empresa.data_criacao).toLocaleString('pt-BR')}`)
      console.log(`   Logo: ${empresa.empresa_logo ? 'Sim' : 'Não'}`)
    })

    // 2. Consultar apenas empresas ativas
    console.log('\n2. Consultando apenas empresas ativas...')
    const { data: empresasAtivas, error: errorAtivas } = await supabase
      .from('empresas')
      .select('*')
      .eq('ativa', true)
      .order('data_criacao', { ascending: false })

    if (errorAtivas) {
      console.error('❌ Erro na consulta de empresas ativas:', errorAtivas.message)
      return
    }

    console.log(`✅ Empresas ativas: ${empresasAtivas.length}`)

    // 3. Consultar empresa específica E1
    console.log('\n3. Consultando empresa E1...')
    const { data: empresaE1, error: errorE1 } = await supabase
      .from('empresas')
      .select('*')
      .eq('id_empresa', 'E1')
      .single()

    if (errorE1) {
      if (errorE1.code === 'PGRST116') {
        console.log('⚠️  Empresa E1 não encontrada')
      } else {
        console.error('❌ Erro ao consultar E1:', errorE1.message)
      }
    } else {
      console.log('✅ Empresa E1 encontrada:')
      console.log(`   Nome: ${empresaE1.empresa_nome}`)
      console.log(`   Slug: ${empresaE1.slug}`)
      console.log(`   Ativa: ${empresaE1.ativa}`)
    }

    // 4. Testar RLS (Row Level Security)
    console.log('\n4. Testando permissões...')
    const { data: userData } = await supabase.auth.getUser()
    console.log(`Usuário autenticado: ${userData.user ? 'Sim' : 'Não'}`)

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar teste
testEmpresas()




