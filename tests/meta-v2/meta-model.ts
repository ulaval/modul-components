export interface MetaProps {
    name: string;
    type: string;
    values: string[];
}

export interface Meta {
    props?: MetaProps[];
    mixins?: string[];
}
