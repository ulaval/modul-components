import Vue from 'vue';
import { Messages } from '../i18n/i18n';
import { HttpService } from '../http/http';
import { MediaQueries } from '../media-queries/media-queries';

export class ModulVue extends Vue {
    public $i18n: Messages;
    public $http: HttpService;
    public $mq: MediaQueries;
}
