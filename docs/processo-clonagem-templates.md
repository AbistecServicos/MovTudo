# 🚀 Processo de Clonagem de Templates

## 🎯 **VISÃO GERAL**

Este documento descreve o processo completo para **clonar templates de nichos** no MovTudo. 
O objetivo é permitir a criação rápida de novas empresas usando templates já desenvolvidos e testados.

---

## 📋 **PRÉ-REQUISITOS**

### **Template Base Deve Estar:**
- [x] **100% funcional** e testado
- [x] **Documentado** completamente
- [x] **Recursos implementados** conforme checklist
- [x] **Empresa exemplo** funcionando (ex: E2 - Volta com Fé)

### **Novo Cliente Deve Ter:**
- [ ] **Definido o nicho** (transportadora, moto-taxi, etc.)
- [ ] **Dados básicos** (nome, endereço, contatos)
- [ ] **Logo e cores** da marca
- [ ] **Área de atuação** definida
- [ ] **Gerente principal** designado

---

## 🔄 **PROCESSO DE CLONAGEM**

### **FASE 1: PREPARAÇÃO**

#### **1.1 Identificar Template Base**
```bash
# Exemplo: Clonar E2 (Transportadora) para nova empresa
TEMPLATE_BASE="E2-Transportadora"
NOVA_EMPRESA="E5-CargaPesadaBR"
```

#### **1.2 Coletar Dados da Nova Empresa**
```json
{
  "empresa_nome": "Carga Pesada Brasil",
  "empresa_cidade": "São Paulo",
  "empresa_estado": "SP",
  "empresa_endereco": "Av. Paulista, 1000",
  "empresa_telefone": "(11) 99999-0001",
  "empresa_email": "contato@cargapesadabr.com.br",
  "slug": "carga-pesada-br",
  "cor_primaria": "#1e40af",
  "cor_secundaria": "#059669",
  "tipo_empresa": "transportadora",
  "servicos_oferecidos": ["carga", "frete", "logistica"],
  "empresa_perimetro_entrega": "São Paulo, Rio de Janeiro, Minas Gerais"
}
```

#### **1.3 Preparar Assets**
- [ ] **Logo da empresa** (PNG/SVG, fundo transparente)
- [ ] **Cores da marca** (primária e secundária)
- [ ] **Política de privacidade** (se específica)
- [ ] **Termos de uso** (se específicos)

---

### **FASE 2: CLONAGEM TÉCNICA**

#### **2.1 Duplicar Estrutura de Banco**
```sql
-- 1. Criar nova empresa baseada no template
INSERT INTO empresas (
  id_empresa,
  empresa_nome,
  empresa_cidade,
  empresa_estado,
  empresa_endereco,
  empresa_telefone,
  empresa_email,
  slug,
  cor_primaria,
  cor_secundaria,
  tipo_empresa,
  servicos_oferecidos,
  empresa_perimetro_entrega,
  empresa_logo,
  sobre_empresa,
  politica_privacidade,
  termos_uso,
  status_ativo,
  data_criacao
) VALUES (
  'E5',
  'Carga Pesada Brasil',
  'São Paulo',
  'SP',
  'Av. Paulista, 1000',
  '(11) 99999-0001',
  'contato@cargapesadabr.com.br',
  'carga-pesada-br',
  '#1e40af',
  '#059669',
  'transportadora',
  ARRAY['carga', 'frete', 'logistica'],
  'São Paulo, Rio de Janeiro, Minas Gerais',
  'https://storage.../logo-e5.png',
  'Transportadora especializada em cargas pesadas e fretes industriais...',
  'Política de privacidade específica...',
  'Termos de uso específicos...',
  true,
  NOW()
);
```

#### **2.2 Configurar Usuário Gerente**
```sql
-- 2. Criar usuário gerente principal
INSERT INTO usuarios (
  uid,
  email,
  nome,
  telefone,
  is_admin,
  data_criacao
) VALUES (
  'uuid-do-usuario-gerente',
  'gerente@cargapesadabr.com.br',
  'João Gerente',
  '(11) 99999-0002',
  false,
  NOW()
);

-- 3. Associar gerente à empresa
INSERT INTO empresa_associada (
  uid_usuario,
  id_empresa,
  funcao,
  status_vinculacao,
  data_vinculacao
) VALUES (
  'uuid-do-usuario-gerente',
  'E5',
  'gerente',
  'ativo',
  NOW()
);
```

#### **2.3 Configurar Páginas e Rotas**
```typescript
// As páginas já existem e são genéricas:
// - /transportadora (dashboard do gerente)
// - /transportador-transportadora (dashboard do transportador)
// - /[slug] (página pública da empresa)

// Apenas configurar o slug único no banco de dados
```

---

### **FASE 3: PERSONALIZAÇÃO**

#### **3.1 Upload de Assets**
```bash
# Upload do logo para Supabase Storage
curl -X POST \
  'https://buxpuusxglavepfrivwg.supabase.co/storage/v1/object/corridas-fotos/logos/logo-e5.png' \
  -H 'Authorization: Bearer SUPABASE_SERVICE_ROLE_KEY' \
  -H 'Content-Type: image/png' \
  --data-binary @logo-e5.png
```

#### **3.2 Configurar Cores e Tema**
```sql
-- Atualizar cores específicas da empresa
UPDATE empresas 
SET 
  cor_primaria = '#1e40af',
  cor_secundaria = '#059669'
WHERE id_empresa = 'E5';
```

