export interface MetaProps {
    name: string;
    optional: boolean;
    type: string;
    values?: string[];
    default?: string;
}

export interface MetaComponent {
    name: string;
    props?: MetaProps[];
    mixins?: string[];
}

export interface Meta {
    components: MetaComponent[];
}
