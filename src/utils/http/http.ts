import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs/lib';
import { PluginObject } from 'vue';

import { ErrorHandler } from '../errors/error-handler';
import { PromiseError } from '../errors/promise-error';
import * as strUtils from '../str/str';
import { RequestConfig, RestAdapter } from './rest';

const AUTHORIZATION_HEADER: string = 'Authorization';

export interface HttpPluginOptions {
    protectedUrls?: string[];
    authorizationFn?: () => string;
    timeout?: number;
    createPromiseError?: boolean;
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
                let authFn: () => string = this.options.authorizationFn;
                this.instance.interceptors.request.use(config => {
                    protectedUrls.every(url => {
                        if (strUtils.startsWith(config.url, url)) {
                            let token: string = authFn();
                            config.headers = Object.assign({
                                [AUTHORIZATION_HEADER]: token
                            });
                            return false;
                        }
                        return true;
                    });
                    return config;
                });
            }

            // response interceptor to progagate PromiseError
            if (this.options.createPromiseError === undefined || this.options.createPromiseError) {
                this.instance.interceptors.response.use((response: AxiosResponse) => response, (error: Error) => {
                    // wrap to a PromiseError, so that propagation can be stopped
                    let promiseError: PromiseError = new PromiseError(error);
                    // delay onError
                    ErrorHandler.onError(promiseError, true);

                    return Promise.reject(promiseError);
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

            axiosConfig.data = qs.stringify(config.formParams, { arrayFormat: 'repeat' });
        } else {
            axiosConfig.data = config.data;
        }

        axiosConfig.paramsSerializer = params => {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        };

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
        (v.prototype as any).$http = http;
    }
};

export default HttpPlugin;
