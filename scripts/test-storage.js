const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Verifique se o arquivo .env.local existe e tem as variáveis:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStorage() {
  console.log('🧪 Testando configuração do Supabase Storage...\n')

  try {
    // 1. Verificar se o bucket existe
    console.log('1. Verificando bucket "box"...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError.message)
      return
    }

    const boxBucket = buckets.find(bucket => bucket.id === 'box')
    if (!boxBucket) {
      console.error('❌ Bucket "box" não encontrado!')
      console.log('Buckets disponíveis:', buckets.map(b => b.id))
      return
    }

    console.log('✅ Bucket "box" encontrado!')
    console.log(`   - Público: ${boxBucket.public}`)
    console.log(`   - Criado em: ${new Date(boxBucket.created_at).toLocaleString('pt-BR')}\n`)

    // 2. Testar upload de arquivo de teste
    console.log('2. Testando upload de arquivo...')
    const testFileName = `test/test-${Date.now()}.txt`
    const testContent = 'Teste de upload - MovTudo'
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('box')
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError.message)
      return
    }

    console.log('✅ Upload realizado com sucesso!')
    console.log(`   - Caminho: ${uploadData.path}`)

    // 3. Testar download do arquivo
    console.log('\n3. Testando download do arquivo...')
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('box')
      .download(testFileName)

    if (downloadError) {
      console.error('❌ Erro no download:', downloadError.message)
    } else {
      const text = await downloadData.text()
      console.log('✅ Download realizado com sucesso!')
      console.log(`   - Conteúdo: "${text}"`)
    }

    // 4. Gerar URL pública
    console.log('\n4. Gerando URL pública...')
    const { data: publicUrlData } = supabase.storage
      .from('box')
      .getPublicUrl(testFileName)

    console.log('✅ URL pública gerada:')
    console.log(`   ${publicUrlData.publicUrl}`)

    // 5. Limpar arquivo de teste
    console.log('\n5. Limpando arquivo de teste...')
    const { error: deleteError } = await supabase.storage
      .from('box')
      .remove([testFileName])

    if (deleteError) {
      console.warn('⚠️  Erro ao deletar arquivo de teste:', deleteError.message)
    } else {
      console.log('✅ Arquivo de teste removido!')
    }

    console.log('\n🎉 Teste de storage concluído com sucesso!')
    console.log('\n📋 Próximos passos:')
    console.log('1. Execute o SQL das políticas no Supabase')
    console.log('2. Teste o upload de foto na página de perfil')
    console.log('3. Teste o upload de logo na criação de empresa')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar teste
testStorage()




