import Vue from 'vue';
import { Shell, PackageOptions } from '@ulaval/shell-ui/dist/shell/shell';

declare var __webpack_public_path__: string | undefined;

export type CreerInstanceVueFn = (shell: Shell, rootPath: string) => Vue;

export function setupShell(nomPackage: string, creerInstanceVue: CreerInstanceVueFn): void {
    window[nomPackage] = {
        mount(shell: Shell, options: PackageOptions): Promise<void> {
            if (this.vue) {
                console.warn('Already mounted.');
                return Promise.resolve();
            }

            __webpack_public_path__ = options.repoPublicPath;

            this.idElementRacine = options.rootElement;

            let rootPath: string = options.rootPath as string;
            if (rootPath[rootPath.length - 1] !== '/') {
                rootPath += '/';
            }

            this.vue = creerInstanceVue(shell, rootPath);

            this.vue.$mount('#' + this.idElementRacine);

            return Promise.resolve();
        },

        unmount(): Promise<void> {
            if (!this.vue) {
                return Promise.resolve();
            }

            const el = this.vue.$el;
            this.vue.$destroy();
            this.vue = undefined;

            let div = document.createElement('div');
            div.id = this.idElementRacine;
            if (el.parentNode) {
                el.parentNode.replaceChild(div, el);
            }

            return Promise.resolve();
        }
    };
}
