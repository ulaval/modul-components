export interface MetaProps {
    name: string;
    type: string;
    values: string[];
    default: string;
}

export interface Meta {
    props?: MetaProps[];
    mixins?: string[];
}
