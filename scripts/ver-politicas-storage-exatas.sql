-- ========================================
-- VER POLÍTICAS EXATAS DO STORAGE
-- ========================================
-- Execute e me envie o resultado completo
-- ========================================

SELECT 
    name as nome,
    command as operacao,
    definition as expressao_using,
    check_definition as expressao_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND name ILIKE '%foto%perfil%'
ORDER BY command;

-- Resultado esperado: 4 linhas (SELECT, INSERT, UPDATE, DELETE)
-- Se não aparecer 4 linhas, está faltando política!



