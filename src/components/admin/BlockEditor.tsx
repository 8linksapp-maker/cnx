/**
 * BlockEditor.tsx
 * 
 * Componente React para editor de blocos estilo Gutenberg usando BlockNote.
 * Fornece interface visual moderna com blocos arrastáveis, similar ao WordPress Gutenberg e Notion.
 */

import { createBlockNote } from '@blocknote/core';
import { BlockNoteViewRaw, useBlockNoteEditor } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { useEffect, useState } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function BlockEditor({ value, onChange, placeholder = 'Comece a escrever...' }: Props) {
    const [editor, setEditor] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);

    // Criar editor BlockNote
    useEffect(() => {
        const createEditor = async () => {
            try {
                const newEditor = await createBlockNote({
                    initialContent: undefined,
                });
                
                setEditor(newEditor);
                setIsReady(true);
            } catch (error) {
                console.error('Erro ao criar editor BlockNote:', error);
            }
        };

        createEditor();
    }, []);

    // Atualizar conteúdo quando value mudar externamente
    useEffect(() => {
        if (editor && value && isReady) {
            editor.tryParseHTMLToBlocks(value).then((blocks: any) => {
                if (blocks && blocks.length > 0) {
                    editor.replaceBlocks(editor.document, blocks);
                }
            }).catch(() => {
                // Se falhar, ignora silenciosamente
            });
        }
    }, [value, editor, isReady]);

    // Converter blocos para HTML quando mudar
    useEffect(() => {
        if (!editor || !isReady) return;

        const handleUpdate = async () => {
            try {
                const html = await editor.blocksToHTMLLossy(editor.document);
                if (html !== value) {
                    onChange(html);
                }
            } catch (error) {
                console.error('Erro ao converter blocos para HTML:', error);
            }
        };

        // Listener para mudanças no editor
        const unsubscribe = editor.onChange(() => {
            handleUpdate();
        });

        return () => {
            unsubscribe();
        };
    }, [editor, isReady, value, onChange]);

    if (!editor || !isReady) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg">
                <p className="text-[#a3a3a3]">Carregando editor...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
            <BlockNoteViewRaw 
                editor={editor}
                theme="dark"
            />
        </div>
    );
}
