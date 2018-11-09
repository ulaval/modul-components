import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

import { MediaQueriesTest } from './media-queries/media-queries';
import { getComponentsNames, getDirectiveNames, getFiltersNames, getUtilsNames } from './names-loader';
import { Navigation } from './navigation/navigation';
import { Viewer } from './viewer/viewer';

Vue.use(Router);

const routerFactory: () => Router = () => {
    const componentRoutes: RouteConfig[] = [
        {
            path: '/',
            component: Navigation
        },
        {
            path: '/media-queries',
            component: MediaQueriesTest
        }
    ];

    getComponentsNames().forEach(tag => {
        componentRoutes.push({
            path: '/components/' + tag,
            meta: tag,
            component: Viewer
        });
    });

    getDirectiveNames().forEach(tag => {
        componentRoutes.push({
            path: '/directives/' + tag,
            meta: tag,
            component: Viewer
        });
    });

    getFiltersNames().forEach(tag => {
        componentRoutes.push({
            path: '/filters/' + tag,
            meta: tag,
            component: Viewer
        });
    });

    getUtilsNames().forEach(name => {
        componentRoutes.push({
            path: '/services/' + name,
            meta: name,
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
