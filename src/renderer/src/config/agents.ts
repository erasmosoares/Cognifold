import CognifoldFace from '@renderer/assets/cognifold_face.png';

export interface AgentConfig {
    id: string;
    name: string;
    endpoint: string;
    systemLabel: string;
    accentColor: string;
    description: string;
    image: string;
    placeholder: string;
}

export const AGENTS: Record<string, AgentConfig> = {
    COGNIFOLD: {
        id: 'cognifold',
        name: 'Cognifold',
        endpoint: 'chat',
        systemLabel: 'COGNIFOLD_OS_v9.2',
        accentColor: 'blue.500',
        description: 'Multi-dimensional intelligence aggregator.',
        image: CognifoldFace,
        placeholder: 'Enter query for deliberations...'
    },
    THERAPY: {
        id: 'therapy',
        name: 'Therapy Agent',
        endpoint: 'chat-therapy',
        systemLabel: 'EMPATHY_CORE_v1.0',
        accentColor: 'green.400',
        description: 'Empathetic and supportive emotional guide.',
        image: CognifoldFace, // Using same image for now as placeholder, or user can update
        placeholder: 'Share your thoughts...'
    }
};
