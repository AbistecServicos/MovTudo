# DOCUMENTAÇÃO DO PROJETO **MovTudo**

### **🚀 Visão Geral**

**MovTudo** é uma plataforma web (Next.js \+ Supabase) que conecta:

* **Empresas de transporte** (Moto-táxi, Táxi, Entregas rápidas)

* **Clientes** (que pedem corridas ou entregas)

* **Transportadores** (motoristas, motoboys, etc.)

* **Administradores** (gestores do sistema que visualizam todas as empresas)

O sistema permite **cadastro de empresas independentes**, cada uma com seu grupo de usuários, e **cálculo automático de preço e rota** via **Google Maps API**.  
 Notificações são enviadas por **Telegram Bot** para alertar sobre novos pedidos, status de corridas e mensagens internas.

---

## **🧱 TECNOLOGIAS PRINCIPAIS**

| Camada | Tecnologia | Função |
| ----- | ----- | ----- |
| Frontend | **Next.js \+ React** | Interface do cliente e painel administrativo |
| Banco de dados / Auth | **Supabase** | Armazena empresas, usuários, corridas e pedidos |
| Notificações | **Telegram Bot API** | Envia alertas e atualizações |
| Geolocalização | **Google Maps API / Places / Directions** | Cálculo de rotas e estimativas de preço |
| Storage | **Supabase Storage** | Armazena logos e imagens de empresas/entregas |
| Hospedagem | **Vercel** | Deploy automático do app Next.js |
| Integrações futuras | **Stripe / Mercado Pago** | Pagamentos (opcional) |

---

## **🧩 ESTRUTURA DE PERMISSÕES E FUNÇÕES**

| Função | Escopo | Permissões |
| ----- | ----- | ----- |
| 🧍‍♂️ **Cliente** | Empresa específica | Fazer pedidos de transporte (passageiro/objeto), acompanhar corridas |
| 🏍️ **Transportador** | Empresa específica | Receber corridas, atualizar status (indo buscar, entregue, etc.) |
| 🧑‍💼 **Gerente** | Empresa específica | Cadastrar transportadores e clientes da empresa, gerenciar pedidos |
| 🧑‍💻 **Administrador** | Global | Gerencia todas as empresas, cria e exclui empresas, visualiza tudo |

---

## **🗺️ FLUXO DE FUNCIONALIDADES**

1. **Administrador**

   * Cria empresas (E1, E2, E3...)

   * Define gerente principal de cada empresa

2. **Gerente**

   * Cadastra transportadores e clientes

   * Define preços base por km e tipo de veículo (moto, carro, etc.)

3. **Cliente**

   * Cria conta → Escolhe empresa local → Escolhe tipo de serviço:

     * 🚗 Transporte de Passageiro

     * 📦 Transporte de Objeto

   * Define origem/destino → sistema calcula preço → envia pedido

4. **Transportador**

   * Recebe notificação (Telegram)

   * Aceita ou recusa corrida

   * Atualiza status até entrega/conclusão

5. **Sistema**

   * Registra tudo em tempo real no Supabase

   * Envia atualizações via Telegram

---

## **🧮 ESTRUTURA DE TABELAS (Supabase)**

### **1️⃣ `empresas`**

| Campo | Tipo | Descrição |
| ----- | ----- | ----- |
| id | uuid | Identificador único |
| nome | text | Nome da empresa |
| slug | text | Ex: mototaxiexpress |
| logo\_url | text | Logo armazenado no Supabase Storage |
| cidade | text | Localização principal |
| ativo | boolean | Empresa ativa/inativa |
| data\_criacao | timestamp | Data de registro |

---

### **2️⃣ `usuarios`**

| Campo | Tipo | Descrição |
| ----- | ----- | ----- |
| id | uuid | ID do usuário |
| empresa\_id | uuid (FK empresas.id) | Empresa a que pertence |
| nome | text | Nome do usuário |
| telefone | text | Telefone |
| email | text | E-mail |
| funcao | enum(`cliente`, `transportador`, `gerente`, `admin`) | Função |
| senha\_hash | text | Hash de senha (Supabase Auth pode gerenciar isso) |
| ativo | boolean | Status |
| telegram\_id | text | ID para notificação no Telegram (opcional) |

