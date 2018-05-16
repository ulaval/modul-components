import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import moment from 'moment';
import Vue, { VueConstructor } from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import DatefieldsPlugin, { MDatefields } from './datefields';

describe('MDateFields', () => {
    let localVue: VueConstructor<Vue>;
    let mockDropDown: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        mockDropDown = localVue.component('m-dropdown', {
            props: {
                value: String
            },
            template: '<m-dropdown-mock :value="value"></m-dropdown-mock>'
        });
        addMessages(localVue, [
            'components/datefields/datefields.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when waiting is set', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue,
            propsData: {
                waiting: true
            }
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled is set', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when error is set', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue,
            propsData: {
                error: true,
                errorMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when valid is set', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue,
            propsData: {
                valid: true,
                validMessage: 'Nostrud laboris quis velit voluptate aute elit elit non.'
            }
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly minYear/maxYear items', () => {
        localVue.component(
            'm-dropdown',
            mockDropDown.extend({
                template:
                    '<m-dropdown-mock :value="value"><slot></slot></m-dropdown-mock>'
            })
        );

        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue,
            propsData: {
                minYear: 2017,
                maxYear: 2018
            }
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly moment.js model type', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue
        });

        df.setProps({
            value: moment({ year: 1999, month: 7, date: 12 })
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly model Date type', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue
        });

        df.setProps({
            value: new Date('1999/8/12')
        });

        return expect(renderComponent(df.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when day/month/year is hidden', async () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue
        });

        df.setProps({ year: false });
        expect(await renderComponent(df.vm)).toMatchSnapshot('year');

        df.setProps({ month: false, year: true });
        expect(await renderComponent(df.vm)).toMatchSnapshot('month');

        df.setProps({ date: false, month: true });
        expect(await renderComponent(df.vm)).toMatchSnapshot('day');
    });

    it('should emit complete event when date is valid', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue,
            propsData: {
                value: new Date()
            }
        });

        df.setData({
            internalYear: 2018,
            internalMonth: 5,
            internalDate: 20
        });

        df.find({ name: 'm-dropdown' }).vm.$emit('change');

        expect(df.emitted('complete'));
        expect(df.emitted('change')[0][0]).toEqual(new Date('2018/5/20'));
    });

    it('should not emit change when date is invalid', () => {
        const df: Wrapper<MDatefields> = mount(MDatefields, {
            localVue: localVue
        });

        df.setData({
            internalYear: 2017,
            internalMonth: 12,
            internalDate: 40
        });

        df.find({ name: 'm-dropdown' }).vm.$emit('change');

        expect(df.emitted('change')).toBeFalsy();
    });
});
