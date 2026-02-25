/**
 * api/admin/posts/ai/generate.ts
 * 
 * API route para gerar posts com IA.
 * Recebe outlines e gera conteúdo completo para cada seção.
 */

import type { APIRoute } from 'astro';
import { writePost, slugExists } from '../../../../../utils/post-utils';
import type { PostData } from '../../../../../utils/post-utils';

interface Outline {
    level: 'h1' | 'h2' | 'h3';
    text: string;
}

/**
 * Gera conteúdo para uma outline usando IA
 * Suporta OpenAI (via variável de ambiente OPENAI_API_KEY)
 * Se não houver API key, usa conteúdo placeholder melhorado
 */
async function generateContentForOutline(
    title: string,
    outline: Outline,
    postType: 'informational' | 'commercial',
    context: string,
    allOutlines: Outline[]
): Promise<string> {
    const levelTag = outline.level.toUpperCase();
    const heading = `#${levelTag === 'H1' ? '' : levelTag === 'H2' ? '#' : '##'} ${outline.text}\n\n`;
    
    // Tentar usar OpenAI se disponível
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (openaiApiKey) {
        try {
            const prompt = postType === 'informational'
                ? `Você é um redator especializado em conteúdo informacional sobre saúde e bem-estar.

Título do artigo: ${title}

Estrutura do artigo:
${allOutlines.map((o, i) => `${i + 1}. ${o.level.toUpperCase()}: ${o.text}`).join('\n')}

Escreva um conteúdo completo, detalhado e informativo para a seção "${outline.text}" (${outline.level.toUpperCase()}).

Requisitos:
- Conteúdo baseado em evidências científicas
- Linguagem clara e acessível
- Mínimo de 300 palavras
- Formato Markdown
- Use parágrafos, listas e formatação quando apropriado
- Não inclua o título da seção (já será adicionado)
- Seja objetivo e educativo

Conteúdo:`
                : `Você é um redator especializado em conteúdo comercial focado em conversão.

Título do artigo: ${title}

Estrutura do artigo:
${allOutlines.map((o, i) => `${i + 1}. ${o.level.toUpperCase()}: ${o.text}`).join('\n')}

Escreva um conteúdo comercial persuasivo para a seção "${outline.text}" (${outline.level.toUpperCase()}).

Requisitos:
- Foco em benefícios e soluções
- Linguagem persuasiva mas não agressiva
- Mínimo de 300 palavras
- Formato Markdown
- Use parágrafos, listas e formatação quando apropriado
- Não inclua o título da seção (já será adicionado)
- Inclua call-to-action natural

Conteúdo:`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini', // ou 'gpt-4' para melhor qualidade
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um redator profissional especializado em criar conteúdo de alta qualidade para blogs.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const generatedContent = data.choices[0]?.message?.content || '';
                if (generatedContent.trim()) {
                    return heading + generatedContent.trim() + '\n\n';
                }
            } else {
                console.warn('⚠️ Erro na API OpenAI, usando conteúdo placeholder:', await response.text());
            }
        } catch (error) {
            console.warn('⚠️ Erro ao chamar OpenAI, usando conteúdo placeholder:', error);
        }
    }
    
    // Fallback: conteúdo placeholder melhorado
    let content = '';
    
    if (postType === 'informational') {
        content = `Este é um conteúdo informacional detalhado sobre "${outline.text}". 

## Introdução

Esta seção aborda aspectos importantes relacionados a ${outline.text}, fornecendo informações baseadas em evidências científicas e práticas recomendadas.

## Desenvolvimento

**Principais aspectos a considerar:**

1. **Fundamentos**: Informações essenciais sobre ${outline.text}
2. **Aplicação prática**: Como aplicar este conhecimento no dia a dia
3. **Benefícios**: Vantagens e benefícios de seguir as recomendações

## Conclusão

Este conteúdo fornece uma base sólida para compreender melhor ${outline.text}. É importante sempre consultar profissionais qualificados para orientações específicas.

> **Nota**: Este conteúdo foi gerado automaticamente e deve ser revisado e editado antes da publicação final.`;
    } else {
        content = `Este é um conteúdo comercial sobre "${outline.text}".

## Introdução

Esta seção apresenta soluções e benefícios relacionados a ${outline.text}, focando em resultados práticos e mensuráveis.

## Benefícios Principais

**Por que isso é importante:**

- ✅ Solução direta para desafios relacionados a ${outline.text}
- ✅ Resultados comprovados e mensuráveis
- ✅ Vantagens competitivas no mercado

## Como Funciona

A abordagem apresentada aqui oferece uma maneira eficiente e comprovada de lidar com questões relacionadas a ${outline.text}.

## Próximos Passos

Se você está interessado em saber mais sobre ${outline.text}, entre em contato conosco para uma consulta personalizada.

> **Nota**: Este conteúdo foi gerado automaticamente e deve ser revisado e editado antes da publicação final.`;
    }
    
    return heading + content + '\n\n';
}

