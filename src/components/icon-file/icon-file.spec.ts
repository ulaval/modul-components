import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import MIconFilePlugin, { MIconFile, MIconFileState } from './icon-file';

describe('MIconFile', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(MIconFilePlugin);
    });

    it('should render correctly', () => {
        const iconFile = mount(MIconFile, {
            localVue: localVue
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when state is completed', () => {
        const iconFile = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                state: MIconFileState.Completed
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when state is warning', () => {
        const iconFile = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                state: MIconFileState.Warning
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when state is error', () => {
        const iconFile = mount(MIconFile, {
            localVue: localVue,
            propsData: {
                state: MIconFileState.Error
            }
        });

        return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
    });

    describe('icon', () => {
        let iconFile: Wrapper<MIconFile>;
        beforeEach(() => {
            iconFile = mount(MIconFile, {
                localVue: localVue,
                propsData: {
                    name: 'pdf'
                }
            });
        });

        it('should render correctly', () => {
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when size is set', () => {
            iconFile.setProps({ size: '40px' });
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });
    });

    describe('chip', () => {
        let iconFile: Wrapper<MIconFile>;
        beforeEach(() => {
            iconFile = mount(MIconFile, {
                localVue: localVue,
                propsData: {
                    state: MIconFileState.Completed
                }
            });
        });

        it('should render correctly', () => {
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when size is set', () => {
            iconFile.setProps({ chipSize: '40px' });
            return expect(renderComponent(iconFile.vm)).resolves.toMatchSnapshot();
        });
    });

});
