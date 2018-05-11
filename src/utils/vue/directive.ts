import Vue, { VNode } from 'vue';

export const getVNodeAttributeValue = (node: VNode, attributeName: string): any | undefined => {
    if (!node.data || !node.data.attrs) { return undefined; }
    return node.data.attrs[attributeName];
};

interface VueElement extends HTMLElement {
    // tslint:disable-next-line:variable-name
    __vue__: Vue;
}
export const dispatchEvent = (element: HTMLElement, eventName: string, eventData: any): any => {
    const vueElement: VueElement = element as VueElement;
    if (vueElement.__vue__ &&
        vueElement.__vue__.$listeners[eventName]) {
        return vueElement.__vue__.$emit(eventName, eventData);
    } else {
        return element.dispatchEvent(eventData);
    }
};
