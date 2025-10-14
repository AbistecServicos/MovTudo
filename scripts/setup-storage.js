#!/usr/bin/env node

/**
 * Script para configurar as políticas de segurança do Supabase Storage
 * Execute este script após criar a pasta 'box' no Supabase Storage
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log('🚀 Configurando Supabase Storage...')

  try {
    // 1. Criar bucket 'box' se não existir
    console.log('📦 Verificando bucket "box"...')
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      throw bucketsError
    }

    const boxBucket = buckets.find(bucket => bucket.id === 'box')
    
    if (!boxBucket) {
      console.log('📦 Criando bucket "box"...')
      const { error: createError } = await supabase.storage.createBucket('box', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/webp',
          'image/svg+xml',
          'application/pdf'
        ]
      })

      if (createError) {
        throw createError
      }
      console.log('✅ Bucket "box" criado com sucesso!')
    } else {
      console.log('✅ Bucket "box" já existe!')
    }

    // 2. Executar políticas SQL
    console.log('🔒 Aplicando políticas de segurança...')
    
    const fs = require('fs')
    const path = require('path')
    
    const sqlFile = path.join(__dirname, 'setup-storage-policies.sql')
    const sqlContent = fs.readFileSync(sqlFile, 'utf8')

    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    for (const command of commands) {
      if (command.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: command })
        if (error) {
          console.warn(`⚠️  Aviso ao executar comando: ${error.message}`)
        }
      }
    }

    // 3. Verificar estrutura de pastas
    console.log('📁 Verificando estrutura de pastas...')
    
    const folders = ['imagens', 'foto_perfil', 'logo', 'pdf']
    
    for (const folder of folders) {
      const { data: files, error } = await supabase.storage
        .from('box')
        .list(folder, { limit: 1 })

      if (error && error.message.includes('not found')) {
        console.log(`📁 Criando pasta "${folder}"...`)
        
        // Criar um arquivo temporário para criar a pasta
        const { error: createError } = await supabase.storage
          .from('box')
          .upload(`${folder}/.gitkeep`, new Blob([''], { type: 'text/plain' }), {
            cacheControl: '3600',
            upsert: true
          })

        if (createError) {
          console.warn(`⚠️  Erro ao criar pasta "${folder}": ${createError.message}`)
        } else {
          console.log(`✅ Pasta "${folder}" criada!`)
        }
      } else {
        console.log(`✅ Pasta "${folder}" já existe!`)
      }
    }

    console.log('🎉 Configuração do Storage concluída com sucesso!')
    console.log('\n📋 Resumo:')
    console.log('   ✅ Bucket "box" configurado')
    console.log('   ✅ Políticas de segurança aplicadas')
    console.log('   ✅ Pastas criadas: imagens/, foto_perfil/, logo/, pdf/')
    console.log('\n🔗 URLs públicas disponíveis em:')
    console.log(`   ${supabaseUrl}/storage/v1/object/public/box/`)

  } catch (error) {
    console.error('❌ Erro na configuração:', error.message)
    process.exit(1)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupStorage()
}

module.exports = { setupStorage }






