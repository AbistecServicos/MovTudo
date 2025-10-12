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

async function configureSupabaseAuth() {
  console.log('🔧 Configurando Supabase Auth...')
  
  console.log('\n📋 CONFIGURAÇÕES NECESSÁRIAS:')
  console.log('='.repeat(50))
  console.log('1. Acesse: https://buxpuusxglavepfrivwg.supabase.co')
  console.log('2. Vá em Authentication → Settings')
  console.log('3. Configure as seguintes opções:')
  console.log('')
  console.log('✅ Site URL: http://localhost:3000')
  console.log('✅ Redirect URLs: http://localhost:3000/auth/callback')
  console.log('✅ Enable email confirmations: DESABILITADO (para desenvolvimento)')
  console.log('✅ Enable email change confirmations: DESABILITADO')
  console.log('✅ Enable phone confirmations: DESABILITADO')
  console.log('')
  console.log('4. Salve as configurações')
  console.log('5. Teste o cadastro novamente')
  console.log('')
  console.log('💡 DICA: Se ainda der erro, você pode:')
  console.log('   • Criar usuário pelo script (scripts/create-admin-user.js)')
  console.log('   • Ou configurar manualmente no painel do Supabase')
  console.log('')
  console.log('🔗 Links úteis:')
  console.log('   • Supabase Dashboard: https://buxpuusxglavepfrivwg.supabase.co')
  console.log('   • Authentication Settings: https://buxpuusxglavepfrivwg.supabase.co/project/default/auth/settings')
  console.log('')
  
  try {
    // Testar se conseguimos acessar o auth
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Erro ao acessar Auth:', error.message)
    } else {
      console.log('✅ Supabase Auth está acessível')
      console.log(`📊 Usuários existentes: ${data.users.length}`)
    }
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

configureSupabaseAuth()