---

### **3️⃣ `corridas`**

| Campo | Tipo | Descrição |
| ----- | ----- | ----- |
| id | uuid | ID da corrida/pedido |
| empresa\_id | uuid | Empresa |
| cliente\_id | uuid | Cliente que solicitou |
| transportador\_id | uuid | Motorista/motoboy |
| tipo | enum(`passageiro`, `objeto`) | Tipo de transporte |
| origem | json | { endereço, lat, lng } |
| destino | json | { endereço, lat, lng } |
| distancia\_km | float | Calculada pelo Google Maps |
| preco\_estimado | float | Calculado com base em tabela de preços |
| status | enum(`pendente`, `aceita`, `em_transporte`, `concluida`, `cancelada`) |  |
| descricao\_objeto | text | Se for transporte de objeto |
| peso\_estimado | float | Se for transporte de objeto |
| data\_criacao | timestamp | Data da solicitação |

---

### **4️⃣ `precos`**

| Campo | Tipo | Descrição |
| ----- | ----- | ----- |
| id | uuid | ID |
| empresa\_id | uuid | Empresa |
| tipo\_transporte | enum(`moto`, `carro`, `objeto`) |  |
| preco\_base | float | Valor inicial |
| preco\_por\_km | float | Valor adicional por km |

---

### **5️⃣ `notificacoes`**

| Campo | Tipo | Descrição |
| ----- | ----- | ----- |
| id | uuid | ID |
| usuario\_id | uuid | Destinatário |
| tipo | enum(`telegram`, `email`, `push`) |  |
| mensagem | text | Conteúdo da notificação |
| data\_envio | timestamp | Data |

---

## **💬 NOTIFICAÇÕES TELEGRAM**

* Criar bot via @BotFather

* Registrar o `telegram_id` de cada usuário no app (usando o `@username` ou via comando `/start`)

* Função de envio via Supabase Edge Function ou Next.js API route:

`// /pages/api/sendTelegram.js`  
`import axios from "axios";`

`const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;`

