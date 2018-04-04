import Vue, { PluginObject } from 'vue';
import VueRouter, { Route } from 'vue-router';
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

    /**
     * Calls the window.onerror function. Use this method for errors that cannot be handled by the window.onerror standard handler.
     * Mostly, this method will be used to provide retroaction on Promise errors.
     * @param error The unhandled error.
     * @param defer True will delay the execution of the call to the next cyle, allowing, for example, stopping the propagation of the error in the promise chain. Default is false.
     */
    public onError(error: Error | PromiseError, defer: boolean = false): void {
        let call = () => window.onerror.call(this, error);
        defer ? setTimeout(() => call(), 0) : call();
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
}

const ShellExtensionPlugin: PluginObject<any> = {
    install(v, options): void {
        let shellExtension = new ShellExtension();
        (v.prototype as any).$shell = shellExtension;
    }
};

export default ShellExtensionPlugin;
