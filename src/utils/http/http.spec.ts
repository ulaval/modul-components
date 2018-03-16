import Vue from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import HttpPlugin, { HttpService } from './http';

describe('i18n plugin', () => {
    describe('when not installed', () => {
        it('should not be registered on the Vue prototype', () => {
            expect(Vue.prototype.$http).toBeUndefined();
        });
    });

    describe('when install', () => {
        beforeEach(() => {
            resetModulPlugins();
        });

        it('should register $i18n on the Vue prototype', () => {
            Vue.use(HttpPlugin);
            expect(Vue.prototype.$http).toBeDefined();
        });
    });
});
