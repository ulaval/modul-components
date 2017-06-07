import Vue from 'vue';
import { Messages } from './i18n';
import { HttpService } from './http';

export class ModulVue extends Vue {
    public $i18n: Messages;
    public $http: HttpService;
}
