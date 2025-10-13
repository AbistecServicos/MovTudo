-- ========================================
-- CONTAR REGISTROS POR TABELA (CORRIGIDO)
-- ========================================
-- Execute este script para ver quantos registros há em cada tabela
-- ========================================

-- Contagem de registros por tabela
SELECT 'usuarios' AS tabela, COUNT(*) AS total FROM usuarios
UNION ALL
SELECT 'empresas', COUNT(*) FROM empresas
UNION ALL
SELECT 'empresa_associada', COUNT(*) FROM empresa_associada
UNION ALL
SELECT 'corridas', COUNT(*) FROM corridas
UNION ALL
SELECT 'precos', COUNT(*) FROM precos
UNION ALL
SELECT 'notificacoes', COUNT(*) FROM notificacoes
UNION ALL
SELECT 'telegram_config', COUNT(*) FROM telegram_config
UNION ALL
SELECT 'telegram_transportadores', COUNT(*) FROM telegram_transportadores
UNION ALL
SELECT 'telegram_notifications', COUNT(*) FROM telegram_notifications
UNION ALL
SELECT 'telegram_templates', COUNT(*) FROM telegram_templates
UNION ALL
SELECT 'user_tokens', COUNT(*) FROM user_tokens
ORDER BY total DESC;






