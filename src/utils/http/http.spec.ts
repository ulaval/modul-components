import '../../../tests/app/polyfills';
import Vue from 'vue';
import axios from 'axios';
import http, { HttpService } from './http';
import { RequestConfig } from './rest';

describe('http plugin', () => {
    it('should register $http on vue instance', () => {
        Vue.use(http);

        Vue.use({
            install(v, options) {
                expect((v as any).$http).toBeDefined();
            }
        });
    });

    it('should register $http on vue prototype', () => {
        Vue.use(http);

        let Ex = Vue.extend({
            created: function() {
                expect((this as any).$http).toBeDefined();
            }
        });

        const ex = new Ex();
    });
});
