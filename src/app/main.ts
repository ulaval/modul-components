import './polyfills';
import Vue from 'vue';
import router from './router';

import Buttons from '@/components/buttons/buttons';
import Lists from '@/components/lists/lists';
import Text from '@/components/text/text';

Vue.config.productionTip = false;

Vue.use(Buttons);
Vue.use(Lists);
Vue.use(Text);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
