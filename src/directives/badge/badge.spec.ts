import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { createMockFile } from '../../../tests/helpers/file';
import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
import FilePlugin, { DEFAULT_STORE_NAME } from '../../utils/file/file';
import { ModulVue } from '../../utils/vue/vue';
import BadgePlugin from './badge';
import { addMessages } from '../../../tests/helpers/lang';
import { MIconFile } from '../../components/icon-file/icon-file';

describe('MBadge', () => {
    let localVue: VueConstructor<ModulVue>;
    let badge: Wrapper<ModulVue>;

    it('should render correctly', () => {
        const iconFile = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                extension: 'jpg'
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });
});
