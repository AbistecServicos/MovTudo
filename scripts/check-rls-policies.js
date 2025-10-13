const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRLSPolicies() {
  console.log('🔒 Verificando políticas RLS...\n')

  try {
    // 1. Verificar se RLS está habilitado na tabela empresas
    console.log('1. Verificando RLS na tabela empresas...')
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('check_table_rls', { table_name: 'empresas' })

    if (rlsError) {
      console.log('⚠️  Não foi possível verificar RLS automaticamente')
    } else {
      console.log(`RLS habilitado: ${rlsStatus}`)
    }

    // 2. Tentar consultar empresas com diferentes métodos
    console.log('\n2. Testando consultas com diferentes métodos...')

    // Método 1: Consulta simples
    console.log('   a) Consulta simples...')
    const { data: empresas1, error: error1 } = await supabase
      .from('empresas')
      .select('id_empresa, empresa_nome')
    
    console.log(`   Resultado: ${empresas1 ? empresas1.length : 0} empresas`)
    if (error1) console.log(`   Erro: ${error1.message}`)

    // Método 2: Consulta com service role
    console.log('   b) Consulta com service role...')
    const { data: empresas2, error: error2 } = await supabase
      .from('empresas')
      .select('id_empresa, empresa_nome')
      .limit(10)
    
    console.log(`   Resultado: ${empresas2 ? empresas2.length : 0} empresas`)
    if (error2) console.log(`   Erro: ${error2.message}`)

    // Método 3: Consulta específica por ID
    console.log('   c) Consulta específica por ID...')
    const { data: empresaE1, error: error3 } = await supabase
      .from('empresas')
      .select('*')
      .eq('id_empresa', 'E1')
      .single()
    
    console.log(`   Resultado: ${empresaE1 ? 'Encontrada' : 'Não encontrada'}`)
    if (error3) console.log(`   Erro: ${error3.message}`)

    // 3. Verificar se há dados na tabela usando SQL direto
    console.log('\n3. Verificando dados via SQL...')
    const { data: sqlResult, error: sqlError } = await supabase
      .rpc('exec_sql', { 
        sql: 'SELECT COUNT(*) as total FROM empresas' 
      })

    if (sqlError) {
      console.log('⚠️  Não foi possível executar SQL direto')
    } else {
      console.log(`Total de empresas na tabela: ${sqlResult}`)
    }

    // 4. Listar todas as políticas da tabela
    console.log('\n4. Verificando políticas da tabela empresas...')
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_table_policies', { table_name: 'empresas' })

    if (policiesError) {
      console.log('⚠️  Não foi possível listar políticas automaticamente')
      console.log('💡 Você pode verificar manualmente no Supabase Dashboard:')
      console.log('   Authentication > Policies > empresas')
    } else {
      console.log(`Políticas encontradas: ${policies ? policies.length : 0}`)
    }

    // 5. Sugestões de correção
    console.log('\n5. Sugestões de correção:')
    console.log('   a) Verifique se RLS está habilitado na tabela empresas')
    console.log('   b) Verifique se há políticas que permitem SELECT')
    console.log('   c) Teste desabilitar RLS temporariamente para debug')
    console.log('   d) Verifique se o usuário tem as permissões corretas')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar verificação
checkRLSPolicies()