/**
 * Gera o conteúdo completo do post baseado nas outlines
 */
async function generatePostContent(
    title: string,
    outlines: Outline[],
    postType: 'informational' | 'commercial'
): Promise<string> {
    let content = '';
    let context = `Título do post: ${title}\nTipo: ${postType}\n\n`;
    
    // Adicionar introdução baseada no título
    const intro = postType === 'informational'
        ? `# Introdução\n\nNeste artigo, vamos explorar em detalhes: ${title}. Este conteúdo foi desenvolvido para fornecer informações precisas e úteis sobre o tema.\n\n`
        : `# Introdução\n\nBem-vindo ao nosso guia completo sobre: ${title}. Neste artigo, você descobrirá soluções práticas e eficazes para suas necessidades.\n\n`;
    
    content += intro;
    
    // Gerar conteúdo para cada outline
    for (let i = 0; i < outlines.length; i++) {
        const outline = outlines[i];
        console.log(`📝 Gerando conteúdo para seção ${i + 1}/${outlines.length}: ${outline.text}`);
        const sectionContent = await generateContentForOutline(title, outline, postType, context, outlines);
        content += sectionContent;
        
        // Atualizar contexto para próximas seções
        context += `Seção ${i + 1}: ${outline.level} - ${outline.text}\n`;
        
        // Pequeno delay para evitar rate limiting (se usar API externa)
        if (i < outlines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    // Adicionar conclusão
    const conclusion = postType === 'informational'
        ? `\n## Conclusão\n\nEsperamos que este artigo sobre ${title} tenha sido útil e informativo. Continue explorando nosso blog para mais conteúdo de qualidade.\n\n`
        : `\n## Conclusão\n\nSe você está interessado em saber mais sobre ${title}, não hesite em entrar em contato. Estamos aqui para ajudar você a alcançar seus objetivos.\n\n`;
    
    content += conclusion;
    
    return content.trim();
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { postType, title, slug, author, category, outlines } = body;

        // Validações
        if (!title || !slug) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Título e slug são obrigatórios',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!author || !category) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Autor e categoria são obrigatórios',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!outlines || outlines.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Adicione pelo menos uma outline',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Verificar se slug já existe
        const exists = await slugExists(slug);
        if (exists) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Um post com este slug já existe',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Gerar conteúdo
        console.log('🚀 Iniciando geração de conteúdo para:', title);
        console.log(`📊 Tipo: ${postType}, Outlines: ${outlines.length}`);
        const content = await generatePostContent(title, outlines, postType);
        console.log(`✅ Conteúdo gerado com sucesso (${content.length} caracteres)`);

        // Criar meta description
        const metaDescription = title.length > 160 
            ? title.substring(0, 157) + '...'
            : title;

        // Preparar dados do post
        const postData: PostData = {
            title,
            slug,
            author,
            category,
            publishedDate: new Date().toISOString().split('T')[0], // Publicar automaticamente
            metaDescription,
        };

        // Salvar post
        const success = await writePost(slug, postData, content);

        if (!success) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Erro ao salvar post',
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Post gerado e publicado com sucesso',
            slug,
            title,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('❌ Erro ao gerar post com IA:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Erro desconhecido ao gerar post',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
