import Vue from 'vue';
import '../../utils/polyfills';
import LimitTextPlugin, { MLimitText } from './limit-text';

let limitText: MLimitText;

describe('limit-text', () => {
    beforeEach(() => {
        Vue.use(LimitTextPlugin);
        limitText = new MLimitText().$mount();
    });

    // Todo: Complete the unit test

});
