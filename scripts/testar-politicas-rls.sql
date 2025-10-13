-- ========================================
-- TESTE: Verificar condições das políticas RLS
-- ========================================
-- Objetivo: Diagnosticar se as políticas estão funcionando
-- ========================================

-- 1. VERIFICAR se RLS está realmente habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'usuarios';

-- 2. VERIFICAR políticas com condições específicas
SELECT 
    policyname,
    cmd as operacao,
    qual as condicao_select,
    with_check as condicao_insert_update
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'usuarios'
ORDER BY cmd, policyname;

-- 3. TESTAR SELECT como anon (simula login)
SELECT 
    'TESTE SELECT ANON' as teste,
    COUNT(*) as total_usuarios
FROM public.usuarios;

-- 4. VERIFICAR se existe usuário admin
SELECT 
    id,
    email,
    nome_completo,
    is_admin,
    data_cadastro
FROM public.usuarios 
WHERE is_admin = true
LIMIT 5;

-- 5. VERIFICAR usuários no Supabase Auth
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 5;

-- 6. VERIFICAR se há associação entre auth.users e public.usuarios
SELECT 
    au.id as auth_id,
    au.email as auth_email,
    u.id as usuarios_id,
    u.email as usuarios_email,
    u.nome_completo
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.uid
ORDER BY au.created_at DESC
LIMIT 5;
