import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import IconFilePlugin, { MIconFile } from './icon-file';

describe('MIconFile', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(IconFilePlugin);
    });

    it('should render correctly', () => {
        const iconFile: Wrapper<MIconFile> = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                extension: 'pdf'
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly with 100px size', () => {
        const iconFile: Wrapper<MIconFile> = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                extension: 'pdf',
                size: '100px'
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should render title when svgTitle prop is set', () => {
        const iconFile: Wrapper<MIconFile> = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                extension: 'pdf',
                svgTitle: 'test'
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when icon-file is clicked', () => {
        const iconFile: Wrapper<MIconFile> = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                extension: 'pdf'
            }
        });

        iconFile.trigger('click');

        expect(iconFile.emitted('click')).toBeTruthy();
    });
});
