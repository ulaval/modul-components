import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Meta from '@/components/meta';
import { Navigation } from './navigation';
import { Viewer } from './viewer';

Vue.use(Router);

const componentRoutes: RouteConfig[] = [{
    path: '/',
    component: Navigation
}];

Meta.getTagsByLanguage('fr').forEach(tag => {
    componentRoutes.push({
        path: '/' + tag,
        meta: tag,
        component: Viewer
    });
});

console.log(componentRoutes);

export default new Router({
    mode: 'history',
    routes: componentRoutes
});
