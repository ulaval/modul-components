import Vue from 'vue';
import { Messages } from './i18n';
import { HttpService } from './http/http';
import { MediaQuery } from './media-query';

export class ModulVue extends Vue {
    public $i18n: Messages;
    public $http: HttpService;
    public $mq: MediaQuery;
}
