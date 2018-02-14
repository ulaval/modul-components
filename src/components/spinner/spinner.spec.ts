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

        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render custom title when prop is set', () => {
        const spinner = createSpinner();
        spinner.setProps({ titleMessage: 'title' });

        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render default title when title prop is true ', () => {
        const spinner = createSpinner();
        spinner.setProps({ title: true });

        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render custom description when prop is set', () => {
        const spinner = createSpinner();
        spinner.setProps({ descriptionMessage: 'description' });

        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render default description when title prop is true ', () => {
        const spinner = createSpinner();
        spinner.setProps({ description: true });

        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render default description when title prop is true ', () => {
        const spinner = createSpinner();
        spinner.setProps({ description: true });

        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });

    it('should render skins correctly ', () => {
        const spinner = createSpinner();

        spinner.setProps({ skin: MSpinnerStyle.Light });
        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot('light');
        spinner.setProps({ skin: MSpinnerStyle.Lighter });
        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot('lighter');
        spinner.setProps({ skin: MSpinnerStyle.Dark });
        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot('dark');
    });

    it('should render small size correctly', () => {
        const spinner = createSpinner();

        spinner.setProps({ size: MSpinnerSize.Small });
        expect(renderComponent(spinner.vm)).resolves.toMatchSnapshot();
    });
});
