import Vue from 'vue';
import { createRenderer } from 'vue-server-renderer';

export const renderComponent = async (component: Vue) => {
    let html = await createRenderer().renderToString(component);
    return html.replace(/<!---->/g, '');
};

export const PortalStub = {
    render() {
        let children = this.$options._renderChildren;
        children = children.filter(c => c.tag);
        return children[0];
    }
};
