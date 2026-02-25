import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * api/admin/upload.ts
 * 
 * API route para upload de imagens.
 * Organiza imagens por tipo em subpastas: posts, authors, themes, general
 */

const ALLOWED_TYPES = ['posts', 'authors', 'themes', 'general'] as const;
type MediaType = typeof ALLOWED_TYPES[number];

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = (formData.get('type') as string) || 'general';
        
        if (!file) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Nenhum arquivo enviado',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Validar tipo de mídia
        if (!ALLOWED_TYPES.includes(type as MediaType)) {
            return new Response(JSON.stringify({
                success: false,
                error: `Tipo inválido. Tipos permitidos: ${ALLOWED_TYPES.join(', ')}`,
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Apenas imagens são permitidas',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Gerar nome único
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
        const filename = `${timestamp}-${originalName}`;
        
        // Caminho de destino baseado no tipo
        const uploadDir = path.resolve(`./public/images/${type}`);
        const filePath = path.join(uploadDir, filename);
        
        // Criar diretório se não existir
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Converter File para Buffer e salvar
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);
        
        // URL pública
        const publicUrl = `/images/${type}/${filename}`;
        
        return new Response(JSON.stringify({
            success: true,
            url: publicUrl,
            filename,
            type,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('❌ Erro ao fazer upload:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message,
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
