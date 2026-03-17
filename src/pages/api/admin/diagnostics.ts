/**
 * api/admin/diagnostics.ts
 * 
 * Sistema de diagnóstico completo que testa todos os aspectos do sistema
 * de atualizações e fornece soluções específicas para cada problema.
 * 
 * GET /api/admin/diagnostics
 * 
 * Executa testes abrangentes e retorna:
 * - Status de cada componente
 * - Detalhes técnicos dos erros
 * - Sugestões automáticas de solução
 * - Links diretos para correção
 */

import type { APIRoute } from 'astro';
import { verifySession, SESSION_COOKIE } from '../../../utils/auth-utils';

type DiagnosticTest = {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  solution?: {
    title: string;
    description: string;
    action: string;
    link?: string;
  };
  technical?: string;
};

type DiagnosticReport = {
  timestamp: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    overall: 'healthy' | 'issues' | 'critical';
  };
  tests: DiagnosticTest[];
  quickFixes: string[];
};

export const GET: APIRoute = async ({ cookies }) => {
  // ─── Autenticação ──────────────────────────────────────────────────────────
  const token = cookies.get(SESSION_COOKIE)?.value;
  const session = token ? verifySession(token) : null;

  if (!session || session.adminRole !== 'admin') {
    return new Response(JSON.stringify({ success: false, error: 'Não autorizado.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ─── Executar diagnósticos ─────────────────────────────────────────────────
  const report: DiagnosticReport = {
    timestamp: new Date().toISOString(),
    summary: { total: 0, passed: 0, failed: 0, warnings: 0, overall: 'healthy' },
    tests: [],
    quickFixes: []
  };

  const githubToken = process.env.GITHUB_TOKEN?.trim();
  const githubOwner = process.env.GITHUB_OWNER?.trim();
  const githubRepo = process.env.GITHUB_REPO?.trim();

  // Teste 1: Variáveis de ambiente
  report.tests.push(await testEnvironmentVariables(githubToken, githubOwner, githubRepo));

  // Se não tiver variáveis básicas, parar aqui
  if (!githubToken || !githubOwner || !githubRepo) {
    report.summary = calculateSummary(report.tests);
    return new Response(JSON.stringify({ success: true, report }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Teste 2: Conectividade GitHub API
  report.tests.push(await testGitHubConnection(githubToken, githubOwner, githubRepo));

  // Teste 3: Workflow existente
  report.tests.push(await testWorkflowExists(githubToken, githubOwner, githubRepo));

  // Teste 4: Permissões do repositório
  report.tests.push(await testRepositoryPermissions(githubToken, githubOwner, githubRepo));

  // Teste 5: Histórico de execuções
  report.tests.push(await testWorkflowHistory(githubToken, githubOwner, githubRepo));

  // Teste 6: Verificação de versões
  report.tests.push(await testVersionCheck(githubToken, githubOwner, githubRepo));

  // Calcular resumo final
  report.summary = calculateSummary(report.tests);
  
  // Gerar quick fixes
  report.quickFixes = generateQuickFixes(report.tests, githubOwner, githubRepo);

  return new Response(JSON.stringify({ success: true, report }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

// ─── Testes individuais ────────────────────────────────────────────────────────

async function testEnvironmentVariables(
  token: string | undefined,
  owner: string | undefined,
  repo: string | undefined
): Promise<DiagnosticTest> {
  const test: DiagnosticTest = {
    id: 'env_vars',
    name: 'Variáveis de Ambiente',
    description: 'Verificar se todas as variáveis necessárias estão configuradas',
    status: 'pass',
    details: 'Todas as variáveis estão configuradas corretamente'
  };

  const issues: string[] = [];
  
  if (!token) issues.push('GITHUB_TOKEN ausente');
  else if (!token.startsWith('ghp_')) issues.push('GITHUB_TOKEN formato inválido');
  
  if (!owner) issues.push('GITHUB_OWNER ausente');
  if (!repo) issues.push('GITHUB_REPO ausente');

  if (issues.length > 0) {
    test.status = 'fail';
    test.details = `Problemas encontrados: ${issues.join(', ')}`;
    test.solution = {
      title: 'Configurar variáveis de ambiente',
      description: 'Configure as variáveis necessárias na Vercel',
      action: 'Ir para configurações da Vercel',
      link: 'https://vercel.com/dashboard'
    };
    test.technical = 'Configure em Vercel → Projeto → Settings → Environment Variables';
  }

  return test;
}

async function testGitHubConnection(
  token: string,
  owner: string,
  repo: string
): Promise<DiagnosticTest> {
  const test: DiagnosticTest = {
    id: 'github_connection',
    name: 'Conexão com GitHub',
    description: 'Testar se o token tem acesso ao repositório',
    status: 'pass',
    details: 'Conexão estabelecida com sucesso'
  };

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      }
    });

    if (!response.ok) {
      test.status = 'fail';
      if (response.status === 401) {
        test.details = 'Token inválido ou expirado';
        test.technical = `GitHub API retornou 401: ${await response.text()}`;
      } else if (response.status === 403) {
        test.details = 'Token sem permissão para acessar o repositório';
        test.technical = `GitHub API retornou 403: ${await response.text()}`;
      } else if (response.status === 404) {
        test.details = 'Repositório não encontrado ou token sem acesso';
        test.technical = `GitHub API retornou 404: ${await response.text()}`;
      } else {
        test.details = `Erro na API do GitHub (${response.status})`;
        test.technical = await response.text();
      }
      
      test.solution = {
        title: 'Renovar token do GitHub',
        description: 'Criar um novo token com permissões adequadas',
        action: 'Gerar novo token',
        link: 'https://github.com/settings/tokens/new?description=CNX+CMS&scopes=repo'
      };
    }
  } catch (error) {
    test.status = 'fail';
    test.details = 'Erro de rede ao conectar com o GitHub';
    test.technical = error instanceof Error ? error.message : String(error);
  }

  return test;
}

async function testWorkflowExists(
  token: string,
  owner: string,
  repo: string
): Promise<DiagnosticTest> {
  const test: DiagnosticTest = {
    id: 'workflow_exists',
    name: 'Arquivo de Workflow',
    description: 'Verificar se .github/workflows/sync-cnx.yml existe',
    status: 'pass',
    details: 'Workflow encontrado e configurado'
  };

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows/sync-cnx.yml`,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
        }
      }
    );

    if (!response.ok) {
      test.status = 'fail';
      test.details = 'Arquivo de workflow não encontrado';
      test.solution = {
        title: 'Criar arquivo de workflow',
        description: 'Criar .github/workflows/sync-cnx.yml no repositório',
        action: 'Criar automaticamente',
        link: `/admin/configuracoes/atualizacoes`
      };
      test.technical = `GitHub API retornou ${response.status}`;
    }
  } catch (error) {
    test.status = 'fail';
    test.details = 'Erro ao verificar arquivo de workflow';
    test.technical = error instanceof Error ? error.message : String(error);
  }

  return test;
}

async function testRepositoryPermissions(
  token: string,
  owner: string,
  repo: string
): Promise<DiagnosticTest> {
  const test: DiagnosticTest = {
    id: 'repo_permissions',
    name: 'Permissões do Repositório',
    description: 'Verificar permissões necessárias para atualizações',
    status: 'pass',
    details: 'Permissões adequadas configuradas'
  };

  try {
    // Testar permissões tentando acessar configurações do Actions
    const actionsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/permissions`,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
        }
      }
    );

    if (!actionsRes.ok) {
      test.status = 'warning';
      test.details = 'Não foi possível verificar permissões do Actions';
      test.solution = {
        title: 'Configurar permissões do GitHub Actions',
        description: 'Ative "Read and write permissions" nas configurações',
        action: 'Abrir configurações',
        link: `https://github.com/${owner}/${repo}/settings/actions`
      };
    }

    // Testar se consegue criar uma branch (simulação)
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      }
    });

    if (repoRes.ok) {
      const repoData = await repoRes.json();
      if (!repoData.permissions?.push) {
        test.status = 'fail';
        test.details = 'Token sem permissões de escrita no repositório';
        test.solution = {
          title: 'Token sem permissões adequadas',
          description: 'Crie um token com escopo "repo" completo',
          action: 'Renovar token',
          link: 'https://github.com/settings/tokens/new?description=CNX+CMS&scopes=repo'
        };
      }
    }
  } catch (error) {
    test.status = 'warning';
    test.details = 'Erro ao verificar permissões';
    test.technical = error instanceof Error ? error.message : String(error);
  }

  return test;
}

