#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deleteAdminUser() {
  console.log('🗑️ Deletando usuário admin existente...')
  
  try {
    // 1. Buscar o usuário pelo email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    const adminUser = users.users.find(user => user.email === 'almirdss@gmail.com')
    
    if (!adminUser) {
      console.log('⚠️ Usuário admin não encontrado no Auth')
    } else {
      // 2. Deletar do Supabase Auth
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(adminUser.id)
      
      if (deleteAuthError) {
        throw deleteAuthError
      }
      
      console.log('✅ Usuário deletado do Supabase Auth')
    }

    // 3. Deletar da tabela usuarios
    const { error: deleteTableError } = await supabase
      .from('usuarios')
      .delete()
      .eq('email', 'almirdss@gmail.com')

    if (deleteTableError) {
      console.log('⚠️ Erro ao deletar da tabela usuarios:', deleteTableError.message)
    } else {
      console.log('✅ Usuário deletado da tabela usuarios')
    }

    console.log('\n🎉 Usuário admin deletado com sucesso!')
    console.log('💡 Agora você pode criar um novo usuário pelo frontend')

  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error.message)
  }
}

deleteAdminUser()
