#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando MovTudo...\n');

// Verificar se Node.js está na versão correta
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18+ é necessário. Versão atual:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version:', nodeVersion);

// Verificar se o arquivo .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env.local criado a partir do exemplo');
    console.log('⚠️  Configure as variáveis de ambiente no arquivo .env.local');
  } else {
    console.log('⚠️  Arquivo env.example não encontrado');
  }
} else {
  console.log('✅ Arquivo .env.local já existe');
}

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// Verificar se as variáveis de ambiente estão configuradas
console.log('\n🔧 Verificando configurações...');
require('dotenv').config({ path: envPath });

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'TELEGRAM_BOT_TOKEN'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  Variáveis de ambiente não configuradas:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nConfigure essas variáveis no arquivo .env.local');
} else {
  console.log('✅ Todas as variáveis de ambiente estão configuradas');
}

// Verificar estrutura do projeto
console.log('\n📁 Verificando estrutura do projeto...');
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'src/types',
  'src/context'
];

const missingDirs = requiredDirs.filter(dir => !fs.existsSync(path.join(process.cwd(), dir)));

if (missingDirs.length > 0) {
  console.log('⚠️  Diretórios não encontrados:');
  missingDirs.forEach(dir => {
    console.log(`   - ${dir}`);
  });
} else {
  console.log('✅ Estrutura do projeto está correta');
}

// Verificar se o banco de dados está configurado
console.log('\n🗄️  Verificando configuração do banco...');
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('✅ URL do Supabase configurada');
} else {
  console.log('⚠️  URL do Supabase não configurada');
}

// Instruções finais
console.log('\n🎉 Setup concluído!\n');
console.log('📋 Próximos passos:');
console.log('1. Configure as variáveis de ambiente no arquivo .env.local');
console.log('2. Execute o SQL de criação das tabelas no Supabase');
console.log('3. Execute o SQL de RLS Policies no Supabase');
console.log('4. Execute o SQL de Triggers no Supabase');
console.log('5. Configure o Google Maps API');
console.log('6. Configure o Telegram Bot');
console.log('7. Execute: npm run dev');
console.log('\n📚 Consulte o README.md para instruções detalhadas');

console.log('\n🚀 Para iniciar o servidor de desenvolvimento:');
console.log('   npm run dev');
console.log('\n📖 Para mais informações:');
console.log('   https://github.com/seu-usuario/movtudo');
