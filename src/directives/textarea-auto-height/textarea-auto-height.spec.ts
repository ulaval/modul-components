import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import TextAreaAutoHeightPlugin from './textarea-auto-height';

describe('MTextAreaAutoSizeDirective', () => {
    let textarea: Wrapper<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(TextAreaAutoHeightPlugin);

        textarea = mount(
            {
                props: ['content'],
                template:
                    '<textarea v-model="content" v-m-textarea-auto-height></textarea>'
            },
            { localVue: Vue }
        );

        Object.defineProperty(textarea.vm.$el, 'scrollHeight', {
            get: jest.fn()
        });
    });

    it('it should disable resize and overflow on bind', () => {
        expect(textarea.vm.$el.style.outline).toEqual('none');
        expect(textarea.vm.$el.style.resize).toEqual('none');
        expect(textarea.vm.$el.style.overflow).toEqual('hidden');
    });

    it('it should adjust height when value change', () => {
        mockScrollHeight(100);

        textarea.setProps({
            content: 'text'
        });

        expect(textarea.vm.$el.style.height).toEqual('100px');
    });

    it('it should adjust height when component is resized', () => {
        mockScrollHeight(100);

        textarea.vm.$emit('resize');

        expect(textarea.vm.$el.style.height).toEqual('100px');
    });

    it('it should adjust height only when value is different from last update', () => {
        mockScrollHeight(100);
        textarea.setProps({
            content: 'text'
        });

        mockScrollHeight(150);
        textarea.update();

        expect(textarea.vm.$el.style.height).toEqual('100px');
    });

    it('it should remove event listener at unbind', () => {
        textarea.vm.$off = jest.fn();

        textarea.vm.$destroy();

        expect((textarea.vm.$off as jest.Mock).mock.calls[0][0]).toEqual(
            'resize'
        );
    });

    const mockScrollHeight = (value: number) => {
        const desc = Object.getOwnPropertyDescriptor(
            textarea.vm.$el,
            'scrollHeight'
        );

        (desc.get as jest.Mock).mockReturnValue(value);
    };
});
