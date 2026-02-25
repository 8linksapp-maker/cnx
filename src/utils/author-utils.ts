/**
 * author-utils.ts
 * 
 * Utilitários para manipulação de autores em formato YAML.
 */

import yaml from 'js-yaml';
import path from 'node:path';
import fs from 'node:fs/promises';

export interface AuthorData {
    name: string;
    slug: string;
    role: string;
    avatar?: string;
    bio: string;
    // Acesso ao painel admin
    email?: string;
    adminRole?: 'admin' | 'editor' | 'none';
    adminPasswordHash?: string;
}

export interface AuthorFile {
    data: AuthorData;
    filename: string;
}

const AUTHORS_DIR = path.resolve('./src/content/authors');

export function slugToFilename(slug: string): string {
    return `${slug}.yaml`;
}

export function filenameToSlug(filename: string): string {
    return filename.replace(/\.yaml$/, '');
}

/**
 * Lista todos os autores
 */
export async function listAuthors(): Promise<AuthorFile[]> {
    try {
        const files = await fs.readdir(AUTHORS_DIR);
        const yamlFiles = files.filter(f => f.endsWith('.yaml'));
        
        const authors = await Promise.all(
            yamlFiles.map(async (filename) => {
                const filePath = path.join(AUTHORS_DIR, filename);
                const content = await fs.readFile(filePath, 'utf-8');
                const data = yaml.load(content) as AuthorData;
                return { data, filename };
            })
        );
        
        return authors.sort((a, b) => a.data.name.localeCompare(b.data.name));
    } catch (error) {
        console.error('❌ Erro ao listar autores:', error);
        return [];
    }
}

/**
 * Lê um autor específico
 */
export async function readAuthor(slug: string): Promise<AuthorFile | null> {
    try {
        const filename = slugToFilename(slug);
        const filePath = path.join(AUTHORS_DIR, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = yaml.load(content) as AuthorData;
        return { data, filename };
    } catch (error) {
        console.error(`❌ Erro ao ler autor ${slug}:`, error);
        return null;
    }
}

/**
 * Escreve um autor (cria ou atualiza)
 */
export async function writeAuthor(slug: string, data: AuthorData): Promise<boolean> {
    try {
        const filename = slugToFilename(slug);
        const filePath = path.join(AUTHORS_DIR, filename);
        
        // Limpar valores undefined
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== undefined)
        );
        
        const yamlContent = yaml.dump(cleanedData, {
            lineWidth: -1,
            noRefs: true,
            quotingType: '"',
        });
        
        await fs.writeFile(filePath, yamlContent, 'utf-8');
        return true;
    } catch (error) {
        console.error(`❌ Erro ao escrever autor ${slug}:`, error);
        return false;
    }
}

/**
 * Deleta um autor
 */
export async function deleteAuthor(slug: string): Promise<boolean> {
    try {
        const filename = slugToFilename(slug);
        const filePath = path.join(AUTHORS_DIR, filename);
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        console.error(`❌ Erro ao deletar autor ${slug}:`, error);
        return false;
    }
}

/**
 * Verifica se um slug já existe
 */
export async function authorSlugExists(slug: string, excludeSlug?: string): Promise<boolean> {
    try {
        const authors = await listAuthors();
        return authors.some(a => a.data.slug === slug && a.data.slug !== excludeSlug);
    } catch {
        return false;
    }
}
