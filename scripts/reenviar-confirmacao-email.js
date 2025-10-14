const { createClient } = require('@supabase/supabase-js')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function reenviarConfirmacaoEmail() {
  console.log('📧 Reenviando confirmação de email para usuários de teste...')
  
  // Lista de emails dos usuários de teste que precisam de confirmação
  const emailsUsuarios = [
    'gerente1_movtudo_e1@abistec.com.br',
    'transportador1_movtudo@abistec.com.br',
    'cliente1_movtudo@abistec.com.br',
    'almirdss@gmail.com.br'
  ]

  for (const email of emailsUsuarios) {
    try {
      console.log(`\n🔄 Processando: ${email}`)
      
      // Listar todos os usuários e encontrar por email
      const { data: users, error: userError } = await supabase.auth.admin.listUsers()
      
      if (userError) {
        console.error(`❌ Erro ao listar usuários:`, userError.message)
        continue
      }

      const existingUser = users.users.find(user => user.email === email)
      
      if (!existingUser) {
        console.log(`⚠️  Usuário não encontrado: ${email}`)
        continue
      }

      // Verificar se já está confirmado
      if (existingUser.email_confirmed_at) {
        console.log(`✅ Usuário já confirmado: ${email}`)
        continue
      }

      // Reenviar email de confirmação
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback'
        }
      })

      if (resendError) {
        console.error(`❌ Erro ao reenviar email para ${email}:`, resendError.message)
        
        // Se der erro, tentar confirmar manualmente
        console.log(`🔧 Tentando confirmar manualmente...`)
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { email_confirm: true }
        )
        
        if (confirmError) {
          console.error(`❌ Erro ao confirmar manualmente:`, confirmError.message)
        } else {
          console.log(`✅ Usuário confirmado manualmente: ${email}`)
        }
      } else {
        console.log(`✅ Email de confirmação reenviado: ${email}`)
      }

    } catch (error) {
      console.error(`❌ Erro geral para ${email}:`, error.message)
    }
  }

  console.log('\n🎉 Processo concluído!')
  console.log('\n📋 PRÓXIMOS PASSOS:')
  console.log('1. Verifique a caixa de entrada dos emails')
  console.log('2. Clique nos links de confirmação')
  console.log('3. Se não receber emails, os usuários podem ter sido confirmados manualmente')
  console.log('\n💡 DICA: Para desenvolvimento, você pode desabilitar confirmação de email no Supabase:')
  console.log('   Authentication → Settings → Enable email confirmations: OFF')
}

reenviarConfirmacaoEmail().catch(console.error)
