import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Meta from '../meta/meta';
import { FRENCH } from '../utils/i18n';
import { Navigation } from './navigation';
import { Viewer } from './viewer';

Vue.use(Router);

const componentRoutes: RouteConfig[] = [{
    path: '/',
    component: Navigation
}];

Meta.getTagsByLanguage(FRENCH).forEach(tag => {
    componentRoutes.push({
        path: '/' + tag,
        meta: tag,
        component: Viewer
    });
});

export default new Router({
    mode: 'history',
    routes: componentRoutes
});
