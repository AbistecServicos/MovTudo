const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Verifique se o arquivo .env.local existe e tem as variáveis:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetAdminPassword() {
  console.log('🔑 Resetando senha do admin...\n')

  try {
    const adminEmail = 'almirdss@gmail.com'
    const newPassword = '123456'

    // 1. Resetar senha usando admin API
    console.log('1. Resetando senha usando admin API...')
    const { data: resetData, error: resetError } = await supabase.auth.admin.updateUserById(
      '4aac4aa0-f100-422a-9e2e-715e6560d34d',
      { password: newPassword }
    )

    if (resetError) {
      console.error('❌ Erro ao resetar senha:', resetError.message)
      return
    }

    console.log('✅ Senha resetada com sucesso!')
    console.log(`   Email: ${resetData.user.email}`)
    console.log(`   Nova senha: ${newPassword}`)

    // 2. Testar login com nova senha
    console.log('\n2. Testando login com nova senha...')
    const testSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data: loginData, error: loginError } = await testSupabase.auth.signInWithPassword({
      email: adminEmail,
      password: newPassword
    })

    if (loginError) {
      console.error('❌ Erro no login de teste:', loginError.message)
    } else {
      console.log('✅ Login de teste realizado com sucesso!')
      console.log(`   Usuário: ${loginData.user.email}`)
      
      // 3. Testar consulta de empresas após login
      console.log('\n3. Testando consulta de empresas após login...')
      const { data: empresas, error: empresasError } = await testSupabase
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

      // 4. Logout
      await testSupabase.auth.signOut()
      console.log('\n✅ Logout realizado')
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar reset
resetAdminPassword()