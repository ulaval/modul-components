import Vue, { VueConstructor, PluginObject } from 'vue';
import VueRouter, { Route } from 'vue-router';
import { Shell, SHELL_GLOBAL_VAR } from '@ulaval/shell-ui/dist/shell/shell';
// import { HttpService } from '@ulaval/modul-components/dist/utils/http/http';
// import { ServiceErreurs, NOM_SERVICE_ERREURS } from '@ul/shell-services-api/dist/erreurs';
// import { ServiceSecurite, NOM_SERVICE_SECURITE } from '@ul/shell-services-api/dist/securite';
// import { ServiceAudit, NOM_SERVICE_AUDIT } from '@ul/shell-services-api/dist/audit';
// import { ServiceParametres, NOM_SERVICE_PARAMETRES } from '@ul/shell-services-api/dist/parametres';
// import I18nPlugin from '@ulaval/modul-components/dist/utils/i18n/i18n';
// import { startsWith } from '@ulaval/modul-components/dist/utils/str/str';
// import uuid from '@ulaval/modul-components/dist/utils/uuid/uuid';
import { AxiosResponse, AxiosError, AxiosProxyConfig, AxiosRequestConfig } from 'axios';
// import ErreurTechniquePlugin, { TypesErreur } from './erreurs/erreur-technique/erreur-technique';
// import FrancaisPlugin from './lang/fr';
// import { ModulJavascriptError, ModulRestError, ModulError } from './error';

const AUTHORIZATION_HEADER: string = 'Authorization';

declare module 'vue/types/vue' {
    interface Vue {
        // $http: HttpService;
    }
}

export interface ShellExtensionPluginOptions {
    shell: Shell;
    errorHandler?: (error: Error) => void;
    restErrorHandler?: (restError: AxiosError) => void;
    // auditUnhandledErrors?: boolean;
    // protectedUrls?: string[];
    // router?: VueRouter;
}

class ShellExtension {
    // private auditUnhandledErrors: boolean = false;

    constructor(private options?: ShellExtensionPluginOptions) {
        if (options) {
            // this.auditUnhandledErrors = options !== undefined && !!options.auditUnhandledErrors;

            this.setupErrorHandlers();
            // this.setupHttpInterceptors();
            // this.setupRouterHooks();
        } else {
            console.warn('Unable to install the ShellExtensionPlugin, you must provide ShellExtensionPluginOptions with a shell instance.');
        }
    }

    // public get audit(): ServiceAudit {
    //     return this.shell.getService<ServiceAudit>(NOM_SERVICE_AUDIT);
    // }

    // public get params(): ServiceParametres {
    //     return this.shell.getService<ServiceParametres>(NOM_SERVICE_PARAMETRES);
    // }

    // public getService<T>(nom: string): T {
    //     return this.shell.getService<T>(nom);
    // }

    // private get shell(): Shell {
    //     return window[SHELL_GLOBAL_VAR] as Shell;
    // }

    private setupErrorHandlers(): void {
        // doit auditer parce que ça ne remonte pas dans le window onError
        Vue.config.errorHandler = (err, vm, info) => this.onError(err);

        // let svcErreurs: ServiceErreurs = this.getService<ServiceErreurs>(NOM_SERVICE_ERREURS);
        // if (svcErreurs) {
        //     svcErreurs.setupWindowOnError(error => this.onUnhandledError(error));
        // }
    }

    // private setupHttpInterceptors(): void {
    //     if (Vue.prototype.$http) {
    //         this.setupRequestInterceptors();
    //         this.setupResponseInterceptors();
    //     }
    // }