async function testWorkflowHistory(
  token: string,
  owner: string,
  repo: string
): Promise<DiagnosticTest> {
  const test: DiagnosticTest = {
    id: 'workflow_history',
    name: 'Histórico de Execuções',
    description: 'Verificar se o workflow está executando corretamente',
    status: 'pass',
    details: 'Workflow funcionando normalmente'
  };

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/sync-cnx.yml/runs?per_page=3`,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      const runs = data.workflow_runs || [];
      
      if (runs.length === 0) {
        test.status = 'warning';
        test.details = 'Workflow nunca foi executado';
        test.solution = {
          title: 'Executar teste do workflow',
          description: 'Execute manualmente para testar o funcionamento',
          action: 'Testar agora',
          link: `https://github.com/${owner}/${repo}/actions/workflows/sync-cnx.yml`
        };
      } else {
        const lastRun = runs[0];
        if (lastRun.conclusion === 'failure') {
          test.status = 'fail';
          test.details = `Última execução falhou (${lastRun.created_at})`;
          test.solution = {
            title: 'Verificar logs da falha',
            description: 'Analise os logs para identificar o problema',
            action: 'Ver logs',
            link: lastRun.html_url
          };
        } else if (lastRun.conclusion === 'success') {
          test.details = `Última execução bem-sucedida (${lastRun.created_at})`;
        }
      }
    } else {
      test.status = 'warning';
      test.details = 'Não foi possível verificar histórico de execuções';
    }
  } catch (error) {
    test.status = 'warning';
    test.details = 'Erro ao verificar histórico';
    test.technical = error instanceof Error ? error.message : String(error);
  }

  return test;
}

