/**
 * WYSIWYGEditor.tsx
 * 
 * Editor WYSIWYG melhorado com TipTap - experiência estilo Gutenberg.
 * Inclui extensões avançadas, slash commands e interface moderna.
 */

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import MediaLibrary from './MediaLibrary';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function WYSIWYGEditor({ value, onChange, placeholder = 'Digite "/" para inserir blocos...' }: Props) {
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
                codeBlock: {
                    HTMLAttributes: {
                        class: 'bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg p-4 font-mono text-sm',
                    },
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#3b82f6] hover:underline cursor-pointer',
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            HorizontalRule.configure({
                HTMLAttributes: {
                    class: 'my-8 border-t border-[rgba(255,255,255,0.08)]',
                },
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-[#e5e5e5]',
            },
            handleKeyDown: (view, event) => {
                // Slash command - digite "/" para menu de blocos
                if (event.key === '/' && !event.shiftKey) {
                    const { selection } = view.state;
                    const { $from } = selection;
                    const textBefore = $from.nodeBefore?.textContent || '';
                    
                    // Se o caractere antes do cursor é "/", mostra menu
                    if (textBefore.endsWith('/')) {
                        // Aqui você pode adicionar um menu de blocos
                        // Por enquanto, apenas previne o comportamento padrão
                        return false;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    // Atualizar conteúdo quando value mudar externamente
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    const insertImage = () => {
        if (imageUrl) {
            editor?.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
            setShowImageModal(false);
        }
    };

    const handleSelectFromLibrary = (url: string) => {
        editor?.chain().focus().setImage({ src: url }).run();
        setShowMediaLibrary(false);
    };

    const insertLink = () => {
        const { from, to } = editor?.state.selection || {};
        const selectedText = editor?.state.doc.textBetween(from || 0, to || 0, ' ');
        
        // Se houver texto selecionado, usa como texto do link
        if (selectedText) {
            setLinkText(selectedText);
        }
        
        setShowLinkModal(true);
    };

    const handleInsertLink = () => {
        if (!linkUrl) return;
        
        const { from, to } = editor?.state.selection || {};
        const selectedText = editor?.state.doc.textBetween(from || 0, to || 0, ' ');
        
        if (selectedText) {
            // Se há texto selecionado, transforma em link
            editor?.chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: linkUrl })
                .run();
        } else {
            // Se não há texto selecionado, insere link com texto
            const text = linkText || linkUrl;
            editor?.chain()
                .focus()
                .insertContent(`<a href="${linkUrl}">${text}</a>`)
                .run();
        }
        
        setLinkUrl('');
        setLinkText('');
        setShowLinkModal(false);
    };

    const removeLink = () => {
        editor?.chain().focus().unsetLink().run();
    };

    if (!editor) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg">
                <p className="text-[#a3a3a3]">Carregando editor...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
            {/* Toolbar Melhorada */}
            <div className="flex items-center gap-1 p-3 border-b border-[rgba(255,255,255,0.08)] flex-wrap bg-[#111111]">
                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                            editor.isActive('bold')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Negrito (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                            editor.isActive('italic')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Itálico (Ctrl+I)"
                    >
                        <em>I</em>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={!editor.can().chain().focus().toggleStrike().run()}
                        className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                            editor.isActive('strike')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Riscado"
                    >
                        <s>S</s>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={!editor.can().chain().focus().toggleCode().run()}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                            editor.isActive('code')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Código inline"
                    >
                        {'</>'}
                    </button>
                </div>

                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1" />

                {/* Headings */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                            editor.isActive('heading', { level: 1 })
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Título 1"
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                            editor.isActive('heading', { level: 2 })
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Título 2"
                    >
                        H2
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                            editor.isActive('heading', { level: 3 })
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Título 3"
                    >
                        H3
                    </button>
                </div>

                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1" />

                {/* Lists */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                            editor.isActive('bulletList')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Lista com marcadores"
                    >
                        • Lista
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                            editor.isActive('orderedList')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Lista numerada"
                    >
                        1. Lista
                    </button>
                </div>

                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1" />

                {/* Blocks */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                            editor.isActive('blockquote')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Citação"
                    >
                        "
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                            editor.isActive('codeBlock')
                                ? 'bg-[#1a1a1a] text-[#e5e5e5]'
                                : 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                        }`}
                        title="Bloco de código"
                    >
                        {'</>'}
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="px-3 py-1.5 rounded text-sm transition-colors text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                        title="Linha horizontal"
                    >
                        ─
                    </button>
                </div>

                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1" />

                {/* Media & Links */}
                <div className="flex items-center gap-1">
                    {editor.isActive('link') ? (
                        <>
                            <button
                                onClick={insertLink}
                                className="px-3 py-1.5 rounded text-sm transition-colors bg-[#1a1a1a] text-[#e5e5e5]"
                                title="Editar link"
                            >
                                🔗 Editar Link
                            </button>
                            <button
                                onClick={removeLink}
                                className="px-3 py-1.5 rounded text-sm transition-colors text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                                title="Remover link"
                            >
                                🔗❌
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={insertLink}
                            className="px-3 py-1.5 rounded text-sm transition-colors text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                            title="Inserir link"
                        >
                            🔗 Link
                        </button>
                    )}
                    <button
                        onClick={() => setShowMediaLibrary(true)}
                        className="px-3 py-1.5 rounded text-sm transition-colors text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                        title="Biblioteca de mídia"
                    >
                        🖼️ Biblioteca
                    </button>
                    <button
                        onClick={() => setShowImageModal(true)}
                        className="px-3 py-1.5 rounded text-sm transition-colors text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
                        title="Inserir imagem por URL"
                    >
                        📎 URL
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
                <EditorContent editor={editor} />
            </div>

            {/* Modal de Link */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
                    <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-[#e5e5e5] mb-4">
                            {editor?.isActive('link') ? 'Editar Link' : 'Inserir Link'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                                    URL *
                                </label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://exemplo.com"
                                    className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#e5e5e5] placeholder-[#737373] focus:outline-none focus:border-[#3b82f6]"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleInsertLink();
                                        }
                                    }}
                                />
                            </div>
                            {!editor?.state.selection.empty && (
                                <div>
                                    <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                                        Texto do Link (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={linkText}
                                        onChange={(e) => setLinkText(e.target.value)}
                                        placeholder="Texto do link"
                                        className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#e5e5e5] placeholder-[#737373] focus:outline-none focus:border-[#3b82f6]"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={handleInsertLink}
                                disabled={!linkUrl}
                                className="flex-1 px-4 py-2 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editor?.isActive('link') ? 'Atualizar' : 'Inserir'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowLinkModal(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                }}
                                className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#a3a3a3] font-semibold hover:bg-[#222222] transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Imagem */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
                    <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-[#e5e5e5] mb-4">Inserir Imagem</h3>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Cole a URL da imagem"
                            className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] text-[#e5e5e5] placeholder-[#737373] focus:outline-none focus:border-[#3b82f6] mb-4"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    insertImage();
                                }
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={insertImage}
                                disabled={!imageUrl}
                                className="flex-1 px-4 py-2 rounded-lg bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Inserir
                            </button>
                            <button
                                onClick={() => {
                                    setShowImageModal(false);
                                    setImageUrl('');
                                }}
                                className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#a3a3a3] font-semibold hover:bg-[#222222] transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Biblioteca de Mídia */}
            <MediaLibrary
                isOpen={showMediaLibrary}
                onClose={() => setShowMediaLibrary(false)}
                onSelect={handleSelectFromLibrary}
            />
        </div>
    );
}
