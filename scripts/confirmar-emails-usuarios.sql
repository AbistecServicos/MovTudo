-- ============================================
-- CONFIRMAR EMAILS DOS USUÁRIOS
-- ============================================
-- Este script confirma os emails dos usuários no Supabase Auth
-- Necessário executar no SQL Editor do Supabase Dashboard

-- BLOCO 1: VERIFICAR USUÁRIOS NÃO CONFIRMADOS
SELECT
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN '❌ NÃO CONFIRMADO'
        ELSE '✅ CONFIRMADO'
    END AS status
FROM auth.users
ORDER BY created_at DESC;

-- BLOCO 2: CONFIRMAR EMAIL DO GERENTE
UPDATE auth.users
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'gerente@mototaxiexpress.com'
  AND email_confirmed_at IS NULL
RETURNING id, email, email_confirmed_at;

-- BLOCO 3: CONFIRMAR EMAIL DO TRANSPORTADOR
UPDATE auth.users
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'transportador@mototaxiexpress.com'
  AND email_confirmed_at IS NULL
RETURNING id, email, email_confirmed_at;

-- BLOCO 4: VERIFICAR TODOS OS USUÁRIOS APÓS CONFIRMAÇÃO
SELECT
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN '❌ NÃO CONFIRMADO'
        ELSE '✅ CONFIRMADO'
    END AS status
FROM auth.users
ORDER BY created_at DESC;






