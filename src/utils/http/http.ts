import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { PluginObject } from 'vue';
import { WindowErrorHandler } from '../errors/window-error-handler';
import * as strUtils from '../str/str';
import { serializeParams } from './http-param-serializer';
import { RequestConfig, RestAdapter } from './rest';

const AUTHORIZATION_HEADER: string = 'Authorization';

/**
 * Augment the typings of Vue.js
 */

declare module 'vue/types/vue' {
    interface Vue {
        $http: HttpService;
    }
}
export interface HttpPluginOptions {
    protectedUrls?: string[];
    authorizationFn?: () => string | Promise<string>;
    timeout?: number;
    useEventOnPromiseError?: boolean;
}

export const NO_TIMEOUT: number = 0;

export class HttpService implements RestAdapter {
    public instance: AxiosInstance;

    constructor(private options?: HttpPluginOptions) {
        this.instance = axios.create();

        if (this.options) {
            // timeout
            if (!this.options.timeout) {
                this.instance.defaults.timeout = 30000;
            } else if (this.options.timeout === NO_TIMEOUT) {
                this.instance.defaults.timeout = undefined;
            } else {
                this.instance.defaults.timeout = this.options.timeout;
            }

            // request interceptor for authorization header
            if (this.options.protectedUrls && this.options.authorizationFn) {
                let protectedUrls: string[] = this.options.protectedUrls;
                let authFn: () => string | Promise<string> = this.options.authorizationFn;

                this.instance.interceptors.request.use(config => {
                    let result: Promise<AxiosRequestConfig> = Promise.resolve(config);
                    let tokenAsync: Promise<string> | undefined;

                    protectedUrls.every(url => {
                        if (strUtils.startsWith(config.url, url)) {
                            tokenAsync = Promise.resolve(authFn());
                            return false; // break
                        }
                        return true;
                    });

                    if (tokenAsync) {
                        result = tokenAsync.then(token => {
                            config.headers = Object.assign(config.headers || {}, { [AUTHORIZATION_HEADER]: token });
                            return config;
                        });
                    }

                    return result;
                });
            }

            // response interceptor to progagate PromiseError
            if (this.options.useEventOnPromiseError === undefined || this.options.useEventOnPromiseError) {
                this.instance.interceptors.response.use((response: AxiosResponse) => response, (err: Error) => {
                    // wrap to a PromiseError, so that propagation can be stopped
                    let promiseErrorEvent: ErrorEvent = new ErrorEvent('error', {
                        error: err,
                        cancelable: true
                    });
                    // delay onError
                    WindowErrorHandler.onError(promiseErrorEvent, true);

                    return Promise.reject(promiseErrorEvent);
                });
            }
        }
    }

    public execute<T>(config: RequestConfig, axiosOptions?: AxiosRequestConfig): AxiosPromise<T> {
        let mergedConfig: AxiosRequestConfig = this.buildConfig(config);
        mergedConfig = {
            ...mergedConfig,
            ...axiosOptions
        };

        return this.instance.request<T>(mergedConfig);
    }

    private buildConfig(config: RequestConfig): AxiosRequestConfig {
        let axiosConfig: AxiosRequestConfig = {};
        axiosConfig.url = this.resolveUrl(config);
        axiosConfig.method = config.method;
        axiosConfig.params = config.params;
        axiosConfig.headers = config.headers;

        if (config.formParams) {
            const CONTENT_TYPE: string = 'Content-Type';
            const FORM_URLENCODED: string = 'application/x-www-form-urlencoded';

            if (axiosConfig.headers) {
                axiosConfig.headers[CONTENT_TYPE] = FORM_URLENCODED;
            } else {
                axiosConfig.headers = {
                    [CONTENT_TYPE]: FORM_URLENCODED
                };
            }

            axiosConfig.data = serializeParams(config.formParams);
        } else {
            axiosConfig.data = config.data;
        }

        axiosConfig.paramsSerializer = params => serializeParams(params);

        return axiosConfig;
    }

    private resolveUrl(config: RequestConfig): string | undefined {
        let result: string | undefined = config.rawUrl;
        if (result && config.pathParams) {
            for (let key in config.pathParams) {
                result = result.replace('{' + key + '}', encodeURIComponent(config.pathParams[key]));
            }
        }

        return result;
    }
}

const HttpPlugin: PluginObject<any> = {
    install(v, options): void {
        let http: HttpService = new HttpService(options);
        (v.prototype).$http = http;
    }
};

export default HttpPlugin;
