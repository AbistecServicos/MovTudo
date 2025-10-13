-- ========================================
-- VERIFICAR POLÍTICAS DO STORAGE
-- ========================================
-- Este script mostra todas as políticas RLS do Storage
-- Execute no SQL Editor do Supabase
-- ========================================

-- 1. POLÍTICAS DO STORAGE.OBJECTS
-- Estas são as políticas que controlam acesso aos arquivos
SELECT 
    'STORAGE OBJECTS' as tipo,
    id,
    name as nome_politica,
    bucket_id,
    definition as expressao_using,
    check_definition as expressao_check,
    CASE 
        WHEN command = 'SELECT' THEN 'Visualizar'
        WHEN command = 'INSERT' THEN 'Upload'
        WHEN command = 'UPDATE' THEN 'Atualizar'
        WHEN command = 'DELETE' THEN 'Deletar'
        ELSE command 
    END as operacao,
    CASE 
        WHEN roles = '{public}' THEN 'Público'
        WHEN roles = '{authenticated}' THEN 'Autenticados'
        WHEN roles = '{anon}' THEN 'Anônimos'
        ELSE roles::text 
    END as quem_pode_usar
FROM storage.objects_policies
WHERE bucket_id = 'box'
ORDER BY bucket_id, command, name;

-- 2. VERIFICAR SE HÁ POLÍTICAS NOS BUCKETS
SELECT 
    'STORAGE BUCKETS' as tipo,
    id,
    name as nome_bucket,
    public as e_publico,
    file_size_limit,
    allowed_mime_types as tipos_permitidos
FROM storage.buckets
WHERE name = 'box';

-- 3. CONTAR POLÍTICAS POR OPERAÇÃO
SELECT 
    'RESUMO' as secao,
    command as operacao,
    COUNT(*) as total_politicas,
    STRING_AGG(name, ', ') as nomes_politicas
FROM storage.objects_policies
WHERE bucket_id = 'box'
GROUP BY command
ORDER BY command;

-- 4. VERIFICAR ESTRUTURA DE PASTAS
-- (Este não é um comando SQL direto, mas ajuda a entender)
SELECT 
    'ESTRUTURA' as secao,
    'box/pdf' as pasta,
    'Documentos PDF' as descricao
UNION ALL
SELECT 'ESTRUTURA', 'box/logo', 'Logos das empresas'
UNION ALL
SELECT 'ESTRUTURA', 'box/foto_perfil', 'Fotos de perfil dos usuários'
UNION ALL
SELECT 'ESTRUTURA', 'box/imagens', 'Imagens de objetos';

-- 5. VERIFICAR SE FALTA ALGUMA POLÍTICA IMPORTANTE
-- Devemos ter 4 operações para cada pasta crítica
WITH politicas_esperadas AS (
    SELECT 'foto_perfil' as pasta, 'SELECT' as operacao UNION ALL
    SELECT 'foto_perfil', 'INSERT' UNION ALL
    SELECT 'foto_perfil', 'UPDATE' UNION ALL
    SELECT 'foto_perfil', 'DELETE' UNION ALL
    SELECT 'logo', 'SELECT' UNION ALL
    SELECT 'logo', 'INSERT' UNION ALL
    SELECT 'logo', 'UPDATE' UNION ALL
    SELECT 'logo', 'DELETE' UNION ALL
    SELECT 'imagens', 'SELECT' UNION ALL
    SELECT 'imagens', 'INSERT' UNION ALL
    SELECT 'imagens', 'UPDATE' UNION ALL
    SELECT 'imagens', 'DELETE'
),
politicas_existentes AS (
    SELECT 
        CASE 
            WHEN name ILIKE '%foto%perfil%' THEN 'foto_perfil'
            WHEN name ILIKE '%logo%' THEN 'logo'
            WHEN name ILIKE '%imag%' THEN 'imagens'
            WHEN name ILIKE '%pdf%' THEN 'pdf'
            ELSE 'outro'
        END as pasta,
        command as operacao
    FROM storage.objects_policies
    WHERE bucket_id = 'box'
)
SELECT 
    'ANÁLISE' as secao,
    pe.pasta,
    pe.operacao,
    CASE 
        WHEN pex.operacao IS NULL THEN '❌ FALTANDO'
        ELSE '✅ OK'
    END as status
FROM politicas_esperadas pe
LEFT JOIN politicas_existentes pex 
    ON pe.pasta = pex.pasta AND pe.operacao = pex.operacao
ORDER BY pe.pasta, pe.operacao;



