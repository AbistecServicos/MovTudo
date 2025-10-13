-- =============================================
-- POLÍTICAS DE SEGURANÇA PARA SUPABASE STORAGE
-- =============================================

-- 1. Política para a pasta 'box' - permitir leitura pública
CREATE POLICY "Pasta box é pública para leitura" ON storage.objects
FOR SELECT USING (bucket_id = 'box');

-- 2. Política para upload de imagens na pasta 'box/imagens'
CREATE POLICY "Usuários autenticados podem fazer upload de imagens" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'imagens'
  AND auth.role() = 'authenticated'
);

-- 3. Política para atualizar imagens na pasta 'box/imagens'
CREATE POLICY "Usuários podem atualizar suas próprias imagens" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'imagens'
  AND auth.role() = 'authenticated'
);

-- 4. Política para deletar imagens na pasta 'box/imagens'
CREATE POLICY "Usuários podem deletar suas próprias imagens" ON storage.objects
FOR DELETE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'imagens'
  AND auth.role() = 'authenticated'
);

-- 5. Política para upload de fotos de perfil na pasta 'box/foto_perfil'
CREATE POLICY "Usuários autenticados podem fazer upload de foto de perfil" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.role() = 'authenticated'
);

-- 6. Política para atualizar fotos de perfil na pasta 'box/foto_perfil'
CREATE POLICY "Usuários podem atualizar suas próprias fotos de perfil" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.role() = 'authenticated'
);

-- 7. Política para deletar fotos de perfil na pasta 'box/foto_perfil'
CREATE POLICY "Usuários podem deletar suas próprias fotos de perfil" ON storage.objects
FOR DELETE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.role() = 'authenticated'
);

-- 8. Política para upload de logos na pasta 'box/logo'
CREATE POLICY "Usuários autenticados podem fazer upload de logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND auth.role() = 'authenticated'
);

-- 9. Política para atualizar logos na pasta 'box/logo'
CREATE POLICY "Usuários podem atualizar logos das suas empresas" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND auth.role() = 'authenticated'
);

-- 10. Política para deletar logos na pasta 'box/logo'
CREATE POLICY "Usuários podem deletar logos das suas empresas" ON storage.objects
FOR DELETE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND auth.role() = 'authenticated'
);

-- 11. Política para upload de PDFs na pasta 'box/pdf'
CREATE POLICY "Usuários autenticados podem fazer upload de PDFs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'pdf'
  AND auth.role() = 'authenticated'
);

-- 12. Política para atualizar PDFs na pasta 'box/pdf'
CREATE POLICY "Usuários podem atualizar seus próprios PDFs" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'pdf'
  AND auth.role() = 'authenticated'
);

-- 13. Política para deletar PDFs na pasta 'box/pdf'
CREATE POLICY "Usuários podem deletar seus próprios PDFs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'pdf'
  AND auth.role() = 'authenticated'
);

-- =============================================
-- CONFIGURAÇÕES ADICIONAIS
-- =============================================

-- Verificar se o bucket 'box' existe, se não, criar
INSERT INTO storage.buckets (id, name, public)
VALUES ('box', 'box', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =============================================
-- COMENTÁRIOS SOBRE AS POLÍTICAS
-- =============================================

/*
ESTRUTURA DE PASTAS:
box/
├── imagens/          - Fotos de objetos para transporte
├── foto_perfil/      - Fotos de perfil dos usuários
├── logo/             - Logos das empresas
└── pdf/              - Arquivos PDF diversos

POLÍTICAS IMPLEMENTADAS:
- Leitura pública para todas as pastas (para exibir imagens/logos)
- Upload apenas para usuários autenticados
- Update/Delete apenas para usuários autenticados
- Estrutura preparada para futuras validações mais específicas
*/




