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

async function resetAdminPassword() {
  console.log('🔧 Resetando senha do usuário admin...')
  
  try {
    // Buscar o usuário pelo email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    const adminUser = users.users.find(user => user.email === 'almirdss@gmail.com')
    
    if (!adminUser) {
      console.error('❌ Usuário admin não encontrado!')
      return
    }

    console.log('✅ Usuário encontrado:', adminUser.id)

    // Resetar senha
    const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
      password: 'admin123'
    })

    if (error) {
      throw error
    }

    console.log('✅ Senha resetada com sucesso!')
    console.log('📧 Email: almirdss@gmail.com')
    console.log('🔑 Nova Senha: admin123')
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error.message)
  }
}

resetAdminPassword()
