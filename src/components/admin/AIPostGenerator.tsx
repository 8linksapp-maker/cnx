/**
 * AIPostGenerator.tsx
 * 
 * Componente React para geração de posts com IA.
 * Permite criar posts informacionais ou comerciais usando IA.
 * 
 * Funcionalidades:
 * - Seleção de tipo de post (informacional/comercial)
 * - Preenchimento de título, slug e outlines (H1, H2, H3)
 * - Seleção de autor e categoria
 * - Geração automática de conteúdo baseado nas outlines
 * - Publicação automática do post
 */

import { useState, useEffect } from 'react';
import { useToast, ToastList } from './Toast';

interface Author {
    slug: string;
    name: string;
}

interface Category {
    slug: string;
    name: string;
}

interface Outline {
    level: 'h1' | 'h2' | 'h3';
    text: string;
}

interface Props {
    authors: Author[];
    categories: Category[];
}

export default function AIPostGenerator({ authors, categories }: Props) {
    const { toasts, showToast, removeToast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [postType, setPostType] = useState<'informational' | 'commercial'>('informational');
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [outlines, setOutlines] = useState<Outline[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Gerar slug automaticamente do título
    useEffect(() => {
        if (title && !slug) {
            const generatedSlug = title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setSlug(generatedSlug);
        }
    }, [title, slug]);

    if (!isMounted) {
        return (
            <div className="space-y-6" style={{ minHeight: '400px' }}>
                <div className="p-8 text-center">
                    <p className="text-[#a3a3a3]">Carregando gerador de posts...</p>
                </div>
            </div>
        );
    }

    const addOutline = (level: 'h1' | 'h2' | 'h3') => {
        setOutlines([...outlines, { level, text: '' }]);
    };

    const updateOutline = (index: number, text: string) => {
        const newOutlines = [...outlines];
        newOutlines[index].text = text;
        setOutlines(newOutlines);
    };

    const removeOutline = (index: number) => {
        setOutlines(outlines.filter((_, i) => i !== index));
    };

    const moveOutline = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === outlines.length - 1) return;

        const newOutlines = [...outlines];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newOutlines[index], newOutlines[targetIndex]] = [newOutlines[targetIndex], newOutlines[index]];
        setOutlines(newOutlines);
    };

    const handleGenerate = async () => {
        // Validações
        if (!title || !slug) {
            setError('❌ Título e slug são obrigatórios');
            return;
        }

        if (!author) {
            setError('❌ Selecione um autor');
            return;
        }

        if (!category) {
            setError('❌ Selecione uma categoria');
            return;
        }

        if (outlines.length === 0 || outlines.some(o => !o.text.trim())) {
            setError('❌ Adicione pelo menos uma outline preenchida');
            return;
        }

        setError('');
        setIsGenerating(true);
        setProgress('🚀 Iniciando geração do post...');

        try {
            const response = await fetch('/api/admin/posts/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postType,
                    title,
                    slug,
                    author,
                    category,
                    outlines,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setProgress('✅ Post gerado e publicado com sucesso!');
                showToast('success', `Post "${title}" publicado!`, 'Redirecionando para a lista de posts...');
                setTimeout(() => {
                    window.location.href = '/admin/posts';
                }, 2000);
            } else {
                setError(`❌ Erro: ${result.error || 'Erro desconhecido'}`);
                setProgress('');
            }
        } catch (error: any) {
            console.error('❌ Erro ao gerar post:', error);
            setError(`❌ Erro ao gerar post: ${error.message}`);
            setProgress('');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#e5e5e5] mb-2">
                        Posts com IA
                    </h1>
                    <p className="text-[#a3a3a3]">
                        Gere posts completos automaticamente usando Inteligência Artificial
                    </p>
                </div>
                <a 
                    href="/admin/posts"
                    className="admin-btn admin-btn-secondary text-sm"
                >
                    ← Voltar para Posts
                </a>
            </div>

            {/* Tipo de Post */}
            <div className="admin-card p-6">
                <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                    Tipo de Post
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setPostType('informational')}
                        className={`p-6 rounded-xl border-2 transition-all ${
                            postType === 'informational'
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                    >
                        <div className="text-3xl mb-2">📚</div>
                        <div className="font-bold text-[#e5e5e5] mb-1">Post Informacional</div>
                        <div className="text-sm text-[#a3a3a3]">
                            Artigos educativos e informativos
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPostType('commercial')}
                        className={`p-6 rounded-xl border-2 transition-all ${
                            postType === 'commercial'
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20 opacity-50 cursor-not-allowed'
                        }`}
                        disabled
                    >
                        <div className="text-3xl mb-2">💼</div>
                        <div className="font-bold text-[#e5e5e5] mb-1">Post Comercial</div>
                        <div className="text-sm text-[#a3a3a3]">
                            Posts focados em vendas (em breve)
                        </div>
                    </button>
                </div>
            </div>

            {/* Informações Básicas */}
            <div className="admin-card p-6">
                <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                    Informações Básicas
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                            Título do Post *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="admin-input"
                            placeholder="Ex: Como Cuidar da Sua Saúde Mental"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                            Slug *
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="admin-input"
                            placeholder="como-cuidar-da-sua-saude-mental"
                        />
                        <p className="text-xs text-[#737373] mt-1">
                            O slug será gerado automaticamente a partir do título, mas você pode editá-lo.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Autor *
                            </label>
                            <select
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="admin-input"
                            >
                                <option value="">Selecione um autor</option>
                                {authors.map((a) => (
                                    <option key={a.slug} value={a.slug}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Categoria *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="admin-input"
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map((c) => (
                                    <option key={c.slug} value={c.slug}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Outlines */}
            <div className="admin-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-bold text-[#e5e5e5]">
                        Estrutura do Post (Outlines)
                    </h3>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => addOutline('h1')}
                            className="admin-btn admin-btn-secondary text-sm"
                        >
                            + H1
                        </button>
                        <button
                            type="button"
                            onClick={() => addOutline('h2')}
                            className="admin-btn admin-btn-secondary text-sm"
                        >
                            + H2
                        </button>
                        <button
                            type="button"
                            onClick={() => addOutline('h3')}
                            className="admin-btn admin-btn-secondary text-sm"
                        >
                            + H3
                        </button>
                    </div>
                </div>
                <p className="text-sm text-[#a3a3a3] mb-4">
                    Defina a estrutura do post usando títulos (H1, H2, H3). A IA irá gerar o conteúdo completo para cada seção.
                </p>
                {outlines.length > 0 ? (
                    <div className="space-y-3">
                        {outlines.map((outline, index) => (
                            <div key={index} className="admin-card p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                                        outline.level === 'h1' ? 'bg-primary/20 text-primary' :
                                        outline.level === 'h2' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-green-500/20 text-green-400'
                                    }`}>
                                        {outline.level.toUpperCase()}
                                    </span>
                                    <div className="flex gap-1 flex-1">
                                        <button
                                            type="button"
                                            onClick={() => moveOutline(index, 'up')}
                                            disabled={index === 0}
                                            className="text-xs text-[#737373] hover:text-[#e5e5e5] disabled:opacity-30"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveOutline(index, 'down')}
                                            disabled={index === outlines.length - 1}
                                            className="text-xs text-[#737373] hover:text-[#e5e5e5] disabled:opacity-30"
                                        >
                                            ↓
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeOutline(index)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Remover
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={outline.text}
                                    onChange={(e) => updateOutline(index, e.target.value)}
                                    className="admin-input"
                                    placeholder={`Título do ${outline.level.toUpperCase()}...`}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
                        <p className="text-[#737373] mb-2">Nenhuma outline adicionada</p>
                        <p className="text-xs text-[#737373]">Clique nos botões acima para adicionar títulos</p>
                    </div>
                )}
            </div>

            {/* Erro */}
            {error && (
                <div className="admin-card p-4 bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Progresso */}
            {progress && (
                <div className="admin-card p-4 bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-400">{progress}</p>
                </div>
            )}

            {/* Botão Gerar */}
            <div className="flex items-center justify-end gap-4">
                <a 
                    href="/admin/posts"
                    className="admin-btn admin-btn-ghost"
                >
                    Cancelar
                </a>
                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !title || !slug || !author || !category || outlines.length === 0}
                    className="admin-btn admin-btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            Gerando...
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            Gerar e Publicar Post
                        </>
                    )}
                </button>
            </div>
        </div>
        <ToastList toasts={toasts} onRemove={removeToast} />
        </>
    );
}
