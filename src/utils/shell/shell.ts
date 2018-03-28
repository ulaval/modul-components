import Vue, { PluginObject } from 'vue';
import VueRouter, { Route } from 'vue-router';
import { Shell, SHELL_GLOBAL_VAR } from '@ulaval/shell-ui/dist/shell/shell';
import { HttpService } from '../http/http';
import { AxiosResponse, AxiosError, AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import { PromiseError } from './error';

const AUTHORIZATION_HEADER: string = 'Authorization';

declare module 'vue/types/vue' {
    interface Vue {
        $http: HttpService;
    }
}

class ShellExtension {
    constructor() {
        this.setupErrorHandlers();
        this.setupHttpInterceptors();
    }

    private setupErrorHandlers(): void {
        // Vue parser errors do not propagate to window.onError
        Vue.config.errorHandler = (err, vm, info) => this.onError(err);
    }

    private setupHttpInterceptors(): void {
        if (Vue.prototype.$http) {
            this.setupResponseInterceptors();
        }
    }

    private setupResponseInterceptors(): void {
        (Vue.prototype.$http as HttpService).instance.interceptors.response.use((response: AxiosResponse) => response, (error: Error) => {
            // wrap to a PromiseError, so that propagation can be stopped
            let promiseError: PromiseError = new PromiseError(error);
            // delay onError
            this.onError(promiseError, true);

            return Promise.reject(promiseError);
        });
    }

    private onError(error: Error | PromiseError, defer: boolean = false): void {
        // defering will allow to stop the propagation of a PromiseError within the promise chain
        let call = () => window.onerror.call(this, error);
        defer ? setTimeout(() => call(), 0) : call();
    }
}

const ShellExtensionPlugin: PluginObject<any> = {
    install(v, options): void {
        let shellExtension = new ShellExtension();
    }
};

export default ShellExtensionPlugin;
