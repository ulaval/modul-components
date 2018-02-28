import { createLocalVue, mount, TransitionStub } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { PortalStub, renderComponent } from '../../../tests/helpers/render';
import SpinnerPlugin, { MSpinner, MSpinnerSize, MSpinnerStyle } from './spinner';

describe('MSpinner', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(SpinnerPlugin);
        addMessages(localVue, ['components/spinner/spinner.lang.en.json']);
    });

    const createSpinner = () => {
        const spinner = mount(MSpinner, {
            localVue: localVue,
            stubs: {
                transition: TransitionStub,
                portal: PortalStub
            }
        });

        spinner.setData({ initialized: true });
        return spinner;
    };

    it('should render correctly', () => {
        const spinner = createSpinner();

        return expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render custom title when prop is set', () => {
        const spinner = createSpinner();
        spinner.setProps({ titleMessage: 'title' });

        return expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render default title when title prop is true ', () => {
        const spinner = createSpinner();
        spinner.setProps({ title: true });

        return expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render custom description when prop is set', () => {
        const spinner = createSpinner();
        spinner.setProps({ descriptionMessage: 'description' });

        return expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render default description when title prop is true ', () => {
        const spinner = createSpinner();
        spinner.setProps({ description: true });

        return expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render default description when title prop is true ', () => {
        const spinner = createSpinner();
        spinner.setProps({ description: true });

        return expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render skins correctly ', async () => {
        const spinner = createSpinner();

        spinner.setProps({ skin: MSpinnerStyle.Light });
        expect(await renderComponent(spinner.vm)).toMatchSnapshot('light');
        spinner.setProps({ skin: MSpinnerStyle.Lighter });
        expect(await renderComponent(spinner.vm)).toMatchSnapshot('lighter');
        spinner.setProps({ skin: MSpinnerStyle.Dark });
        expect(await renderComponent(spinner.vm)).toMatchSnapshot('dark');
    });

    it('should render small size correctly', () => {
        const spinner = createSpinner();

        spinner.setProps({ size: MSpinnerSize.Small });
        return expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });
});
