/**
 * ========================================
 * SCRIPT: Criar Usuários de Teste Automaticamente
 * ========================================
 * Objetivo: Criar todos os usuários e empresas de teste de uma vez
 * Baseado em: PastaPessoal/EmpresasUsuariosTestes.md
 * Data: 13/10/2025
 * ========================================
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase Admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ========================================
// DADOS DAS EMPRESAS
// ========================================

const empresas = [
  {
    id_empresa: 'E2',
    empresa_nome: 'Volta com Fé Transportes',
    cnpj: '23.456.789/0001-20',
    slug: 'volta-com-fe',
    empresa_endereco: 'Rod. Presidente Dutra, Km 180',
    empresa_telefone: '(21) 99999-0002',
    empresa_cidade: 'Rio de Janeiro',
    empresa_estado: 'RJ',
    cor_primaria: '#1E40AF',
    cor_secundaria: '#3B82F6',
    tipo_empresa: 'transportadora',
    servicos_oferecidos: ['carga'],
    sobre_empresa: 'Transportadora especializada em cargas pesadas. Atendemos todo o Rio de Janeiro.',
    ativa: true
  },
  {
    id_empresa: 'E3',
    empresa_nome: 'Açaí Delivery',
    cnpj: '34.567.890/0001-30',
    slug: 'acai-delivery',
    empresa_endereco: 'Rua das Flores, 500 - Copacabana',
    empresa_telefone: '(21) 99999-0003',
    empresa_cidade: 'Rio de Janeiro',
    empresa_estado: 'RJ',
    cor_primaria: '#8B5CF6',
    cor_secundaria: '#C084FC',
    tipo_empresa: 'delivery',
    servicos_oferecidos: ['objeto'],
    sobre_empresa: 'Açaí e produtos naturais com entrega rápida em Copacabana.',
    ativa: true
  },
  {
    id_empresa: 'E4',
    empresa_nome: 'Taxi Sul',
    cnpj: '45.678.901/0001-40',
    slug: 'taxi-sul',
    empresa_endereco: 'Av. Atlântica, 2000 - Copacabana',
    empresa_telefone: '(21) 99999-0004',
    empresa_cidade: 'Rio de Janeiro',
    empresa_estado: 'RJ',
    cor_primaria: '#DC2626',
    cor_secundaria: '#EF4444',
    tipo_empresa: 'taxi',
    servicos_oferecidos: ['passageiro'],
    sobre_empresa: 'Taxi tradicional 24h. Atendimento rápido e motoristas experientes.',
    ativa: true
  }
]

// ========================================
// DADOS DOS USUÁRIOS
// ========================================

const usuarios = [
  // ========== EMPRESA E1 - Completar ==========
  {
    email: 'transportador2.e1@abistec.com.br',
    password: 'Transportador2.e1*',
    nome_completo: 'Pedro Motoqueiro',
    nome_usuario: 'transportador2.e1',
    telefone: '(21) 97777-0002',
    empresa: 'E1',
    funcao: 'transportador',
    veiculo: 'Moto',
    carga_maxima: 50
  },
  {
    email: 'cliente1.e1@abistec.com.br',
    password: 'Cliente1.e1*',
    nome_completo: 'Maria Oliveira',
    nome_usuario: 'cliente1.e1',
    telefone: '(21) 96666-0001',
    empresa: 'E1',
    funcao: 'cliente'
  },

  // ========== EMPRESA E2 - Volta com Fé ==========
  {
    email: 'gerente1.e2@abistec.com.br',
    password: 'Gerente1.e2*',
    nome_completo: 'Roberto Caminhoneiro',
    nome_usuario: 'gerente1.e2',
    telefone: '(21) 98888-0002',
    empresa: 'E2',
    funcao: 'gerente'
  },
  {
    email: 'transportador1.e2@abistec.com.br',
    password: 'Transportador1.e2*',
    nome_completo: 'José Caminhoneiro',
    nome_usuario: 'transportador1.e2',
    telefone: '(21) 97777-0003',
    empresa: 'E2',
    funcao: 'transportador',
    veiculo: 'Truck',
    carga_maxima: 8000
  },
  {
    email: 'cliente1.e2@abistec.com.br',
    password: 'Cliente1.e2*',
    nome_completo: 'Distribuidora Pepsi RJ',
    nome_usuario: 'cliente1.e2',
    telefone: '(21) 3333-0001',
    empresa: 'E2',
    funcao: 'cliente'
  },

  // ========== EMPRESA E3 - Açaí Delivery ==========
  {
    email: 'gerente1.e3@abistec.com.br',
    password: 'Gerente1.e3*',
    nome_completo: 'Juliana Atendente',
    nome_usuario: 'gerente1.e3',
    telefone: '(21) 98888-0003',
    empresa: 'E3',
    funcao: 'gerente'
  },
  {
    email: 'transportador1.e3@abistec.com.br',
    password: 'Transportador1.e3*',
    nome_completo: 'Lucas Entregador',
    nome_usuario: 'transportador1.e3',
    telefone: '(21) 97777-0005',
    empresa: 'E3',
    funcao: 'transportador',
    veiculo: 'Moto',
    carga_maxima: 30
  },
  {
    email: 'transportador2.e3@abistec.com.br',
    password: 'Transportador2.e3*',
    nome_completo: 'Rafael Motoboy',
    nome_usuario: 'transportador2.e3',
    telefone: '(21) 97777-0006',
    empresa: 'E3',
    funcao: 'transportador',
    veiculo: 'Moto',
    carga_maxima: 30
  },

  // ========== EMPRESA E4 - Taxi Sul ==========
  {
    email: 'gerente1.e4@abistec.com.br',
    password: 'Gerente1.e4*',
    nome_completo: 'Fernando Despachante',
    nome_usuario: 'gerente1.e4',
    telefone: '(21) 98888-0004',
    empresa: 'E4',
    funcao: 'gerente'
  },
  {
    email: 'transportador1.e4@abistec.com.br',
    password: 'Transportador1.e4*',
    nome_completo: 'Marcelo Taxista',
    nome_usuario: 'transportador1.e4',
    telefone: '(21) 97777-0007',
    empresa: 'E4',
    funcao: 'transportador',
    veiculo: 'Carro',
    carga_maxima: 200
  },
  {
    email: 'transportador2.e4@abistec.com.br',
    password: 'Transportador2.e4*',
    nome_completo: 'Ricardo Motorista',
    nome_usuario: 'transportador2.e4',
    telefone: '(21) 97777-0008',
    empresa: 'E4',
    funcao: 'transportador',
    veiculo: 'Carro',
    carga_maxima: 200
  },
  {
    email: 'cliente1.e4@abistec.com.br',
    password: 'Cliente1.e4*',
    nome_completo: 'Patricia Silva',
    nome_usuario: 'cliente1.e4',
    telefone: '(21) 96666-0004',
    empresa: 'E4',
    funcao: 'cliente'
  }
]

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

async function criarEmpresas() {
  console.log('\n🏢 ========== CRIANDO EMPRESAS ==========\n')
  
  for (const empresa of empresas) {
    try {
      console.log(`📝 Criando empresa: ${empresa.empresa_nome} (${empresa.id_empresa})...`)
      
      const { data, error } = await supabase
        .from('empresas')
        .upsert([empresa], { 
          onConflict: 'id_empresa',
          ignoreDuplicates: false 
        })
        .select()

      if (error) {
        console.error(`❌ Erro ao criar ${empresa.empresa_nome}:`, error.message)
      } else {
        console.log(`✅ Empresa ${empresa.empresa_nome} criada/atualizada com sucesso!`)
      }
    } catch (error) {
      console.error(`❌ Erro inesperado ao criar ${empresa.empresa_nome}:`, error.message)
    }
  }
}

async function criarUsuario(userData) {
  try {
    console.log(`\n👤 Criando usuário: ${userData.nome_completo} (${userData.email})...`)
    
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        nome_completo: userData.nome_completo,
        nome_usuario: userData.nome_usuario
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`⚠️  Usuário ${userData.email} já existe no Auth, pulando...`)
        
        // Buscar UID do usuário existente
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existingUser = existingUsers?.users?.find(u => u.email === userData.email)
        
        if (existingUser) {
          return { uid: existingUser.id, email: userData.email, nome: userData.nome_completo }
        }
        return null
      }
      throw authError
    }

    const uid = authData.user.id
    console.log(`   ✅ Usuário criado no Auth (UID: ${uid})`)

    // 2. Inserir na tabela usuarios
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([{
        uid: uid,
        email: userData.email,
        nome_usuario: userData.nome_usuario,
        nome_completo: userData.nome_completo,
        telefone: userData.telefone,
        is_admin: false
      }])

    if (dbError) {
      if (dbError.message.includes('duplicate key')) {
        console.log(`   ⚠️  Usuário ${userData.email} já existe na tabela usuarios`)
      } else {
        throw dbError
      }
    } else {
      console.log(`   ✅ Usuário inserido na tabela usuarios`)
    }

    // 3. Vincular à empresa
    const { error: vinculoError } = await supabase
      .from('empresa_associada')
      .insert([{
        uid_usuario: uid,
        id_empresa: userData.empresa,
        funcao: userData.funcao,
        status_vinculacao: 'ativo',
        veiculo: userData.veiculo || null,
        carga_maxima: userData.carga_maxima || null
      }])

    if (vinculoError) {
      if (vinculoError.message.includes('duplicate key')) {
        console.log(`   ⚠️  Vínculo já existe para ${userData.email} na empresa ${userData.empresa}`)
      } else {
        throw vinculoError
      }
    } else {
      console.log(`   ✅ Usuário vinculado à empresa ${userData.empresa} como ${userData.funcao}`)
    }

    console.log(`✅ ${userData.nome_completo} criado com sucesso!`)
    
    return { uid, email: userData.email, nome: userData.nome_completo }

  } catch (error) {
    console.error(`❌ Erro ao criar ${userData.nome_completo}:`, error.message)
    return null
  }
}

async function criarTodosUsuarios() {
  console.log('\n👥 ========== CRIANDO USUÁRIOS ==========\n')
  
  const resultados = {
    sucesso: [],
    falha: [],
    pulado: []
  }

  for (const usuario of usuarios) {
    const resultado = await criarUsuario(usuario)
    
    if (resultado) {
      resultados.sucesso.push(resultado)
    } else {
      resultados.falha.push(usuario.email)
    }
    
    // Aguardar 500ms entre cada criação para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return resultados
}

// ========================================
// FUNÇÃO PRINCIPAL
// ========================================

async function main() {
  console.log('🚀 ========================================')
  console.log('🚀 CRIAÇÃO AUTOMÁTICA DE DADOS DE TESTE')
  console.log('🚀 ========================================')
  console.log(`📅 Data: ${new Date().toLocaleString('pt-BR')}`)
  console.log(`🌐 URL: ${supabaseUrl}`)
  console.log('🚀 ========================================\n')

  try {
    // 1. Criar empresas
    await criarEmpresas()

    // 2. Criar usuários
    const resultados = await criarTodosUsuarios()

    // 3. Resumo final
    console.log('\n')
    console.log('📊 ========== RESUMO FINAL ==========\n')
    console.log(`✅ Empresas criadas: ${empresas.length}`)
    console.log(`✅ Usuários criados com sucesso: ${resultados.sucesso.length}`)
    console.log(`❌ Usuários com erro: ${resultados.falha.length}`)
    
    if (resultados.sucesso.length > 0) {
      console.log('\n👥 USUÁRIOS CRIADOS:')
      resultados.sucesso.forEach((user, idx) => {
        console.log(`   ${idx + 1}. ${user.nome} (${user.email})`)
      })
    }

    if (resultados.falha.length > 0) {
      console.log('\n❌ ERROS:')
      resultados.falha.forEach((email, idx) => {
        console.log(`   ${idx + 1}. ${email}`)
      })
    }

    console.log('\n✅ ========================================')
    console.log('✅ PROCESSO CONCLUÍDO!')
    console.log('✅ ========================================\n')
    
    console.log('🎯 PRÓXIMOS PASSOS:')
    console.log('1. Verifique os usuários em /admin/usuarios')
    console.log('2. Verifique as empresas em /admin/empresas')
    console.log('3. Teste login com qualquer usuário criado')
    console.log('4. Teste os cenários em EmpresasUsuariosTestes.md\n')

  } catch (error) {
    console.error('\n❌ ERRO GERAL:', error)
    process.exit(1)
  }
}

// Executar
main()

