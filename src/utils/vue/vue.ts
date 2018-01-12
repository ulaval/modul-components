import Vue from 'vue';
import { Messages } from '../i18n/i18n';
import { HttpService } from '../http/http';
import { MediaQueries } from '../media-queries/media-queries';
import { Modul } from '../modul/modul';
import { ConfirmFunction } from '../modal/confirm';
import { AlertFunction } from '../modal/alert';

export class ModulVue extends Vue {
    public $i18n: Messages;
    public $http: HttpService;
    public $mq: MediaQueries;
    public $modul: Modul;
    public $confirm: ConfirmFunction;
    public $alert: AlertFunction;

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
