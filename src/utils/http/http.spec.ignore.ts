import '../polyfills';
import Vue from 'vue';
import axios from 'axios';
import httpPlugin, { HttpService } from './http';
import { RequestConfig } from './rest';

describe('http plugin', () => {
    it('registers $http on vue instance', () => {
        Vue.use(httpPlugin);

        Vue.use({
            install(v, options) {
                expect((v as any).$http).toBeDefined();
            }
        });
    });

    it('registers $http on vue prototype', () => {
        Vue.use(httpPlugin);

        let Ex = Vue.extend({
            created: function() {
                expect((this as any).$http).toBeDefined();
            }
        });

        const ex = new Ex();
    });
});
