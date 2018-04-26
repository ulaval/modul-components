import Vue from 'vue';
import Component from 'vue-class-component';
import { Messages } from '../i18n/i18n';
import { HttpService } from '../http/http';
import { FileService } from '../file/file';
import { MediaQueries } from '../media-queries/media-queries';
import { Modul } from '../modul/modul';
import { ConfirmFunction } from '../modal/confirm';
import { AlertFunction } from '../modal/alert';
import { Logger } from '../logger/logger';

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
