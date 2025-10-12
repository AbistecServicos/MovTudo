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

async function checkAuthSettings() {
  console.log('🔍 Verificando configurações do Supabase Auth...')
  
  try {
    // Verificar se o Auth está habilitado
    const { data: authConfig, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Erro ao acessar Auth:', error.message)
      return
    }

    console.log('✅ Supabase Auth está funcionando')
    console.log(`📊 Total de usuários: ${authConfig.users.length}`)
    
    if (authConfig.users.length > 0) {
      console.log('\n👥 Usuários existentes:')
      authConfig.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.email_confirmed_at ? 'Confirmado' : 'Não confirmado'})`)
      })
    }

    console.log('\n💡 Para habilitar signup:')
    console.log('1. Acesse: https://buxpuusxglavepfrivwg.supabase.co')
    console.log('2. Vá em Authentication → Settings')
    console.log('3. Habilite "Enable email confirmations"')
    console.log('4. Configure "Site URL" para: http://localhost:3000')
    console.log('5. Adicione "Redirect URLs": http://localhost:3000/auth/callback')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

checkAuthSettings()