`export default async function handler(req, res) {`  
  `const { chatId, text } = req.body;`  
  ``await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {``  
    `chat_id: chatId,`  
    `text,`  
  `});`  
  `res.status(200).json({ ok: true });`  
`}`

---

## **🧠 RECURSOS SUGERIDOS FUTUROS**

1. **Avaliação de Motoristas / Clientes** ⭐

   * Clientes avaliam motoristas (1–5 estrelas).

   * Motoristas também avaliam clientes.

2. **Painel de relatórios por empresa**

   * Total de corridas, faturamento, distância média.

3. **Rastreamento em tempo real (WebSocket ou Supabase Realtime)**

   * Mostrar posição do transportador em tempo real no mapa.

4. **Integração com pagamento**

   * Cobrança automática com Stripe ou Mercado Pago.

5. **Sistema de cupons e promoções**

   * Cada empresa pode gerar cupons específicos.

6. **Exportação de relatórios**

   * CSV ou PDF direto do painel.

---

## **📁 ESTRUTURA DE PASTAS SUGERIDA (Next.js)**

`/src`  
  `/components`  
    `- MapPicker.js`  
    `- OrderForm.js`  
    `- RideStatus.js`  
  `/pages`  
    `/[empresa]`  
      `- index.js       → Página principal da empresa`  
      `- painel.js      → Painel da empresa`  
      `- nova-corrida.js`  
    `/api`  
      `- sendTelegram.js`  
      `- calcularPreco.js`  
  `/lib`  
    `- supabase.js`  
    `- googleMaps.js`  
  `/styles`  
    `- globals.css`

---

Se quiser, posso gerar **um esqueleto inicial do projeto Next.js** com:  
 ✅ Supabase configurado  
 ✅ Página dinâmica por empresa (`/[empresa]/index.js`)  
 ✅ Cadastro básico de corrida  
 ✅ Integração com Telegram de exemplo

# **🚀 MovTudo — Starter Kit (Next.js \+ Supabase \+ Telegram)**

## **🧱 1\. Tecnologias usadas**

| Função | Tecnologia |
| ----- | ----- |
| Frontend | **Next.js 14 (App Router)** \+ React |
| Banco e Auth | **Supabase** |
| Notificações | **Telegram Bot API** |
| Mapas e rotas | **Google Maps JavaScript API \+ Geocoding API** |
| Estilo | **TailwindCSS** |
| Deploy | **Vercel** |

---

## **📦 2\. Instalação**

`npx create-next-app movtudo`  
`cd movtudo`  
`npm install @supabase/supabase-js axios`  
`npm install -D tailwindcss postcss autoprefixer`  
`npx tailwindcss init -p`

Configura o **Tailwind** em `tailwind.config.js`:

`module.exports = {`  
  `content: ["./src/**/*.{js,ts,jsx,tsx}"],`  
  `theme: { extend: {} },`  
  `plugins: [],`  
`};`

Cria o arquivo `.env.local`:

`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co`  
`NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx`  
`TELEGRAM_BOT_TOKEN=xxxxx`  
`GOOGLE_MAPS_API_KEY=xxxxx`

---

## **🧩 3\. Estrutura de pastas**

`/src`  
  `/app`  
    `/[empresa]`  
      `/page.jsx           -> Página principal da empresa`  
      `/nova-corrida/page.jsx -> Formulário de corrida`  
    `/api`  
      `/telegram/route.js  -> Envio de mensagens via Telegram`  
      `/preco/route.js     -> Cálculo de preço com Google Maps`  
  `/components`  
      `EmpresaHeader.jsx`  
      `CorridaForm.jsx`  
  `/lib`  
      `supabaseClient.js`  
      `googleMaps.js`  
  `/styles`  
      `globals.css`

---

## **🗂️ 4\. /lib/supabaseClient.js**

`import { createClient } from "@supabase/supabase-js";`

`const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;`  
`const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;`

`export const supabase = createClient(supabaseUrl, supabaseAnonKey);`

---

## **🗂️ 5\. /lib/googleMaps.js**

`import axios from "axios";`

`export async function calcularDistancia(origem, destino) {`  
  `const apiKey = process.env.GOOGLE_MAPS_API_KEY;`  
  ``const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origem)}&destinations=${encodeURIComponent(destino)}&key=${apiKey}`;``

  `const { data } = await axios.get(url);`  
  `const distanciaMetros = data.rows[0].elements[0].distance.value;`  
  `return distanciaMetros / 1000; // em KM`  
`}`

---

## **🗂️ 6\. /app/api/telegram/route.js**

`import axios from "axios";`

