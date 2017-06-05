import Vue from 'vue';
import { Messages } from './i18n';
import { AxiosStatic } from 'axios';

export class ModulVue extends Vue {
    public $i18n: Messages;
    public $http: AxiosStatic;
}
