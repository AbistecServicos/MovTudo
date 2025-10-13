-- ========================================
-- CHECAR POLÍTICAS STORAGE - VERSÃO SIMPLES
-- ========================================
-- Execute no SQL Editor e copie TODO o resultado
-- ========================================

-- Listar todas as políticas do bucket 'box'
SELECT 
    id,
    name,
    bucket_id,
    roles,
    command,
    definition,
    check_definition
FROM storage.objects_policies
WHERE bucket_id = 'box'
ORDER BY command, name;

-- ========================================
-- COPIE TODO O RESULTADO E COLE AQUI NO CHAT
-- ========================================



