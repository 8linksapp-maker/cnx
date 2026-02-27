# CNX CMS — Seu site profissional em minutos

CMS moderno feito com **Astro**, deploy grátis na **Vercel**.  
Sem banco de dados. Sem servidor. Você é dono de tudo.

---

## 🚀 Deploy em 1 clique

Clique no botão abaixo para começar — seu site estará no ar em menos de 5 minutos.

> 📖 **Dúvidas?** Consulte a [Central de Ajuda com FAQ completo →](https://8linksapp-maker.github.io/cnx)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F8linksapp-maker%2Fcnx&env=ADMIN_SECRET,GITHUB_TOKEN,GITHUB_OWNER,GITHUB_REPO&envDescription=ADMIN_SECRET%3A%20sua%20senha%20(login%3A%20admin%40admin.com%20%2B%20este%20valor)%20%7C%20GITHUB_TOKEN%3A%20gere%20em%20github.com%2Fsettings%2Ftokens%20marcando%20%22repo%22%20%7C%20GITHUB_OWNER%3A%20seu%20usu%C3%A1rio%20do%20GitHub%20%7C%20GITHUB_REPO%3A%20nome%20do%20projeto%20escolhido%20acima&envLink=https%3A%2F%2Fgithub.com%2F8linksapp-maker%2Fcnx%23-vari%C3%A1veis-de-ambiente&project-name=meu-site-cnx&repository-name=meu-site-cnx)

---

## 📋 Guia completo — do zero ao site no ar

Siga os passos abaixo **em ordem**. Cada um leva menos de 2 minutos.

---

### ✅ Passo 1 — Criar duas contas gratuitas

Você vai precisar de:

| Serviço | Para que serve | Link |
|---|---|---|
| **GitHub** | Guarda o código do seu site | [github.com/signup](https://github.com/signup) |
| **Vercel** | Publica o site na internet | [vercel.com/signup](https://vercel.com/signup) |

> 💡 **Dica:** Na Vercel, clique em **"Continue with GitHub"** — isso conecta as duas contas automaticamente.

---

### ✅ Passo 2 — Gerar o GITHUB_TOKEN (antes do deploy)

Você vai precisar desse token durante o deploy. **Faça agora, antes de clicar no botão.**

1. Acesse [github.com/settings/tokens](https://github.com/settings/tokens/new?description=CNX+CMS&scopes=repo)  
   *(o link já abre com as configurações corretas)*
2. No campo **"Note"** já está preenchido — só rolar a página
3. Clique em **"Generate token"** no final da página
4. **Copie o token gerado** (começa com `ghp_...`) — você só verá ele uma vez ⚠️

> Guarde o token em um bloco de notas por agora. Você vai colar ele no próximo passo.

---

### ✅ Passo 3 — Fazer o deploy

1. Clique no botão **"Deploy with Vercel"** no topo desta página
2. Faça login com sua conta do GitHub quando solicitado
3. Escolha um nome para o projeto (ex: `meu-site-cnx`) — **anote este nome, você vai precisar dele**
4. Preencha as 4 variáveis de ambiente:

| Variável | O que colocar | Exemplo |
|---|---|---|
| `ADMIN_SECRET` | Escolha uma senha — **será usada para entrar no painel** | `minhasenha2025` |
| `GITHUB_TOKEN` | O token que você copiou no passo anterior | `ghp_abc123...` |
| `GITHUB_OWNER` | Seu nome de usuário do GitHub | `joao-silva` |
| `GITHUB_REPO` | O nome do projeto que você escolheu acima | `meu-site-cnx` |

5. Clique em **Deploy** e aguarde ~2 minutos

Quando aparecer a tela de sucesso, seu site já está no ar! 🎉

> 💡 **Como saber meu usuário do GitHub?** Clique na sua foto de perfil no canto superior direito do GitHub — seu usuário aparece no topo.

---

### ✅ Passo 4 — Acessar o painel pela primeira vez

1. Acesse `https://SEU-PROJETO.vercel.app/admin`  
   *(substitua `SEU-PROJETO` pelo nome que você escolheu no deploy)*
2. Use as credenciais padrão:
   - **E-mail:** `admin@admin.com`
   - **Senha:** o valor que você colocou em `ADMIN_SECRET`
3. Clique em **Entrar**

Você verá o painel administrativo do seu site. ✅

---

### ✅ Passo 5 — Personalizar sua conta de administrador

> ⚠️ **Faça isso logo após o primeiro acesso** — por segurança, troque o e-mail e a senha padrão.

1. No painel, clique em **Autores** no menu lateral
2. Clique no autor **"Administrador"**
3. Altere:
   - **E-mail** → seu e-mail real
   - **Senha** → uma senha própria e segura
   - **Nome** → seu nome
4. Clique em **Salvar**

A partir deste momento, use seu e-mail e senha personalizados para entrar.

---

### ✅ Passo 6 — Ativar atualizações automáticas do template

Este passo é necessário para receber melhorias futuras do CNX automaticamente.

1. Acesse seu repositório no GitHub  
   *(vá em [github.com](https://github.com) → clique no repositório criado)*
2. Clique em **Settings** (aba no menu superior do repositório)
3. No menu lateral esquerdo, clique em **Actions → General**
4. Role a página até encontrar **"Workflow permissions"**
5. Marque **"Read and write permissions"**
6. Marque **"Allow GitHub Actions to create and approve pull requests"** ✓
7. Clique em **Save**

> ⚠️ **Sem este passo**, as atualizações automáticas não funcionarão e você verá um erro se tentar rodar manualmente.

---

### ✅ Passo 7 — Primeiros passos no painel

Após configurar tudo, faça estes ajustes iniciais no seu site:

| O que fazer | Onde encontrar |
|---|---|
| Alterar o nome do site | Admin → **Páginas** → **Configurações** |
| Adicionar o logo | Admin → **Páginas** → **Menu** |
| Editar a página inicial | Admin → **Páginas** → **Home** |
| Criar o primeiro post | Admin → **Posts** → **Novo Post** |
| Configurar categoria | Admin → **Categorias** |
| Personalizar cores e estilo | Admin → **Páginas** → **Tema** |
| Ver o site publicado | Acesse `https://SEU-PROJETO.vercel.app` |

---

### ✅ Passo 8 — Testar tudo

Confirme que está funcionando:

| O que testar | Como testar |
|---|---|
| Site público abre | Acesse `https://SEU-PROJETO.vercel.app` |
| Painel abre | Acesse `https://SEU-PROJETO.vercel.app/admin` |
| Login funciona | Use seu e-mail e senha |
| Criar post funciona | Admin → Posts → Novo Post → Salvar |
| Post aparece no blog | Acesse o blog público após salvar |

> Se algo não funcionar, veja a seção [Solução de Problemas](#-solução-de-problemas) abaixo.

---

## 🎨 Criar um tema personalizado com IA

O CNX possui um **Wizard de Criação de Temas** integrado ao painel admin.

Ele gera um prompt completo para você colar no **Cursor** (IDE com IA) — a IA cria o tema, faz o commit e publica na Vercel automaticamente.

**Como acessar:** Admin → **🎨 Criar Tema com IA**

**O que o wizard faz:**
- Coleta sua identidade visual (cores, estilo, fonte)
- Configura SEO, Open Graph e Schema.org
- Gera o texto da página /sobre e /contato
- Produz um prompt único pronto para o Cursor Agent

**Tipos de site disponíveis:**
| Tipo | Status |
|---|---|
| 📝 Blog / Conteúdo | ✅ Disponível |
| 🏠 Imobiliária | 🔒 Em breve |
| 🍕 Restaurante | 🔒 Em breve |
| 💼 Portfólio | 🔒 Em breve |
| 👩‍⚕️ Clínica / Saúde | 🔒 Em breve |
| 🎓 Curso / Mentoria | 🔒 Em breve |

---

## 🔄 Como receber atualizações do template

O CNX atualiza o template **automaticamente** toda segunda-feira. Quando há novidades, seu site é reconstruído sem você precisar fazer nada.

### Atualização automática (toda segunda-feira às 9h)

Quando há melhorias disponíveis, o sistema aplica automaticamente e a Vercel reconstrói seu site em ~2 minutos.

> **Seu conteúdo (posts, páginas, imagens) nunca é alterado.** Apenas os arquivos de código do template são atualizados.

### Atualizar agora pelo painel (sem abrir o GitHub)

Se não quiser esperar segunda-feira, atualize direto pelo painel admin:

1. Acesse `https://SEU-SITE.vercel.app/admin`
2. No **Dashboard**, se houver atualização disponível, aparecerá um botão amarelo **"🔄 Aplicar agora"**
3. Clique no botão — pronto! O site será reconstruído em ~2 minutos ✅

### Atualizar manualmente pelo GitHub (alternativa)

1. Acesse seu repositório no GitHub
2. Clique na aba **"Actions"**
3. Clique em **"🔄 Atualizar Template CNX"**
4. Clique em **"Run workflow"** → **"Run workflow"**

> ⚠️ Se aparecer o erro *"GitHub Actions is not permitted to create or approve pull requests"*, volte ao **Passo 6** e ative a permissão.

---

## 🖥️ O que você pode fazer no painel

| Seção | O que faz |
|---|---|
| **Dashboard** | Visão geral do site com versão do template e status de configuração |
| **Posts** | Criar, editar e publicar artigos no blog |
| **Autores** | Gerenciar autores e perfis |
| **Categorias** | Organizar posts por categoria |
| **Mídia** | Fazer upload de imagens |
| **Páginas** | Editar Home, Sobre, Contato, Menu, Rodapé |
| **Analytics** | Ver dados do Google Analytics |
| **Pixels** | Configurar Google Analytics e Meta Pixel |
| **Importar WordPress** | Importar posts de um site WordPress |
| **🎨 Criar Tema com IA** | Gerar prompt para criar tema personalizado no Cursor |

---

## ⚙️ Variáveis de ambiente — referência completa

Configure em: **Vercel → Settings → Environment Variables**

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ADMIN_SECRET` | **Sim** | **Sua senha de acesso ao painel.** Escolha um valor seguro (ex: `minhasenha2025`). Use esse mesmo valor para fazer login com o e-mail `admin@admin.com`. |
| `GITHUB_TOKEN` | **Sim** | Personal Access Token (permissão `repo`) — permite salvar conteúdo pelo painel em produção |
| `GITHUB_OWNER` | **Sim** | Seu usuário do GitHub (ex: `joao-silva`) |
| `GITHUB_REPO` | **Sim** | Nome do repositório (ex: `meu-site-cnx`) |
| `OPENAI_API_KEY` | Opcional | Chave da OpenAI para geração de posts com IA |

---

## 🛠️ Solução de Problemas

### ❓ O painel não aceita meu login

- Verifique que o e-mail é `admin@admin.com` (se ainda não trocou)
- A senha é o valor de `ADMIN_SECRET` — não é `padrao123`, é o valor que **você** definiu
- Se esqueceu o ADMIN_SECRET, veja a seção "Esqueci a senha" abaixo

### ❓ Não consigo salvar posts pelo painel (erro ao publicar)

As variáveis `GITHUB_TOKEN`, `GITHUB_OWNER` e `GITHUB_REPO` não estão configuradas ou estão incorretas.

1. Acesse **Vercel → seu projeto → Settings → Environment Variables**
2. Verifique se as três variáveis estão lá com os valores corretos
3. Se precisar corrigir, edite e depois clique em **Redeploy** no painel da Vercel

### ❓ GitHub Actions falha ao criar Pull Request

Você precisa ativar as permissões. Volte ao **Passo 6** deste guia.

### ❓ O site abre em branco ou mostra erro 500

1. Acesse **Vercel → seu projeto → Deployments**
2. Clique no último deploy e veja os logs de erro
3. Geralmente o problema é uma variável de ambiente ausente ou incorreta

### ❓ As atualizações automáticas não chegam

- Confirme que fez o **Passo 6** (GitHub Actions permissions)
- Verifique se as Actions estão habilitadas: repositório → aba **Actions** → se aparecer uma mensagem pedindo para ativar, clique em **"I understand my workflows, go ahead and enable them"**

---

## 🔑 Esqueci a senha do admin

**Opção 1 — Trocar o ADMIN_SECRET (mais fácil):**

1. Acesse **Vercel → seu projeto → Settings → Environment Variables**
2. Edite `ADMIN_SECRET` com uma nova senha
3. Clique em **Save** e aguarde o redeploy (~1 min)
4. Use a nova senha para entrar com `admin@admin.com`

**Opção 2 — Remover o hash pelo GitHub:**

1. Acesse seu repositório no GitHub
2. Navegue até `src/content/authors/`
3. Abra o arquivo `.yaml` do seu usuário
4. **Remova a linha** `adminPasswordHash: ...`
5. Faça commit da alteração
6. Acesse `/admin/setup` para recriar a conta

---

## 💻 Rodar localmente (para desenvolvedores)

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO

# 2. Instale as dependências
bun install

# 3. Crie o arquivo de variáveis
cp .env.example .env
# Edite o .env e adicione suas variáveis

# 4. Inicie o servidor
bun dev
```

Acesse **http://localhost:4321** para ver o site.  
Acesse **http://localhost:4321/admin** para o painel.  
Login local: `admin@admin.com` / `padrao123` (ou o ADMIN_SECRET do seu `.env`)

### Publicar alterações feitas localmente

```bash
git add .
git commit -m "descrição do que você alterou"
git push origin main
# A Vercel detecta o push e republica o site em ~1 minuto
```

---

## 🛠️ Tecnologias

- **[Astro](https://astro.build)** — Framework web moderno e ultrarrápido
- **[Vercel](https://vercel.com)** — Hospedagem serverless gratuita
- **[Tailwind CSS](https://tailwindcss.com)** — Estilização utilitária
- **[React](https://react.dev)** — Componentes interativos do painel
- **[TipTap](https://tiptap.dev)** — Editor de texto rico (WYSIWYG)

---

## 📄 Licença

MIT — use, modifique e distribua livremente.
