/**
 * api/admin/version/update.ts
 *
 * Endpoint que aciona o workflow de atualização do template CNX
 * diretamente pelo painel admin, sem precisar acessar o GitHub.
 *
 * POST /api/admin/version/update
 *
 * Requer: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO nas env vars.
 *
 * Resposta:
 * { success: true, message: "..." }
 * { success: false, error: "..." }
 */

import type { APIRoute } from 'astro';
import { verifySession, SESSION_COOKIE } from '../../../../utils/auth-utils';

const WORKFLOW_FILE = 'sync-cnx.yml';

export const POST: APIRoute = async ({ cookies }) => {
    // ─── Autenticação ──────────────────────────────────────────────────────────
    const token = cookies.get(SESSION_COOKIE)?.value;
    const session = token ? verifySession(token) : null;

    if (!session || session.adminRole !== 'admin') {
        return new Response(JSON.stringify({ success: false, error: 'Não autorizado.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // ─── Variáveis de ambiente ─────────────────────────────────────────────────
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo  = process.env.GITHUB_REPO;

    if (!githubToken || !githubOwner || !githubRepo) {
        return new Response(JSON.stringify({
            success: false,
            error: 'Configure GITHUB_TOKEN, GITHUB_OWNER e GITHUB_REPO nas variáveis de ambiente da Vercel.',
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // ─── Disparar o workflow via GitHub API ────────────────────────────────────
    try {
        const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/workflows/${WORKFLOW_FILE}/dispatches`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ref: 'main' }),
        });

        // 204 = disparado com sucesso (GitHub não retorna body)
        if (res.status === 204) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Atualização iniciada! O site será reconstruído automaticamente em ~2 minutos.',
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 422 = workflow não encontrado ou branch inválida
        if (res.status === 422) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Workflow não encontrado. Verifique se o arquivo sync-cnx.yml existe no seu repositório.',
            }), {
                status: 422,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const body = await res.text();
        console.error(`❌ GitHub API respondeu ${res.status}:`, body);

        return new Response(JSON.stringify({
            success: false,
            error: `Erro ao acionar o workflow (status ${res.status}). Verifique se o GITHUB_TOKEN tem permissão "repo".`,
        }), {
            status: res.status,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('❌ Erro ao acionar workflow de atualização:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Erro de rede ao contatar o GitHub. Tente novamente.',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
