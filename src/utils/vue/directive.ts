import { VNode } from 'vue';

export const getVNodeAttributeValue = (node: VNode, attributeName: string): any | undefined => {
    if (!node.data || !node.data.attrs) { return undefined; }
    return node.data.attrs[attributeName];
};

interface VueElement extends HTMLElement {
    // tslint:disable-next-line:variable-name
    __vue__: any;
}
export const dispatchEvent = (element: HTMLElement, eventName: string, eventData: any): void => {
    const vueElement: VueElement = element as VueElement;
    if (vueElement.__vue__) {
        vueElement.__vue__.$emit(eventName, eventData);
    } else {
        element.dispatchEvent(eventData);
    }
};
