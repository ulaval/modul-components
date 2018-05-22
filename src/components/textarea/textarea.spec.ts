import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import TextareaPlugin from '../../components/textarea/textarea';
import uuid from '../../utils/uuid/uuid';
import { KeyCode } from './../../utils/keycode/keycode';
import { MTextarea } from './textarea';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MTextArea', () => {
    beforeEach(() => {
        Vue.use(TextareaPlugin);
    });

    it('should render correctly', () => {
        const txtarea: Wrapper<MTextarea> = mount(MTextarea);

        return expect(renderComponent(txtarea.vm)).resolves.toMatchSnapshot();
    });

    describe('max-length', () => {
        it('should render correctly state when text length is lesser than max length', () => {
            const txtarea: Wrapper<MTextarea> = mount(MTextarea, {
                propsData: {
                    maxLength: 8,
                    value: '1'
                }
            });

            return expect(
                renderComponent(txtarea.vm)
            ).resolves.toMatchSnapshot();
        });

        it('should render invalid state when text length is greater than max length', () => {
            const txtarea: Wrapper<MTextarea> = mount(MTextarea, {
                propsData: {
                    maxLength: 8,
                    value: '123456789'
                }
            });

            return expect(
                renderComponent(txtarea.vm)
            ).resolves.toMatchSnapshot();
        });
    });

    describe('allow-enter', () => {
        let textArea: Wrapper<MTextarea>;
        beforeEach(() => {
            textArea = mount(MTextarea);
        });

        [false, undefined].forEach(value => {
            it(`it should prevent enter keypress if allow-enter is ${value}`, () => {
                textArea.setProps({ allowEnter: value });
                const eventDummy: any = { preventDefault(): void {}, keyCode: KeyCode.M_RETURN };
                jest.spyOn(eventDummy, 'preventDefault');

                textArea.find('textarea').trigger('keypress', eventDummy);

                expect(eventDummy.preventDefault).toHaveBeenCalled();
            });
        });

        it('it should not prevent enter keypress if allow-enter is true', () => {
            textArea.setProps({ allowEnter: true });
            const eventDummy: any = { preventDefault(): void {}, keyCode: KeyCode.M_RETURN };
            jest.spyOn(eventDummy, 'preventDefault');

            textArea.find('textarea').trigger('keypress', eventDummy);

            expect(eventDummy.preventDefault).not.toHaveBeenCalled();
        });
    });
});
