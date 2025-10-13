-- ============================================
-- CORRIGIR RLS (Row Level Security) - USUARIOS
-- ============================================

-- BLOCO 1: VERIFICAR POLÍTICAS ATUAIS
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'usuarios';

-- BLOCO 2: VERIFICAR SE RLS ESTÁ HABILITADO
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'usuarios';

-- BLOCO 3: DESABILITAR RLS TEMPORARIAMENTE (PARA TESTES)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- BLOCO 4: OU CRIAR POLÍTICA DE INSERÇÃO PÚBLICA
-- (Execute este EM VEZ do BLOCO 3 se preferir manter RLS)

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: Permitir que usuários autenticados criem suas próprias contas
CREATE POLICY "Usuarios podem criar sua propria conta"
ON usuarios
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uid);

-- Política: Permitir que usuários vejam seu próprio perfil
CREATE POLICY "Usuarios podem ver seu proprio perfil"
ON usuarios
FOR SELECT
TO authenticated
USING (auth.uid() = uid);

-- Política: Admin pode ver todos
CREATE POLICY "Admin pode ver todos os usuarios"
ON usuarios
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM usuarios
        WHERE uid = auth.uid() AND is_admin = true
    )
);

-- Política: Admin pode inserir qualquer usuário
CREATE POLICY "Admin pode inserir usuarios"
ON usuarios
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM usuarios
        WHERE uid = auth.uid() AND is_admin = true
    )
);

-- Política: Admin pode atualizar qualquer usuário
CREATE POLICY "Admin pode atualizar usuarios"
ON usuarios
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM usuarios
        WHERE uid = auth.uid() AND is_admin = true
    )
);

-- BLOCO 5: VERIFICAR POLÍTICAS CRIADAS
SELECT
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'usuarios'
ORDER BY policyname;





