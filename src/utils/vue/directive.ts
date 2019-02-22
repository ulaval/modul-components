import { VNode } from 'vue';

export const getVNodeAttributeValue: (node: VNode, attributeName: string) => any = (node: VNode, attributeName: string): any | undefined => {
    if (!node.data || !node.data.attrs) { return undefined; }
    return node.data.attrs[attributeName];
};
