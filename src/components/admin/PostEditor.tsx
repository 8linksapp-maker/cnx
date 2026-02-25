/**
 * PostEditor.tsx
 * 
 * Componente React completo para edição de posts.
 * Inclui formulário com todos os campos, editor de Markdown, preview e ações de salvar/publicar.
 * 
 * Props:
 * - post: Dados do post (opcional, se for novo post)
 * - authors: Lista de autores disponíveis
 * - categories: Lista de categorias disponíveis
 * - onSave: Callback quando salvar
 * - onPublish: Callback quando publicar
 */

import { useState, useEffect } from 'react';
import WYSIWYGEditor from './WYSIWYGEditor';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { useToast, ToastList } from './Toast';

interface Author {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

interface PostData {
    title: string;
    slug: string;
    author?: string;
    category?: string;
    publishedDate?: string;
    thumbnail?: string;
    metaDescription?: string;
    metaImage?: string;
    content: string;
}

interface Props {
    post?: PostData;
    authors: Author[];
    categories: Category[];
}

export default function PostEditor({ post, authors, categories }: Props) {
    const { toasts, showToast, removeToast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [author, setAuthor] = useState(post?.author || '');
    const [category, setCategory] = useState(post?.category || '');
    const [publishedDate, setPublishedDate] = useState(post?.publishedDate || new Date().toISOString().split('T')[0]);
    const [thumbnail, setThumbnail] = useState(post?.thumbnail || '');
    const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');
    const [metaImage, setMetaImage] = useState(post?.metaImage || '');
    
    // Converter Markdown para HTML para o editor WYSIWYG
    const getInitialContent = () => {
        if (!post?.content) return '';
        // Se já é HTML, retorna direto
        if (post.content.trim().startsWith('<')) return post.content;
        // Se é Markdown, converte para HTML
        try {
            return marked.parse(post.content) as string;
        } catch {
            return post.content;
        }
    };
    
    const [content, setContent] = useState(getInitialContent());
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    
    // Instância do Turndown para converter HTML para Markdown
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
    });
    
    // Proteção contra problemas de hidratação
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Debug
    useEffect(() => {
        if (isMounted) {
            console.log('✅ PostEditor montado', { 
                hasPost: !!post, 
                authorsCount: authors.length, 
                categoriesCount: categories.length,
                title,
                slug
            });
        }
    }, [isMounted]);

    // Gerar slug automaticamente do título
    useEffect(() => {
        if (!post && title && !slug) {
            try {
                const generatedSlug = title
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                if (generatedSlug) {
                    setSlug(generatedSlug);
                }
            } catch (error) {
                console.error('❌ Erro ao gerar slug:', error);
            }
        }
    }, [title, slug, post]);

    const handleSave = async (isPublish: boolean) => {
        if (!title || !slug) {
            showToast('warning', 'Campos obrigatórios', 'Título e slug são obrigatórios');
            return;
        }

        setIsSaving(true);
        try {
            // Converter HTML do editor WYSIWYG para Markdown
            let markdownContent = content;
            if (content && content.trim().startsWith('<')) {
                try {
                    markdownContent = turndownService.turndown(content);
                } catch (error) {
                    console.error('❌ Erro ao converter HTML para Markdown:', error);
                    // Se falhar, tenta salvar como está
                }
            }
            
            const postData: PostData = {
                title,
                slug,
                author: author || undefined,
                category: category || undefined,
                publishedDate: isPublish ? (publishedDate || new Date().toISOString().split('T')[0]) : undefined,
                thumbnail: thumbnail || undefined,
                metaDescription: metaDescription || undefined,
                metaImage: metaImage || undefined,
                content: markdownContent,
            };
            
            // Fazer requisição direta
            const url = post ? `/api/admin/posts/${post.slug}` : '/api/admin/posts';
            const method = post ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...postData,
                    newSlug: postData.slug !== post?.slug ? postData.slug : undefined,
                }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('success', isPublish ? 'Post publicado!' : 'Rascunho salvo!');
                setTimeout(() => { window.location.href = `/admin/posts/${postData.slug}`; }, 1000);
            } else {
                showToast('error', 'Erro ao salvar', result.error);
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar post');
        } finally {
            setIsSaving(false);
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'posts');

