import { VNode } from 'vue';

export const getVNodeAttributeValue = (node: VNode, attributeName: string): any | undefined => {
    if (!node.data || !node.data.attrs) { return undefined; }
    return node.data.attrs[attributeName];
};

export const dispatchEvent = (eventData, sourceEvent: any, name: string): void => {
    const customEvent: CustomEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent(name, true, true, event);
    this.element.dispatchEvent(Object.assign(customEvent, eventData));
};