#### **3.3 Personalizar Conteúdo**
```sql
-- Atualizar textos específicos
UPDATE empresas 
SET 
  sobre_empresa = 'Carga Pesada Brasil - Sua parceira de confiança para transporte de cargas industriais...',
  politica_privacidade = 'Política específica da Carga Pesada Brasil...',
  termos_uso = 'Termos específicos da Carga Pesada Brasil...'
WHERE id_empresa = 'E5';
```

---

### **FASE 4: TESTES E VALIDAÇÃO**

#### **4.1 Checklist de Testes**
- [ ] **Login do gerente** funciona corretamente
- [ ] **Dashboard do gerente** carrega com dados corretos
- [ ] **Página pública** (/carga-pesada-br) exibe informações corretas
- [ ] **Cores e logo** aplicados corretamente
- [ ] **Redirecionamentos** funcionam (gerente → /gerente)
- [ ] **Criação de transportador** funciona
- [ ] **Login de transportador** funciona
- [ ] **Dashboard de transportador** carrega corretamente

#### **4.2 Testes de Funcionalidade**
- [ ] **Gestão de caminhoneiros** (cadastrar, editar, excluir)
- [ ] **Gestão de fretes** (criar, aceitar, rastrear)
- [ ] **Cálculo de preços** funciona corretamente
- [ ] **Notificações** são enviadas
- [ ] **Relatórios** são gerados

---

### **FASE 5: ATIVAÇÃO**

#### **5.1 Configuração de Domínio (Opcional)**
```bash
# Se a empresa quiser domínio próprio:
# 1. Configurar DNS para apontar para movtudo.com.br
# 2. Configurar redirect no Vercel/Netlify
# 3. Atualizar empresa_logo e links
```

#### **5.2 Treinamento do Cliente**
- [ ] **Sessão de treinamento** (1-2 horas)
- [ ] **Manual de uso** entregue
- [ ] **Suporte inicial** (primeira semana)
- [ ] **Contato de suporte** fornecido

#### **5.3 Go-Live**
- [ ] **Empresa ativada** no sistema
- [ ] **Usuários criados** e treinados
- [ ] **Primeira operação** acompanhada
- [ ] **Feedback** coletado

---

## 📊 **CRONOGRAMA TÍPICO**

| **Fase** | **Duração** | **Responsável** |
|----------|-------------|-----------------|
| **Preparação** | 1 dia | Abistec + Cliente |
| **Clonagem Técnica** | 2-3 horas | Abistec |
| **Personalização** | 2-4 horas | Abistec |
| **Testes** | 1 dia | Abistec |
| **Ativação** | 1 dia | Abistec + Cliente |
| **Total** | **3-4 dias** | - |

---

## 🛠️ **FERRAMENTAS E SCRIPTS**

### **Script de Clonagem Automatizada**
```javascript
// scripts/clonar-template.js
const clonarTemplate = async (templateBase, novaEmpresa) => {
  // 1. Validar template base
  // 2. Criar empresa no banco
  // 3. Configurar usuário gerente
  // 4. Upload de assets
  // 5. Executar testes básicos
  // 6. Gerar relatório
}
```

### **Template de Configuração**
```json
{
  "template": "E2-Transportadora",
  "nova_empresa": {
    "id": "E5",
    "nome": "Carga Pesada Brasil",
    "slug": "carga-pesada-br",
    "cores": {
      "primaria": "#1e40af",
      "secundaria": "#059669"
    },
    "configuracoes": {
      "tipo_empresa": "transportadora",
      "servicos": ["carga", "frete", "logistica"],
      "perimetro": "São Paulo, Rio de Janeiro, Minas Gerais"
    }
  }
}
```

---

## 📋 **CHECKLIST FINAL**

### **Antes de Entregar:**
- [ ] **Empresa criada** e funcionando
- [ ] **Usuários configurados** e testados
- [ ] **Assets aplicados** corretamente
- [ ] **Funcionalidades testadas** e validadas
- [ ] **Documentação entregue** ao cliente
- [ ] **Treinamento realizado** com sucesso
- [ ] **Suporte configurado** e ativo

### **Pós-Entrega:**
- [ ] **Monitoramento** da primeira semana
- [ ] **Feedback** coletado e analisado
- [ ] **Ajustes** implementados se necessário
- [ ] **Relatório** de sucesso gerado
- [ ] **Template atualizado** com melhorias

---

## 🎯 **BENEFÍCIOS DO PROCESSO**

### **Para a Abistec:**
- **Desenvolvimento 10x mais rápido** (dias vs meses)
- **Qualidade garantida** (template testado)
- **Custo reduzido** (reutilização de código)
- **Escalabilidade** (múltiplas empresas rapidamente)

### **Para o Cliente:**
- **Solução rápida** (operacional em dias)
- **Recursos completos** desde o primeiro dia
- **Suporte especializado** no nicho
- **Custo-benefício** superior

---

## 📞 **CONTATO E SUPORTE**

- **Desenvolvimento:** Abistec
- **Documentação:** MovTudo Docs
- **Suporte:** comercial@abistec.com.br
- **Versão:** 1.0 (Outubro 2025)

---

## 🔄 **PRÓXIMOS PASSOS**

1. **Automatizar** o processo com scripts
2. **Criar templates** para outros nichos (E1, E3, E4)
3. **Desenvolver interface** de clonagem no admin
4. **Implementar** sistema de versionamento de templates
5. **Criar marketplace** de templates personalizados
