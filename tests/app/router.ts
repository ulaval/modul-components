import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Meta from '../../src/meta/meta';
import { Attributes } from './attributes/attributes';
import { Navigation } from './navigation/navigation';
import { MediaQueriesTest } from './media-queries/media-queries';
import { Viewer } from './viewer';

Vue.use(Router);

const componentRoutes: RouteConfig[] = [{
    path: '/',
    component: Navigation
}, {
    path: '/attributes',
    component: Attributes,
    beforeEnter: (to, from, next) => {
        console.log('Attributes router.beforeEach');
        next();
    }
}, {
    path: '/media-queries',
    component: MediaQueriesTest
}];

Meta.getTags().forEach(tag => {
    componentRoutes.push({
        path: '/' + tag,
        meta: tag,
        component: Viewer
    });
});

const router = new Router({
    mode: 'history',
    routes: componentRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return { selector: to.hash };
        }
        return { x: 0, y: 0 };
    }
});

router.beforeEach((to, from, next) => {
    console.log('Gobal router.beforeEach');
    next();
});

export default router;
