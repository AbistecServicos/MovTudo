const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Verifique se o arquivo .env.local existe e tem as variáveis:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log('🔧 Configurando Supabase Storage...\n')

  try {
    // 1. Criar bucket "box" se não existir
    console.log('1. Criando bucket "box"...')
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError.message)
      return
    }

    const boxBucket = buckets.find(bucket => bucket.id === 'box')
    
    if (!boxBucket) {
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('box', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (createError) {
        console.error('❌ Erro ao criar bucket:', createError.message)
        return
      }

      console.log('✅ Bucket "box" criado com sucesso!')
    } else {
      console.log('✅ Bucket "box" já existe!')
    }

    // 2. Criar pastas virtuais (upload de arquivos de teste)
    console.log('\n2. Criando estrutura de pastas...')
    
    const folders = ['foto_perfil', 'logo', 'imagens', 'pdf']
    
    for (const folder of folders) {
      const testFileName = `${folder}/.gitkeep`
      const { error: folderError } = await supabase.storage
        .from('box')
        .upload(testFileName, '', {
          contentType: 'text/plain',
          upsert: true
        })

      if (folderError && !folderError.message.includes('already exists')) {
        console.warn(`⚠️  Erro ao criar pasta ${folder}:`, folderError.message)
      } else {
        console.log(`✅ Pasta ${folder}/ criada!`)
      }
    }

    console.log('\n🎉 Configuração do storage concluída!')
    console.log('\n📋 Estrutura criada:')
    console.log('📦 box/')
    console.log('├── 👤 foto_perfil/')
    console.log('├── 🏢 logo/')
    console.log('├── 📷 imagens/')
    console.log('└── 📄 pdf/')
    
    console.log('\n🔐 Próximo passo: Execute as políticas SQL no Supabase Dashboard')
    console.log('📄 Arquivo: scripts/setup-storage-policies-only.sql')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar configuração
setupStorage()