    // private setupRequestInterceptors(): void {
    //     (Vue.prototype.$http as HttpService).instance.interceptors.request.use((config: AxiosRequestConfig) => {
    //         if (this.options && this.options.protectedUrls) {
    //             let svcSecurite: ServiceSecurite = this.shell.getService<ServiceSecurite>(NOM_SERVICE_SECURITE);
    //             this.options.protectedUrls.every(url => {
    //                 if (startsWith(config.url, url)) {
    //                     let token: string | undefined = svcSecurite.getToken();
    //                     if (token) {
    //                         if (config.headers) {
    //                             config.headers[AUTHORIZATION_HEADER] = token;
    //                         } else {
    //                             config.headers = {
    //                                 [AUTHORIZATION_HEADER]: token
    //                             };
    //                         }
    //                     }
    //                     return false;
    //                 }
    //                 return true;
    //             });
    //         }
    //         return config;
    //     }, (error: Error) => error);
    // }

    // private setupResponseInterceptors(): void {
    //     (Vue.prototype.$http as HttpService).instance.interceptors.response.use((response: AxiosResponse) => response, (error: Error) => {
    //         let erreur: Erreur<any>;
    //         if ((error as AxiosError).response) {
    //             erreur = new ErreurRest(error as AxiosError);
    //             let axiosResponse: AxiosResponse = (error as AxiosError).response as AxiosResponse;

    //             let id: string;
    //             if (axiosResponse.data) {
    //                 if (axiosResponse.data.idRequete) {
    //                     id = axiosResponse.data.idRequete;
    //                 } else {
    //                     id = uuid.generate();
    //                 }
    //             } else {
    //                 id = 'no_id';
    //             }

    //             let data: any = (axiosResponse.status === 403 || axiosResponse.status === 404 || axiosResponse.status === 503) ? undefined : axiosResponse.data;

    //             this.onErrorRest(id, data, erreur);
    //         } else {
    //             erreur = new ErreurJavascript(error);
    //             this.onError(erreur);
    //         }
    //         return Promise.reject(erreur);
    //     });
    // }

    // private setupRouterHooks(): void {
    //     if (this.options && this.options.router) {
    //         this.options.router.afterEach((to: Route, from: Route) => {
    //             this.audit.auditerNavigation(from.fullPath, to.fullPath);
    //         });
    //     }
    // }

    private onError(error: Error): void {
        // setTimeout(() => {
        //     if (!error.noPropagation) {
        //         let id: string = uuid.generate();
        //         // this.audit.auditerErreur(erreur.error.message, id, erreur.error);
        //         // this.popupError(erreur.error, id, TypesErreur.Javascript);
        //     }
        // }, 0);
        if (this.options && this.options.errorHandler) {
            this.options.errorHandler(error);
        }
    }

    // private onErrorRest(id: string, data: any, erreur: ErreurRest) {
    //     setTimeout(() => {
    //         if (!erreur.propagationArretee) {
    //             let axiosResponse: AxiosResponse | undefined = erreur.error.response;
    //             if (axiosResponse) {
    //                 this.audit.auditerErreurRest(String(axiosResponse.config.url), id, String(axiosResponse.config.method), axiosResponse.config.params, axiosResponse.status, data);
    //                 if (axiosResponse.status !== 401) {
    //                     this.popupError(erreur.error, id, TypesErreur.Http);
    //                 }
    //             }
    //         }
    //     }, 0);
    // }

    // private popupError(error: Error, id: string, type: TypesErreur): void {
    //     Vue.prototype.$error(error, id, type);
    // }

    // private onUnhandledError(err: ErrorEvent) {
    //     let id: string;
    //     if (err.error && (err.error as any).identifiant) {
    //         id = (err.error as any).identifiant;
    //     } else {
    //         id = uuid.generate();
    //     }
    //     if (this.auditUnhandledErrors) {
    //         this.audit.auditerErreur('*************FROM_EXTENSION*************' + err.message, id, err);
    //     }

    //     this.popupError(err.error, id, TypesErreur.Javascript);
    // }
}

const ShellExtensionPlugin: PluginObject<any> = {
    install(v, options): void {
        let shellExtension = new ShellExtension(options);
        // (v.prototype as any).$shell = shellExtension;
    }
};

export default ShellExtensionPlugin;
