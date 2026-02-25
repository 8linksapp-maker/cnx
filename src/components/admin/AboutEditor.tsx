/**
 * AboutEditor.tsx
 * 
 * Componente React para edição da página Sobre Nós.
 */

import { useState, useEffect } from 'react';
import { useToast, ToastList } from './Toast';

interface Value {
    icon: string;
    title: string;
    description: string;
}

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    photo: string;
}

interface AboutData {
    heroTitle?: string;
    heroSubtitle?: string;
    missionTitle?: string;
    missionDescription?: string;
    visionTitle?: string;
    visionDescription?: string;
    valuesTitle?: string;
    values?: Value[];
    teamTitle?: string;
    teamMembers?: TeamMember[];
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    ctaButtonUrl?: string;
}

interface Props {
    initialData?: AboutData;
}

export default function AboutEditor({ initialData }: Props) {
    const { toasts, showToast, removeToast } = useToast();
    const [data, setData] = useState<AboutData>(initialData || {});
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
            const response = await fetch('/api/admin/singletons/about', {
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

    const updateField = (field: keyof AboutData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const addValue = () => {
        setData(prev => ({
            ...prev,
            values: [...(prev.values || []), { icon: '', title: '', description: '' }]
        }));
    };

    const updateValue = (index: number, field: keyof Value, value: string) => {
        setData(prev => {
            const values = [...(prev.values || [])];
            values[index] = { ...values[index], [field]: value };
            return { ...prev, values };
        });
    };

    const removeValue = (index: number) => {
        setData(prev => ({
            ...prev,
            values: (prev.values || []).filter((_, i) => i !== index)
        }));
    };

    const addTeamMember = () => {
        setData(prev => ({
            ...prev,
            teamMembers: [...(prev.teamMembers || []), { name: '', role: '', bio: '', photo: '' }]
        }));
    };

    const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
        setData(prev => {
            const teamMembers = [...(prev.teamMembers || [])];
            teamMembers[index] = { ...teamMembers[index], [field]: value };
            return { ...prev, teamMembers };
        });
    };

    const removeTeamMember = (index: number) => {
        setData(prev => ({
            ...prev,
            teamMembers: (prev.teamMembers || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-[#e5e5e5] mb-1">
                        Sobre Nós
                    </h2>
                    <p className="text-sm text-[#a3a3a3]">
                        Edite o conteúdo da página Sobre
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
                {/* Hero Section */}
                <div className="admin-card p-6">
                    <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                        Seção Hero
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={data.heroTitle || ''}
                                onChange={(e) => updateField('heroTitle', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: Sobre Nós"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Subtítulo
                            </label>
                            <textarea
                                value={data.heroSubtitle || ''}
                                onChange={(e) => updateField('heroSubtitle', e.target.value)}
                                className="admin-input resize-none"
                                rows={3}
                                placeholder="Descrição do hero"
                            />
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="admin-card p-6">
                    <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                        Missão e Visão
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Título da Missão
                            </label>
                            <input
                                type="text"
                                value={data.missionTitle || ''}
                                onChange={(e) => updateField('missionTitle', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: Nossa Missão"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Descrição da Missão
                            </label>
                            <textarea
                                value={data.missionDescription || ''}
                                onChange={(e) => updateField('missionDescription', e.target.value)}
                                className="admin-input resize-none"
                                rows={4}
                                placeholder="Descrição da missão"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Título da Visão
                            </label>
                            <input
                                type="text"
                                value={data.visionTitle || ''}
                                onChange={(e) => updateField('visionTitle', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: Nossa Visão"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Descrição da Visão
                            </label>
                            <textarea
                                value={data.visionDescription || ''}
                                onChange={(e) => updateField('visionDescription', e.target.value)}
                                className="admin-input resize-none"
                                rows={4}
                                placeholder="Descrição da visão"
                            />
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="admin-card p-6">
                    <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                        Valores
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Título dos Valores
                            </label>
                            <input
                                type="text"
                                value={data.valuesTitle || ''}
                                onChange={(e) => updateField('valuesTitle', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: Nossos Valores"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-3">
                                Lista de Valores
                            </label>
                            {(data.values || []).map((value, index) => (
                                <div key={index} className="admin-card p-4 mb-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-[#a3a3a3]">
                                            Valor {index + 1}
                                        </span>
                                        <button
                                            onClick={() => removeValue(index)}
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                                Ícone
                                            </label>
                                            <input
                                                type="text"
                                                value={value.icon}
                                                onChange={(e) => updateValue(index, 'icon', e.target.value)}
                                                className="admin-input text-sm"
                                                placeholder="Ex: 🚀"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                                Título
                                            </label>
                                            <input
                                                type="text"
                                                value={value.title}
                                                onChange={(e) => updateValue(index, 'title', e.target.value)}
                                                className="admin-input text-sm"
                                                placeholder="Ex: Inovação"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                                Descrição
                                            </label>
                                            <textarea
                                                value={value.description}
                                                onChange={(e) => updateValue(index, 'description', e.target.value)}
                                                className="admin-input text-sm resize-none"
                                                rows={2}
                                                placeholder="Descrição do valor"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addValue}
                                className="admin-btn admin-btn-secondary text-sm"
                            >
                                + Adicionar Valor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="admin-card p-6">
                    <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                        Equipe
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Título da Equipe
                            </label>
                            <input
                                type="text"
                                value={data.teamTitle || ''}
                                onChange={(e) => updateField('teamTitle', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: Nossa Equipe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-3">
                                Membros da Equipe
                            </label>
                            {(data.teamMembers || []).map((member, index) => (
                                <div key={index} className="admin-card p-4 mb-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-[#a3a3a3]">
                                            Membro {index + 1}
                                        </span>
                                        <button
                                            onClick={() => removeTeamMember(index)}
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                                Nome
                                            </label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                className="admin-input text-sm"
                                                placeholder="Ex: João Silva"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                                Cargo
                                            </label>
                                            <input
                                                type="text"
                                                value={member.role}
                                                onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                                                className="admin-input text-sm"
                                                placeholder="Ex: CEO & Founder"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                                Bio
                                            </label>
                                            <textarea
                                                value={member.bio}
                                                onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
                                                className="admin-input text-sm resize-none"
                                                rows={2}
                                                placeholder="Biografia do membro"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[#a3a3a3] mb-1">
                                                URL da Foto
                                            </label>
                                            <input
                                                type="text"
                                                value={member.photo}
                                                onChange={(e) => updateTeamMember(index, 'photo', e.target.value)}
                                                className="admin-input text-sm"
                                                placeholder="Ex: /images/team/joao.jpg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addTeamMember}
                                className="admin-btn admin-btn-secondary text-sm"
                            >
                                + Adicionar Membro
                            </button>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="admin-card p-6">
                    <h3 className="text-lg font-heading font-bold text-[#e5e5e5] mb-4">
                        CTA (Call to Action)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Título do CTA
                            </label>
                            <input
                                type="text"
                                value={data.ctaTitle || ''}
                                onChange={(e) => updateField('ctaTitle', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: Pronto para acelerar seu negócio?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Descrição do CTA
                            </label>
                            <textarea
                                value={data.ctaDescription || ''}
                                onChange={(e) => updateField('ctaDescription', e.target.value)}
                                className="admin-input resize-none"
                                rows={3}
                                placeholder="Descrição do CTA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                Texto do Botão
                            </label>
                            <input
                                type="text"
                                value={data.ctaButtonText || ''}
                                onChange={(e) => updateField('ctaButtonText', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: Explorar Conteúdo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#e5e5e5] mb-2">
                                URL do Botão
                            </label>
                            <input
                                type="text"
                                value={data.ctaButtonUrl || ''}
                                onChange={(e) => updateField('ctaButtonUrl', e.target.value)}
                                className="admin-input"
                                placeholder="Ex: /blog"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastList toasts={toasts} onRemove={removeToast} />
        </>
    );
}
