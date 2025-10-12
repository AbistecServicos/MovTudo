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

async function syncAuthUser() {
  console.log('🔧 Sincronizando usuário do Auth para tabela usuarios...')
  
  try {
    // 1. Buscar usuário no Auth
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    if (users.users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado no Auth')
      return
    }

    const authUser = users.users.find(u => u.email === 'almirdss@gmail.com')
    
    if (!authUser) {
      console.log('⚠️ Usuário almirdss@gmail.com não encontrado no Auth')
      return
    }

    console.log('✅ Usuário encontrado no Auth:', authUser.id)
    console.log('   Email:', authUser.email)
    console.log('   Confirmado:', authUser.email_confirmed_at ? 'SIM' : 'NÃO')

    // 2. Confirmar email do usuário
    if (!authUser.email_confirmed_at) {
      console.log('🔧 Confirmando email do usuário...')
      
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        authUser.id,
        { email_confirm: true }
      )
      
      if (confirmError) {
        console.error('❌ Erro ao confirmar email:', confirmError.message)
      } else {
        console.log('✅ Email confirmado com sucesso!')
      }
    }

    // 3. Verificar se já existe na tabela usuarios
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('uid', authUser.id)
      .single()

    if (existingUser) {
      console.log('✅ Usuário já existe na tabela usuarios')
      
      // Promover para admin se necessário
      if (!existingUser.is_admin) {
        console.log('🔧 Promovendo usuário a administrador...')
        
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ is_admin: true })
          .eq('uid', authUser.id)
        
        if (updateError) {
          console.error('❌ Erro ao promover:', updateError.message)
        } else {
          console.log('✅ Usuário promovido a administrador!')
        }
      } else {
        console.log('✅ Usuário já é administrador')
      }
      
      return
    }

    // 4. Criar usuário na tabela usuarios
    console.log('🔧 Criando usuário na tabela usuarios...')
    
    const userData = {
      uid: authUser.id,
      email: authUser.email,
      nome_usuario: authUser.user_metadata?.nome_usuario || 'almirdss',
      nome_completo: authUser.user_metadata?.nome_completo || 'Almir da Silva Salles',
      telefone: authUser.user_metadata?.telefone || '21983496342',
      is_admin: true
    }

    const { error: insertError } = await supabase
      .from('usuarios')
      .insert(userData)

    if (insertError) {
      throw insertError
    }

    console.log('✅ Usuário criado na tabela usuarios com sucesso!')
    console.log('\n🎉 SINCRONIZAÇÃO COMPLETA!')
    console.log('📧 Email:', authUser.email)
    console.log('🔑 Use a senha que você criou no cadastro')
    console.log('🔓 Email confirmado: SIM')
    console.log('👑 Admin: SIM')
    console.log('\n🚀 Agora você pode fazer login em: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

syncAuthUser()
