# Changelog — CNX CMS

Todas as mudanças relevantes do template são documentadas aqui.

---

## [1.0.7] — 05/03/2026

### Correções

- **Atualizações**: bug do GitHub (404 em paths .github) — ao falhar a criação automática, exibe instruções manuais com link direto para criar o arquivo no GitHub e botão para copiar o conteúdo (3 passos simples)

---

## [1.0.6] — 05/03/2026

### Correções

- **Atualizações**: fallback via Git Data API quando a Contents API retorna 404 ao criar `.github/workflows/sync-cnx.yml` (Git Data também falha no path .github por bug conhecido)

---

## [1.0.3] — 06/03/2026

### Teste de atualização

- **Marca de verificação**: se você vê a versão **v1.0.3** no canto superior direito do painel admin, o fluxo de update funcionou corretamente.
- Atualização do template com sucesso.

---

## [1.0.2] — 05/03/2026

### Melhorias

- **Estrutura de URLs dos posts** configurável em Configurações → SEO:
  - Prefixo: com /blog ou na raiz (sem /blog)
  - Estrutura: nome do post, ano+mês ou data completa
- Exemplo: `/slug-do-post` ou `/blog/2025/03/slug-do-post`

---

## [1.0.1] — 05/03/2026

### Melhorias

- Checklist de onboarding com item "Ativar atualizações automáticas"
- ConfigStatus reforçado com urgência do workflow (obrigatório)
- Central de Ajuda com passo 3 mais explícito (obrigatório)
- Setup e Login com avisos sobre ativação do workflow
- API e Banner de atualização com mensagens de erro amigáveis e link para GitHub
- Changelog em Configurações (página separada)
- README atualizado e simplificado para usuários leigos

### Correções

- Breadcrumb: ao clicar no bairro, exibe página de serviços (antes caía em 404)

### Conteúdo padrão

- Modo Blog como padrão (siteMode: blog)
- Bairros do RJ cadastrados como padrão (Copacabana, Ipanema, Leblon, Botafogo, Barra da Tijuca, Centro, Leme, Flamengo)
- Template sem conteúdo motorhome; dados genéricos para começar vazio

### Removido

- Funcionalidade "Criar Tema com IA" (ThemeWizard e wizard completo)
- Chave de API exposta em settings.yaml
- Posts e pastas de lixo (_deleted, a-copia)

---

## [1.0.0] — 25/02/2026

### Lançamento inicial

- Painel admin completo com autenticação (roles: admin / editor)
- CRUD de posts com editor WYSIWYG (TipTap)
- Geração de posts com IA (OpenAI GPT-4o-mini)
- Gerenciamento de autores e categorias
- Biblioteca de mídia com upload de imagens
- Edição de páginas (Home, Sobre, Contato, Menu, Rodapé)
- Landing page de vendas (LP1) com estrutura Dot Com Secrets
- Configuração de pixels (Google Analytics 4 + Meta Pixel)
- Dashboard com analytics integrado
- Importador de posts do WordPress (XML)
- Suporte a GitHub API para edição de conteúdo em produção
- Deploy com 1 clique via Vercel
- Action de atualização automática do template
