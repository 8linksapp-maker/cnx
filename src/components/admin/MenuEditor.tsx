/**
 * MenuEditor.tsx
 * 
 * Componente React para edição do Menu de navegação.
 */

import { useState, useEffect } from 'react';
import { useToast, ToastList } from './Toast';

interface MenuItem {
    label: string;
    href: string;
    icon: string;
    target: string;
}

interface MenuData {
    items?: MenuItem[];
}

interface Props {
    initialData?: MenuData;
}

export default function MenuEditor({ initialData }: Props) {
    const { toasts, showToast, removeToast } = useToast();
    const [data, setData] = useState<MenuData>(initialData || {});
    const [isSaving, setIsSaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    if (!isMounted) {
        return (
            <div className="space-y-6" style={{ minHeight: '400px' }}>
                <div className="p-8 text-center">
                    <p className="text-[#a3a3a3]">Carregando editor...</p>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/singletons/menu', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data }),
            });

            const result = await response.json();
            if (result.success) {
                showToast('success', 'Salvo com sucesso!');
            } else {
                showToast('error', 'Erro ao salvar', result.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar');
        } finally {
            setIsSaving(false);
        }
    };

    const addItem = () => {
        setData(prev => ({
            ...prev,
            items: [...(prev.items || []), { label: '', href: '', icon: '', target: '_self' }]
        }));
    };

    const updateItem = (index: number, field: keyof MenuItem, value: string) => {
        setData(prev => {
            const items = [...(prev.items || [])];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, items };
        });
    };

    const removeItem = (index: number) => {
        setData(prev => ({
            ...prev,
            items: (prev.items || []).filter((_, i) => i !== index)
        }));
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        setData(prev => {
            const items = [...(prev.items || [])];
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= items.length) return prev;
            [items[index], items[newIndex]] = [items[newIndex], items[index]];
            return { ...prev, items };
        });
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-[#e5e5e5] mb-1">
                        Menu de Navegação
                    </h2>
                    <p className="text-sm text-[#a3a3a3]">
                        Gerencie os itens do menu principal do site
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.href = '/admin/pages'}
                        className="admin-btn admin-btn-secondary"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="admin-btn admin-btn-primary disabled:opacity-50"
                    >
                        {isSaving ? 'Salvando...' : '💾 Salvar'}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl space-y-6">
                <div className="admin-card p-6">
                    <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                        Itens do Menu
                    </h3>
                    <div>
                        {(data.items || []).map((item, index) => (
                            <div key={index} className="admin-card p-4 mb-3">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-[#a3a3a3]">
                                        Item {index + 1}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => moveItem(index, 'up')}
                                            disabled={index === 0}
                                            className="text-xs text-[#a3a3a3] hover:text-[#e5e5e5] disabled:opacity-30"
                                            title="Mover para cima"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveItem(index, 'down')}
                                            disabled={index === (data.items?.length || 0) - 1}
                                            className="text-xs text-[#a3a3a3] hover:text-[#e5e5e5] disabled:opacity-30"
                                            title="Mover para baixo"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                            Label
                                        </label>
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={(e) => updateItem(index, 'label', e.target.value)}
                                            className="admin-input text-sm"
                                            placeholder="Ex: Home"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                            URL
                                        </label>
                                        <input
                                            type="text"
                                            value={item.href}
                                            onChange={(e) => updateItem(index, 'href', e.target.value)}
                                            className="admin-input text-sm"
                                            placeholder="Ex: /"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                            Ícone (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={item.icon}
                                            onChange={(e) => updateItem(index, 'icon', e.target.value)}
                                            className="admin-input text-sm"
                                            placeholder="Ex: 🏠"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                            Abrir em
                                        </label>
                                        <select
                                            value={item.target}
                                            onChange={(e) => updateItem(index, 'target', e.target.value)}
                                            className="admin-input text-sm"
                                        >
                                            <option value="_self">Mesma aba</option>
                                            <option value="_blank">Nova aba</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addItem}
                            className="admin-btn admin-btn-secondary text-sm"
                        >
                            + Adicionar Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <ToastList toasts={toasts} onRemove={removeToast} />
        </>
    );
}
