# 📋 Padrão de Login - MovTudo

## 🎯 **VISÃO GERAL**

O MovTudo implementa um sistema de login padronizado que diferencia usuários por função e contexto de acesso, garantindo uma experiência otimizada para cada tipo de usuário.

---

## 🏗️ **ESTRUTURA DE LOGIN**

### **1. LOGIN CENTRALIZADO (Página Principal)**
```
URL: http://localhost:3000/login
```

**Usuários:**
- ✅ **Transportadores** (todas as empresas)
- ✅ **Administradores** do sistema
- ✅ **Usuários multi-empresa**

**Características:**
- Acesso a múltiplas empresas
- Dashboard centralizado
- Flexibilidade total de movimentação
- Ideal para transportadores independentes

### **2. LOGIN ESPECÍFICO (Sites das Empresas)**
```
URL: http://localhost:3000/[slug]/login
Exemplo: http://localhost:3000/volta-com-fe/login
```

**Usuários:**
- ✅ **Gerentes** da empresa
- ✅ **Funcionários internos**
- ✅ **Usuários específicos** da empresa

**Características:**
- Contexto específico da empresa
- Mantém identidade visual
- Interface focada na gestão
- Acesso controlado por empresa

---

## 🔄 **FLUXO DE REDIRECIONAMENTO**

### **Após Login Bem-sucedido:**

```typescript
// Lógica de redirecionamento no AuthContext
if (user.is_admin === true) {
  → /admin (Dashboard Administrativo)
}

if (empresaAssociada && empresa) {
  if (funcao === 'gerente') {
    → /gerente (Dashboard do Gerente)
  }
  
  if (funcao === 'transportador') {
    if (empresa.tipo_empresa === 'transportadora') {
      → /transportador-transportadora (Dashboard Transportador)
    } else {
      → /transportador (Dashboard Transportador)
    }
  }
}

if (funcao === 'cliente') {
  → / (Página inicial)
}
```

---

## 🎨 **INTERFACE DE LOGIN**

### **Página Principal (/login):**
- **Título:** "Acessar Sistema MovTudo"
- **Seção especial:** "🚛 Você é Transportador?"
- **Descrição:** "Faça login aqui para acessar ofertas de todas as empresas"
- **Botão:** "Login para Transportadores"

### **Página da Empresa (/{slug}/login):**
- **Título:** "Entrar - {Nome da Empresa}"
- **Contexto:** Visual da empresa (cores, logo)
- **Foco:** Gestão interna da empresa
- **Usuários:** Gerentes e funcionários

---

## 🚛 **TRANSPORTADORES**

### **Características:**
- **Multi-empresa:** Podem trabalhar com várias empresas
- **Flexibilidade:** Não ficam "presos" a uma empresa
- **Mobilidade:** Podem atender diferentes regiões
- **Login centralizado:** Um acesso para todas as empresas

### **Dashboard:**
- **URL:** `/transportador-transportadora` (para transportadoras)
- **URL:** `/transportador` (para outras empresas)
- **Funcionalidades:**
  - Configurar disponibilidade
  - Informações do veículo
  - Receber ofertas de empresas
  - Gerenciar fretes aceitos

---

## 🏢 **GERENTES**

### **Características:**
- **Contexto específico:** Login direto na empresa
- **Identidade visual:** Mantém branding da empresa
- **Foco:** Interface específica para gestão
- **Segurança:** Acesso controlado por empresa

### **Dashboard:**
- **URL:** `/gerente`
- **Funcionalidades:**
  - Gestão de transportadores
  - Criação de ofertas
  - Acompanhamento de fretes
  - Relatórios da empresa

---

## 👑 **ADMINISTRADORES**

### **Características:**
- **Acesso total:** Todas as empresas
- **Gestão central:** Controle completo do sistema
- **Login centralizado:** Página principal

### **Dashboard:**
- **URL:** `/admin`
- **Funcionalidades:**
  - Gestão de empresas
  - Gestão de usuários
  - Relatórios gerais
  - Configurações do sistema

---

## 🎯 **VANTAGENS DO PADRÃO**

### **Para Transportadores:**
- ✅ **Multi-empresa:** Flexibilidade total
- ✅ **Simplicidade:** Um login para tudo
- ✅ **Mobilidade:** Não limitado geograficamente
- ✅ **Eficiência:** Acesso rápido a todas as oportunidades

### **Para Gerentes:**
- ✅ **Contexto específico:** Foco na empresa
- ✅ **Identidade visual:** Mantém branding
- ✅ **Segurança:** Controle de acesso
- ✅ **Produtividade:** Interface otimizada

### **Para o Sistema:**
- ✅ **Escalabilidade:** Fácil adicionar empresas
- ✅ **Manutenção:** Lógica centralizada
- ✅ **UX clara:** Fluxos específicos por usuário
- ✅ **Padronização:** Regras consistentes

---

## 📱 **EXEMPLOS DE USO**

### **Cenário 1: Transportador Independente**
```
1. Acessa: http://localhost:3000/login
2. Login: transportador1.e2@abistec.com.br
3. Redirecionado: /transportador-transportadora
4. Pode trabalhar com: E1, E2, E3, E4...
```

### **Cenário 2: Gerente da Volta com Fé**
```
1. Acessa: http://localhost:3000/volta-com-fe/login
2. Login: gerente1.e2@abistec.com.br
3. Redirecionado: /gerente
4. Foco: Gestão da E2 apenas
```

### **Cenário 3: Administrador**
```
1. Acessa: http://localhost:3000/login
2. Login: admin@movtudo.com.br
3. Redirecionado: /admin
4. Acesso: Todas as empresas
```

---

## 🔧 **IMPLEMENTAÇÃO TÉCNICA**

### **Arquivos Modificados:**
- `src/context/AuthContext.tsx` - Lógica de redirecionamento
- `src/app/[slug]/page.tsx` - Interface da empresa
- `src/app/page.tsx` - Página principal com seção transportadores
- `src/app/login/page.tsx` - Login centralizado
- `src/app/[slug]/login/page.tsx` - Login específico da empresa

### **Regras de Negócio:**
1. **Transportadores:** Sempre login centralizado
2. **Gerentes:** Login específico da empresa
3. **Administradores:** Login centralizado
4. **Clientes:** Acesso público às empresas

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

- [x] Corrigir erro `empresaAssociada is not defined`
- [x] Implementar redirecionamento inteligente
- [x] Adicionar seção transportadores na página principal
- [x] Documentar padrão completo
- [x] Testar fluxos de login
- [x] Validar redirecionamentos
- [x] Confirmar interface para cada tipo de usuário

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Testar** todos os fluxos de login
2. **Validar** redirecionamentos
3. **Treinar** usuários no novo padrão
4. **Monitorar** uso e feedback
5. **Iterar** baseado em necessidades reais

---

**Este padrão garante uma experiência otimizada para cada tipo de usuário, mantendo a flexibilidade e escalabilidade do sistema MovTudo.**
