const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  console.log('🔐 Testando autenticação...\n')

  try {
    // 1. Verificar usuário atual
    console.log('1. Verificando usuário atual...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('❌ Erro ao obter usuário:', userError.message)
    } else if (user) {
      console.log('✅ Usuário autenticado:')
      console.log(`   Email: ${user.email}`)
      console.log(`   ID: ${user.id}`)
    } else {
      console.log('⚠️  Nenhum usuário autenticado')
    }

    // 2. Testar login com credenciais do admin
    console.log('\n2. Testando login como admin...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'almirdss@gmail.com',
      password: '123456'
    })

    if (authError) {
      console.error('❌ Erro no login:', authError.message)
    } else {
      console.log('✅ Login realizado com sucesso!')
      console.log(`   Usuário: ${authData.user?.email}`)
    }

    // 3. Consultar empresas após login
    console.log('\n3. Consultando empresas após login...')
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('*')
      .order('data_criacao', { ascending: false })

    if (empresasError) {
      console.error('❌ Erro ao consultar empresas:', empresasError.message)
    } else {
      console.log(`✅ Empresas encontradas: ${empresas.length}`)
      empresas.forEach((empresa, index) => {
        console.log(`\n${index + 1}. ${empresa.empresa_nome}`)
        console.log(`   ID: ${empresa.id_empresa}`)
        console.log(`   Slug: ${empresa.slug}`)
        console.log(`   Ativa: ${empresa.ativa}`)
      })
    }

    // 4. Verificar usuário na tabela usuarios
    console.log('\n4. Verificando usuário na tabela usuarios...')
    if (authData.user) {
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('uid', authData.user.id)
        .single()

      if (usuarioError) {
        console.error('❌ Erro ao consultar usuário:', usuarioError.message)
      } else {
        console.log('✅ Usuário encontrado na tabela:')
        console.log(`   Nome: ${usuario.nome_completo}`)
        console.log(`   Admin: ${usuario.is_admin}`)
        console.log(`   Email: ${usuario.email}`)
      }
    }

    // 5. Logout
    console.log('\n5. Fazendo logout...')
    await supabase.auth.signOut()
    console.log('✅ Logout realizado')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar teste
testAuth()




