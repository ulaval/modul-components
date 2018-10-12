import Vue from 'vue';
import Component from 'vue-class-component';

import { FileService } from '../file/file';
import { HttpService } from '../http/http';
import { Messages } from '../i18n/i18n';
import { Licenses } from '../license/license';
import { Logger } from '../logger/logger';
import { MediaQueries } from '../media-queries/media-queries';
import { AlertFunction } from '../dialog/alert';
import { ConfirmFunction } from '../dialog/confirm';
import { Modul } from '../modul/modul';

// TODO: explore usage of TS declare syntax
// declare module 'vue/types/vue' {
//     interface Vue {
//         $i18n: Messages;
//     }
// }

@Component
export class ModulVue extends Vue {
    public $i18n: Messages;
    public $http: HttpService;
    public $mq: MediaQueries;
    public $modul: Modul;
    public $confirm: ConfirmFunction;
    public $alert: AlertFunction;
    public $file: FileService;
    public $log: Logger;
    public $license: Licenses;

    protected getParent<T extends Vue>(test: (obj: Vue) => boolean): T | undefined {
        let p: Vue = this.$parent;
        while (p && !test(p)) {
            p = p.$parent;
        }
        return p as any;
    }

    protected as<T>(): T {
        let result: any = this;
        return result as T;
    }
}
