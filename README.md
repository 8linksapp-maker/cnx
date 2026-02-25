# CNX CMS — Painel admin completo para o seu site

CMS moderno feito com **Astro**, pronto para publicar no **Vercel** gratuitamente.  
Sem banco de dados. Todo o conteúdo fica em arquivos — você é dono de tudo.

---

## Pré-requisitos

| Ferramenta | Versão | Link |
|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Bun | qualquer | [bun.sh](https://bun.sh) |
| Conta GitHub | gratuita | [github.com](https://github.com) |
| Conta Vercel | gratuita | [vercel.com](https://vercel.com) |

---

## Instalação local

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO

# 2. Instale as dependências
bun install

# 3. Inicie o servidor de desenvolvimento
bun dev
```

Abra **http://localhost:4321** para ver o site.  
Acesse **http://localhost:4321/admin** para entrar no painel.

---

## Primeira configuração

Na **primeira vez** que acessar `/admin`, o sistema redireciona para a tela de configuração inicial.

1. Preencha seu **nome**, **e-mail** e **senha** (mínimo 6 caracteres)
2. Clique em **Criar conta e entrar**
3. Pronto — você está dentro do painel como Administrador

> Essa tela aparece apenas uma vez. Depois disso, o acesso é sempre pela tela de login.

---

## Deploy no Vercel (passo a passo)

### Passo 1 — Subir o código no GitHub

Se ainda não tem o repositório no GitHub:

```bash
git init
git add .
git commit -m "primeiro commit"
```

Crie um repositório em [github.com/new](https://github.com/new) e depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git branch -M main
git push -u origin main
```

---

### Passo 2 — Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar a conta do GitHub)
2. Clique em **Add New Project**
3. Selecione o repositório que você acabou de subir
4. O Vercel detecta o **Astro** automaticamente — não mude nada no framework

---

### Passo 3 — Configurar variável de ambiente ⚠️

**Este passo é obrigatório.** Antes de clicar em Deploy:

1. Na tela de configuração do projeto, expanda a seção **Environment Variables**
2. Adicione:
   - **Name:** `ADMIN_SECRET`
   - **Value:** uma senha longa e aleatória (ex: `meu-site-2024-chave-super-secreta-troque-isso`)
3. Clique em **Add**

> Sem o `ADMIN_SECRET`, qualquer pessoa poderia forjar uma sessão de login.  
> Use algo longo e único — não compartilhe esse valor.

---

### Passo 4 — Deploy

Clique em **Deploy** e aguarde (~1-2 minutos).

Quando aparecer "Congratulations!", seu site está no ar! 🎉

---

### Passo 5 — Configuração inicial em produção

1. Acesse `https://SEU-SITE.vercel.app/admin`
2. O sistema vai redirecionar para a tela de **Configuração Inicial**
3. Crie sua conta de administrador
4. Pronto — painel funcionando em produção

---

## Publicar novo conteúdo

O Vercel é **serverless** — os arquivos do servidor não podem ser alterados em produção.  
O fluxo correto é sempre: **editar local → commitar → publicar**.

```
1. Edite posts/páginas no painel admin local (localhost:4321/admin)
        ↓
2. Os arquivos .yaml e .mdoc são salvos no seu computador
        ↓
3. git add . && git commit -m "novo post"
        ↓
4. git push origin main
        ↓
5. Vercel detecta o push e republica o site em ~1 minuto ✓
```

---

## Estrutura do conteúdo

```
src/content/
├── posts/           → Artigos do blog (.mdoc)
├── authors/         → Autores (.yaml)
├── categories/      → Categorias (.yaml)
└── singletons/
    └── classic/
        ├── home.yaml      → Página inicial
        ├── about.yaml     → Sobre
        ├── contact.yaml   → Contato
        ├── menu.yaml      → Menu de navegação
        ├── footer.yaml    → Rodapé
        └── pixels.yaml    → Google Analytics & Meta Pixel
```

---

## Painel Admin

| Seção | O que faz | Acesso |
|---|---|---|
| Dashboard | Visão geral do site | Todos |
| Posts | Criar, editar, deletar artigos | Todos |
| Autores | Gerenciar autores e permissões | Todos (criar roles: Admin) |
| Categorias | Gerenciar categorias | Todos |
| Mídia | Upload de imagens | Todos |
| Páginas | Editar páginas (Home, Sobre, Contato…) | Todos |
| Analytics | Ver dados do Google Analytics | Admin |
| Pixels | Configurar GA4 e Meta Pixel | Admin |
| Importar WordPress | Importar posts do WordPress | Admin |

### Níveis de permissão

- **Admin** — acesso total, incluindo Pixels, Analytics e importação
- **Editor** — posts, páginas, categorias e mídia

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ADMIN_SECRET` | **Sim (produção)** | Chave para assinar os cookies de sessão |

Configure em: **Vercel → Settings → Environment Variables**

Para gerar uma chave segura:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Configurar Google Analytics no painel

Para ver métricas dentro do admin (seção Analytics):

1. Acesse [console.cloud.google.com](https://console.cloud.google.com) e crie um projeto
2. Ative a **Google Analytics Data API**
3. Crie uma **Conta de Serviço** e baixe o JSON de credenciais
4. No Google Analytics: adicione o e-mail da conta de serviço como **Leitor**
5. No painel admin: **Pixels** → cole o ID da Propriedade GA4 e o conteúdo do JSON

---

## Esqueci a senha

Edite o arquivo YAML do seu autor em `src/content/authors/[slug].yaml` e remova a linha `adminPasswordHash`.  
Na próxima vez que acessar `/admin`, a tela de configuração inicial voltará a aparecer.

---

## Comandos

```bash
bun dev          # Servidor local (localhost:4321)
bun build        # Build de produção
bun preview      # Pré-visualizar o build localmente
bun run deploy   # Deploy direto para o Vercel via CLI
```

---

## Tecnologias

- **[Astro](https://astro.build)** — Framework web
- **[Vercel](https://vercel.com)** — Hospedagem serverless gratuita
- **[Tailwind CSS](https://tailwindcss.com)** — Estilização
- **[React](https://react.dev)** — Componentes interativos do painel
- **[js-yaml](https://github.com/nodeca/js-yaml)** — Leitura/escrita de conteúdo

---

## Licença

MIT — use, modifique e distribua livremente.