        try {
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setThumbnail(data.url);
            } else {
                showToast('error', 'Erro no upload', 'Não foi possível enviar a thumbnail');
            }
        } catch (error) {
            console.error('❌ Erro no upload:', error);
            showToast('error', 'Erro no upload', 'Não foi possível enviar a thumbnail');
        }
    };

    const handleMetaImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'posts');

        try {
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setMetaImage(data.url);
            } else {
                showToast('error', 'Erro no upload', 'Não foi possível enviar a imagem');
            }
        } catch (error) {
            console.error('❌ Erro no upload:', error);
            showToast('error', 'Erro no upload', 'Não foi possível enviar a imagem');
        }
    };

    // Proteção contra problemas de hidratação - só renderizar após montar
    if (!isMounted) {
        return (
            <div className="space-y-6 p-8">
                <div className="text-center text-[#a3a3a3]">
                    <p>Carregando editor...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-[#e5e5e5] mb-1">
                        {post ? 'Editar Post' : 'Novo Post'}
                    </h2>
                    <p className="text-sm text-[#a3a3a3]">
                        {post ? `Editando: ${post.title}` : 'Crie um novo post para seu blog'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="admin-btn admin-btn-secondary"
                    >
                        {showPreview ? '✏️ Editar' : '👁️ Preview'}
                    </button>
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        className="admin-btn admin-btn-secondary disabled:opacity-50"
                    >
                        {isSaving ? 'Salvando...' : '💾 Rascunho'}
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={isSaving}
                        className="admin-btn admin-btn-primary disabled:opacity-50"
                    >
                        {isSaving ? 'Publicando...' : '🚀 Publicar'}
                    </button>
                </div>
            </div>

            {showPreview ? (
                /* Preview */
                <div className="admin-card p-8">
                    <article>
                        <h1 className="text-3xl font-heading font-bold text-[#e5e5e5] mb-4">{title || 'Sem título'}</h1>
                        {metaDescription && (
                            <p className="text-[#a3a3a3] text-lg mb-6">{metaDescription}</p>
                        )}
                        <div 
                            className="prose prose-invert max-w-none text-[#e5e5e5]"
                            dangerouslySetInnerHTML={{ __html: content || '<p class="text-[#737373] italic">Nenhum conteúdo ainda...</p>' }}
                        />
                    </article>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="admin-input"
                                placeholder="Digite o título do post"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Slug (URL) *
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="admin-input font-mono text-sm"
                                placeholder="url-do-post"
                            />
                        </div>

                        {/* Content Editor */}
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Conteúdo
                            </label>
                            <div className="h-[500px] rounded-lg overflow-hidden">
                                <WYSIWYGEditor 
                                    value={content} 
                                    onChange={setContent}
                                    placeholder="Comece a escrever seu post aqui..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Thumbnail - Destaque */}
                        <div className="admin-card p-6 border-2 border-primary/30 bg-primary/5">
                            <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4 flex items-center gap-2">
                                <span>🖼️</span>
                                <span>Thumbnail (Imagem de Destaque)</span>
                            </h3>
                            <div className="space-y-4">
                                {thumbnail && (
                                    <div className="relative">
                                        <img
                                            src={thumbnail}
                                            alt="Thumbnail preview"
                                            className="w-full rounded-lg mb-2 border-2 border-primary/50"
                                        />
                                        <button
                                            onClick={() => setThumbnail('')}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors"
                                            title="Remover thumbnail"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="hidden"
                                        id="thumbnail-upload"
                                    />
                                    <span className="admin-btn admin-btn-primary w-full text-center cursor-pointer block">
                                        {thumbnail ? '🔄 Trocar Thumbnail' : '📷 Adicionar Thumbnail'}
                                    </span>
                                </label>
                                <p className="text-xs text-[#737373]">
                                    Esta imagem aparece nos cards do blog e na página do post
                                </p>
                            </div>
                        </div>

                        {/* Publish Settings */}
                        <div className="admin-card p-6">
                            <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                                Publicação
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#a3a3a3] mb-2">
                                        Data de Publicação
                                    </label>
                                    <input
                                        type="date"
                                        value={publishedDate}
                                        onChange={(e) => setPublishedDate(e.target.value)}
                                        className="admin-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#a3a3a3] mb-2">
                                        Autor
                                    </label>
                                    <select
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="admin-input"
                                    >
                                        <option value="">Selecione um autor</option>
                                        {authors.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#a3a3a3] mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="admin-input"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SEO Settings */}
                        <div className="admin-card p-6">
                            <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                                SEO
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#a3a3a3] mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows={3}
                                        className="admin-input resize-none"
                                        placeholder="Descrição para SEO (150-160 caracteres)"
                                    />
                                    <p className="text-xs text-[#737373] mt-1">
                                        {metaDescription.length} caracteres
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#a3a3a3] mb-2">
                                        Imagem Social (Open Graph)
                                    </label>
                                    {metaImage && (
                                        <img
                                            src={metaImage}
                                            alt="Preview"
                                            className="w-full rounded-lg mb-2 border border-[rgba(255,255,255,0.08)]"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMetaImageUpload}
                                        className="admin-input text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3b82f6] file:text-white hover:file:bg-[#2563eb] cursor-pointer"
                                    />
                                    {metaImage && (
                                        <input
                                            type="text"
                                            value={metaImage}
                                            onChange={(e) => setMetaImage(e.target.value)}
                                            className="admin-input text-xs font-mono mt-2"
                                            placeholder="URL da imagem"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <ToastList toasts={toasts} onRemove={removeToast} />
        </>
    );
}
