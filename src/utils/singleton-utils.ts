/**
 * singleton-utils.ts
 * 
 * Utilitários para manipulação de singletons em formato YAML.
 * Agora organizados por tema: src/content/singletons/{themeId}/{name}.yaml
 */

import yaml from 'js-yaml';
import path from 'node:path';
import fs from 'node:fs/promises';
import { getEntry } from 'astro:content';

const SINGLETONS_BASE_DIR = path.resolve('./src/content/singletons');

/**
 * Obtém o tema ativo
 */
async function getActiveThemeId(): Promise<string> {
    try {
        const settings = await getEntry('siteSettings', 'settings');
        return settings?.data?.activeTheme || 'classic';
    } catch (error) {
        console.error('❌ Erro ao obter tema ativo:', error);
        return 'classic';
    }
}

/**
 * Lê um singleton específico do tema ativo
 */
export async function readSingleton(name: string, themeId?: string): Promise<any> {
    try {
        const activeTheme = themeId || await getActiveThemeId();
        const themeDir = path.join(SINGLETONS_BASE_DIR, activeTheme);
        const filePath = path.join(themeDir, `${name}.yaml`);
        
        // Criar diretório se não existir
        await fs.mkdir(themeDir, { recursive: true });
        
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const data = yaml.load(content);
            return data;
        } catch (fileError: any) {
            // Se arquivo não existe, tentar ler do diretório antigo (migração)
            const oldPath = path.join(SINGLETONS_BASE_DIR, `${name}.yaml`);
            try {
                const oldContent = await fs.readFile(oldPath, 'utf-8');
                const oldData = yaml.load(oldContent);
                // Migrar automaticamente
                await writeSingleton(name, oldData, activeTheme);
                return oldData;
            } catch {
                // Arquivo não existe, retornar null
                return null;
            }
        }
    } catch (error) {
        console.error(`❌ Erro ao ler singleton ${name}:`, error);
        return null;
    }
}

/**
 * Escreve um singleton (cria ou atualiza) no tema ativo
 */
export async function writeSingleton(name: string, data: any, themeId?: string): Promise<boolean> {
    try {
        const activeTheme = themeId || await getActiveThemeId();
        const themeDir = path.join(SINGLETONS_BASE_DIR, activeTheme);
        const filePath = path.join(themeDir, `${name}.yaml`);
        
        // Criar diretório se não existir
        await fs.mkdir(themeDir, { recursive: true });
        
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
        console.error(`❌ Erro ao escrever singleton ${name}:`, error);
        return false;
    }
}

/**
 * Lista todos os singletons disponíveis para um tema
 */
export async function listSingletons(themeId?: string): Promise<string[]> {
    try {
        const activeTheme = themeId || await getActiveThemeId();
        const themeDir = path.join(SINGLETONS_BASE_DIR, activeTheme);
        
        // Criar diretório se não existir
        await fs.mkdir(themeDir, { recursive: true });
        
        const files = await fs.readdir(themeDir);
        const yamlFiles = files
            .filter(f => f.endsWith('.yaml') && f !== 'settings.yaml')
            .map(f => f.replace('.yaml', ''));
        
        return yamlFiles;
    } catch (error) {
        console.error('❌ Erro ao listar singletons:', error);
        return [];
    }
}
