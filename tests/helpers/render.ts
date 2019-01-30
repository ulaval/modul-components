import Vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
// tslint:disable
export const renderComponent = async (component: Vue) => {
    let html = await createRenderer().renderToString(component);
    return html.replace(/<!---->/g, '');
};

export const PortalStub = {
    render(): void {
        let children = this.$options._renderChildren;
        children = children.filter(c => c.tag);
        return children[0];
    }
};

export const WrapChildrenStub = (rootTag: string): any => {
    return {
        render(h): void {
            let children = this.$options._renderChildren;
            children = children.filter(c => c.tag);
            return h(rootTag, {}, children);
        }
    };
};
// tslint:enable
