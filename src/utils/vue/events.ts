import Vue from 'vue';

interface VueElement extends HTMLElement {
    // tslint:disable-next-line:variable-name
    __vue__: Vue;
}
export const dispatchEvent: (element: HTMLElement, eventName: string, eventData: any) => any = (element: HTMLElement, eventName: string, eventData: any): any => {
    const vueElement: VueElement = element as VueElement;
    if (vueElement.__vue__) {
        if (vueElement.__vue__.$listeners[eventName]) {
            return vueElement.__vue__.$emit(eventName, eventData);
        } else if (vueElement.__vue__.$children.length > 0 && vueElement.__vue__.$children[0].$el === vueElement && vueElement.__vue__.$children[0].$listeners[eventName]) {
            return vueElement.__vue__.$children[0].$emit(eventName, eventData);
        }
    }
    return element.dispatchEvent(eventData);
};
