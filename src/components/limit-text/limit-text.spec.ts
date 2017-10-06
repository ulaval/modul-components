import Vue from 'vue';
import '../../utils/polyfills';
import LimitTextPlugin, { MLimitText } from './limit-text';

let limitText: MLimitText;

describe('checkbox', () => {
    beforeEach(() => {
        Vue.use(LimitTextPlugin);
        limitText = new MLimitText().$mount();
    });

});