`export async function POST(req) {`  
  `const { chatId, text } = await req.json();`  
  `const token = process.env.TELEGRAM_BOT_TOKEN;`

  ``await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {``  
    `chat_id: chatId,`  
    `text,`  
  `});`

  `return Response.json({ ok: true });`  
`}`

---

## **🗂️ 7\. /app/\[empresa\]/page.jsx**

`import { supabase } from "@/lib/supabaseClient";`  
`import EmpresaHeader from "@/components/EmpresaHeader";`

`export default async function EmpresaPage({ params }) {`  
  `const { data: empresa } = await supabase`  
    `.from("empresas")`  
    `.select("*")`  
    `.eq("slug", params.empresa)`  
    `.single();`

  `if (!empresa) return <div>Empresa não encontrada</div>;`

  `return (`  
    `<div className="min-h-screen bg-gray-50">`  
      `<EmpresaHeader empresa={empresa} />`  
      `<main className="p-6 text-center">`  
        `<h2 className="text-xl font-bold text-gray-700">`  
          `Bem-vindo à {empresa.nome}`  
        `</h2>`  
        `<p>Escolha o tipo de transporte:</p>`  
        `<div className="mt-6 flex justify-center gap-4">`  
          `<a`  
            ``href={`/${empresa.slug}/nova-corrida?tipo=passageiro`}``  
            `className="bg-blue-500 text-white px-4 py-2 rounded-lg"`  
          `>`  
            `Passageiro`  
          `</a>`  
          `<a`  
            ``href={`/${empresa.slug}/nova-corrida?tipo=objeto`}``  
            `className="bg-green-500 text-white px-4 py-2 rounded-lg"`  
          `>`  
            `Objeto`  
          `</a>`  
        `</div>`  
      `</main>`  
    `</div>`  
  `);`  
`}`

---

## **🗂️ 8\. /app/\[empresa\]/nova-corrida/page.jsx**

`"use client";`  
`import { useState } from "react";`  
`import { calcularDistancia } from "@/lib/googleMaps";`  
`import { supabase } from "@/lib/supabaseClient";`  
`import axios from "axios";`

`export default function NovaCorrida({ params, searchParams }) {`  
  `const tipo = searchParams.tipo;`  
  `const [origem, setOrigem] = useState("");`  
  `const [destino, setDestino] = useState("");`  
  `const [peso, setPeso] = useState("");`  
  `const [descricao, setDescricao] = useState("");`  
  `const [preco, setPreco] = useState(null);`

  `async function handleCalcular() {`  
    `const km = await calcularDistancia(origem, destino);`  
    `const precoBase = tipo === "objeto" ? 5 : 3;`  
    `const precoKm = tipo === "objeto" ? 2 : 1.5;`  
    `const total = precoBase + km * precoKm;`  
    `setPreco(total.toFixed(2));`  
  `}`

  `async function handleEnviar() {`  
    `await supabase.from("corridas").insert([`  
      `{`  
        `empresa_id: params.empresa,`  
        `tipo,`  
        `origem: { endereco: origem },`  
        `destino: { endereco: destino },`  
        `preco_estimado: preco,`  
        `descricao_objeto: descricao,`  
        `peso_estimado: peso,`  
        `status: "pendente",`  
      `},`  
    `]);`

    `await axios.post("/api/telegram", {`  
      `chatId: "123456789",`  
      ``text: `Nova corrida (${tipo}) solicitada na empresa ${params.empresa}`,``  
    `});`

    `alert("Pedido enviado!");`  
  `}`

  `return (`  
    `<div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md mt-10">`  
      `<h2 className="text-lg font-semibold mb-4">`  
        `Nova corrida ({tipo})`  
      `</h2>`  
      `<input`  
        `placeholder="Origem"`  
        `value={origem}`  
        `onChange={(e) => setOrigem(e.target.value)}`  
        `className="border p-2 w-full mb-3"`  
      `/>`  
      `<input`  
        `placeholder="Destino"`  
        `value={destino}`  
        `onChange={(e) => setDestino(e.target.value)}`  
        `className="border p-2 w-full mb-3"`  
      `/>`  
      `{tipo === "objeto" && (`  
        `<>`  
          `<input`  
            `placeholder="Peso aproximado (kg)"`  
            `value={peso}`  
            `onChange={(e) => setPeso(e.target.value)}`  
            `className="border p-2 w-full mb-3"`  
          `/>`  
          `<textarea`  
            `placeholder="Descrição do objeto"`  
            `value={descricao}`  
            `onChange={(e) => setDescricao(e.target.value)}`  
            `className="border p-2 w-full mb-3"`  
          `/>`  
        `</>`  
      `)}`  
      `<button`  
        `onClick={handleCalcular}`  
        `className="bg-gray-800 text-white w-full py-2 rounded-lg mb-2"`  
      `>`  
        `Calcular preço`  
      `</button>`  
      `{preco && (`  
        `<div className="text-center text-lg font-bold mb-2">`  
          `Valor estimado: R$ {preco}`  
        `</div>`  
      `)}`  
      `<button`  
        `onClick={handleEnviar}`  
        `className="bg-blue-500 text-white w-full py-2 rounded-lg"`  
      `>`  
        `Confirmar Pedido`  
      `</button>`  
    `</div>`  
  `);`  
`}`

---

## **💡 Sugestões de próximos passos**

✅ **1\. Implementar autenticação Supabase Auth** (clientes, gerentes, transportadores)  
 ✅ **2\. Adicionar painel do gerente** para ver corridas e motoristas da empresa  
 ✅ **3\. Integrar mapa interativo com `react-google-maps/api`**  
 ✅ **4\. Adicionar Supabase Realtime** para atualizar status em tempo real  
 ✅ **5\. Criar painel do admin global** (lista de empresas e métricas)

