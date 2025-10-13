// Teste simples do Supabase
const { createClient } = require('@supabase/supabase-js');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

console.log('=== TESTE SUPABASE ===');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'NOT FOUND');

try {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  console.log('✅ Cliente Supabase criado com sucesso!');
  console.log('URL do cliente:', supabase.supabaseUrl);
  console.log('Chave do cliente:', supabase.supabaseKey ? 'EXISTS' : 'NOT FOUND');
  
} catch (error) {
  console.log('❌ Erro ao criar cliente:', error.message);
}

console.log('=====================');
