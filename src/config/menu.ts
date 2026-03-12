// types/menu.ts
export interface SemanticMenuItem {
    id: number;
    semantic_key: string;
    type: 'header' | 'module' | 'group' | 'link';
    name: string;
    route?: string;
    icon?: string;
    permission?: string;
    children?: SemanticMenuItem[];
}

export interface MenuResponse {
    menu: SemanticMenuItem[];
    version: string;
    semantic_version: string;
}