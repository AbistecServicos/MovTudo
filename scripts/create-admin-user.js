#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Certifique-se de que o arquivo .env.local está configurado.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  console.log('🔧 Criando usuário admin...')
  
  try {
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'almirdss@gmail.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        nome_usuario: 'almirdss',
        nome_completo: 'Almir da Silva Salles',
        telefone: '21983496342'
      }
    })

    if (authError) {
      throw authError
    }

    console.log('✅ Usuário criado no Supabase Auth:', authData.user.id)

    // 2. Verificar se já existe na tabela usuarios
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('uid', authData.user.id)
      .single()

    if (existingUser) {
      console.log('✅ Usuário já existe na tabela usuarios')
    } else {
      // 3. Criar registro na tabela usuarios
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          uid: authData.user.id,
          email: 'almirdss@gmail.com',
          nome_usuario: 'almirdss',
          nome_completo: 'Almir da Silva Salles',
          telefone: '21983496342',
          is_admin: true
        })

      if (insertError) {
        throw insertError
      }

      console.log('✅ Usuário criado na tabela usuarios')
    }

    console.log('\n🎉 Usuário admin criado com sucesso!')
    console.log('📧 Email: almirdss@gmail.com')
    console.log('🔑 Senha: admin123')
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message)
    
    if (error.message.includes('User already registered')) {
      console.log('\n💡 O usuário já existe. Tentando resetar senha...')
      
      try {
        const { error: resetError } = await supabase.auth.admin.updateUserById(
          '2c11fea4-e168-4f61-91f6-f9cdc27708cc', // ID do usuário existente
          { password: 'admin123' }
        )
        
        if (resetError) {
          throw resetError
        }
        
        console.log('✅ Senha resetada com sucesso!')
        console.log('📧 Email: almirdss@gmail.com')
        console.log('🔑 Nova Senha: admin123')
        
      } catch (resetError) {
        console.error('❌ Erro ao resetar senha:', resetError.message)
      }
    }
  }
}

createAdminUser()
