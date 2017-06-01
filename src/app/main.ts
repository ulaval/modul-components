import './polyfills';
import Vue from 'vue';
import router from './router';


import Buttons from '@/components/buttons';
import Link from '@/components/links';
import Lists from '@/components/lists';
import Text from '@/components/text';
import TextIcon from '@/components/text-icon';
import RippleEffect from '@/components/ripple-effect';

Vue.config.productionTip = false;

Vue.use(Buttons);
Vue.use(Link);
Vue.use(Lists);
Vue.use(Text);
Vue.use(TextIcon);
Vue.use(RippleEffect);

const vue = new Vue({
    router,
    template: '<router-view></router-view>'
});

vue.$mount('#vue');
