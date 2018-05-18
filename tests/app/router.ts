import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

import Meta from '../../src/meta/meta';
import { Attributes } from './attributes/attributes';
import { MediaQueriesTest } from './media-queries/media-queries';
import { Navigation } from './navigation/navigation';
import { Viewer } from './viewer';

Vue.use(Router);

const routerFactory: () => Router = () => {
    const componentRoutes: RouteConfig[] = [
        {
            path: '/',
            component: Navigation
        },
        {
            path: '/attributes',
            component: Attributes,
            beforeEnter: (to, from, next) => {
                next();
            }
        },
        {
            path: '/media-queries',
            component: MediaQueriesTest
        }
    ];

    Meta.getTags().forEach(tag => {
        componentRoutes.push({
            path: '/' + tag,
            meta: tag,
            component: Viewer
        });
    });

    let router: Router = new Router({
        mode: 'history',
        routes: componentRoutes,
        scrollBehavior: (to, from, savedPosition) => {
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
        next();
    });

    return router;
};

export default routerFactory;