async function testVersionCheck(
  token: string,
  owner: string,
  repo: string
): Promise<DiagnosticTest> {
  const test: DiagnosticTest = {
    id: 'version_check',
    name: 'Verificação de Versões',
    description: 'Comparar versão atual com template original',
    status: 'pass',
    details: 'Site está na versão mais recente'
  };

  try {
    // Buscar versão do template original
    const templateVersionRes = await fetch('https://raw.githubusercontent.com/8linksapp-maker/cnx/main/VERSION');
    const templateVersion = templateVersionRes.ok ? (await templateVersionRes.text()).trim() : null;

    // Buscar versão do repositório atual
    const currentVersionRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/VERSION`);
    const currentVersion = currentVersionRes.ok ? (await currentVersionRes.text()).trim() : null;

    if (!templateVersion || !currentVersion) {
      test.status = 'warning';
      test.details = 'Não foi possível verificar versões';
      test.technical = `Template: ${templateVersion || 'não encontrado'}, Atual: ${currentVersion || 'não encontrado'}`;
    } else if (templateVersion !== currentVersion) {
      test.status = 'warning';
      test.details = `Atualização disponível: v${currentVersion} → v${templateVersion}`;
      test.solution = {
        title: 'Atualizar para versão mais recente',
        description: 'Execute uma atualização para obter as melhorias',
        action: 'Atualizar agora',
        link: '/admin/configuracoes/atualizacoes'
      };
    } else {
      test.details = `Site está na versão mais recente (v${currentVersion})`;
    }
  } catch (error) {
    test.status = 'warning';
    test.details = 'Erro ao verificar versões';
    test.technical = error instanceof Error ? error.message : String(error);
  }

  return test;
}

function calculateSummary(tests: DiagnosticTest[]) {
  const total = tests.length;
  const passed = tests.filter(t => t.status === 'pass').length;
  const failed = tests.filter(t => t.status === 'fail').length;
  const warnings = tests.filter(t => t.status === 'warning').length;
  
  let overall: 'healthy' | 'issues' | 'critical';
  if (failed > 0) overall = 'critical';
  else if (warnings > 0) overall = 'issues';
  else overall = 'healthy';
  
  return { total, passed, failed, warnings, overall };
}

function generateQuickFixes(tests: DiagnosticTest[], owner: string, repo: string): string[] {
  const fixes: string[] = [];
  
  const failedTests = tests.filter(t => t.status === 'fail');
  
  if (failedTests.some(t => t.id === 'env_vars')) {
    fixes.push('Configure as variáveis de ambiente na Vercel');
  }
  
  if (failedTests.some(t => t.id === 'github_connection')) {
    fixes.push('Renove o token do GitHub com permissões adequadas');
  }
  
  if (failedTests.some(t => t.id === 'workflow_exists')) {
    fixes.push('Crie o arquivo de workflow manualmente ou pelo painel');
  }
  
  if (failedTests.some(t => t.id === 'repo_permissions')) {
    fixes.push('Ative "Read and write permissions" nas configurações do Actions');
  }
  
  if (tests.some(t => t.id === 'workflow_history' && t.status === 'fail')) {
    fixes.push('Verifique os logs da última execução que falhou');
  }
  
  return fixes;
}