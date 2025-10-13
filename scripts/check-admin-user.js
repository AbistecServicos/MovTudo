const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAdminUser() {
  console.log('👑 Verificando usuário admin...\n')

  try {
    // 1. Verificar usuários na tabela usuarios
    console.log('1. Verificando usuários na tabela usuarios...')
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .order('data_cadastro', { ascending: false })

    if (usuariosError) {
      console.error('❌ Erro ao consultar usuários:', usuariosError.message)
      return
    }

    console.log(`✅ Usuários encontrados: ${usuarios.length}`)
    usuarios.forEach((usuario, index) => {
      console.log(`\n${index + 1}. ${usuario.nome_completo}`)
      console.log(`   Email: ${usuario.email}`)
      console.log(`   Admin: ${usuario.is_admin}`)
      console.log(`   UID: ${usuario.uid}`)
    })

    // 2. Verificar usuários admin especificamente
    console.log('\n2. Verificando usuários admin...')
    const { data: admins, error: adminsError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('is_admin', true)

    if (adminsError) {
      console.error('❌ Erro ao consultar admins:', adminsError.message)
    } else {
      console.log(`✅ Admins encontrados: ${admins.length}`)
      admins.forEach((admin, index) => {
        console.log(`\n${index + 1}. ${admin.nome_completo}`)
        console.log(`   Email: ${admin.email}`)
        console.log(`   UID: ${admin.uid}`)
      })
    }

    // 3. Verificar se existe usuário com email específico
    console.log('\n3. Verificando usuário específico...')
    const { data: usuarioEspecifico, error: especificoError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'almirdss@gmail.com')
      .single()

    if (especificoError) {
      if (especificoError.code === 'PGRST116') {
        console.log('⚠️  Usuário almirdss@gmail.com não encontrado')
      } else {
        console.error('❌ Erro ao consultar usuário específico:', especificoError.message)
      }
    } else {
      console.log('✅ Usuário encontrado:')
      console.log(`   Nome: ${usuarioEspecifico.nome_completo}`)
      console.log(`   Email: ${usuarioEspecifico.email}`)
      console.log(`   Admin: ${usuarioEspecifico.is_admin}`)
      console.log(`   UID: ${usuarioEspecifico.uid}`)
    }

    // 4. Listar todos os usuários do Auth (se possível)
    console.log('\n4. Tentando listar usuários do Auth...')
    try {
      const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers()
      
      if (authUsersError) {
        console.log('⚠️  Não foi possível listar usuários do Auth (permissões insuficientes)')
      } else {
        console.log(`✅ Usuários no Auth: ${authUsers.users.length}`)
        authUsers.users.forEach((user, index) => {
          console.log(`\n${index + 1}. ${user.email}`)
          console.log(`   ID: ${user.id}`)
          console.log(`   Confirmado: ${user.email_confirmed_at ? 'Sim' : 'Não'}`)
        })
      }
    } catch (error) {
      console.log('⚠️  Erro ao listar usuários do Auth:', error.message)
    }

    // 5. Sugestões
    console.log('\n5. Sugestões:')
    console.log('   a) Verifique se o usuário admin existe na tabela usuarios')
    console.log('   b) Verifique se o usuário existe no Auth do Supabase')
    console.log('   c) Execute o script create-admin-user.js se necessário')
    console.log('   d) Verifique as credenciais de login')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar verificação
checkAdminUser()




