import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './status-list.html?style=./status-list.scss';
import { STATUS_LIST_NAME } from '../component-names';

export interface MStatusListData {
    status: MStatusListStates;
    text: string;
}

export type MStatusListStates = 'completed' | 'pending' | 'error';

@WithRender
@Component

export class MStatusList extends Vue {
    @Prop({
        default: () => {
            return [
                {
                    'status': 'completed',
                    'text': 'Informations default'
                },
                {
                    'status': 'pending',
                    'text': 'Questions default'
                },
                {
                    'status': 'error',
                    'text': 'Pièces default'
                },
                {
                    'status': 'completed',
                    'text': 'Formulaire default'
                }
            ];
        }
    })
    public states: MStatusListData[];

    public getIcon(status: MStatusListStates): string {
        let icon: string = '';
        switch (status) {
            case 'completed':
                icon = 'pastille-crochet';
                break;
            case 'pending':
                icon = 'pastille-crochet-jaune';
                break;
            case 'error':
                icon = 'pastille-erreur';
                break;
            default:
                break;
        }
        return icon;
    }

}

const StatusList: PluginObject<any> = {
    install(v, options) {
        v.component(STATUS_LIST_NAME, MStatusList);
    }
};

export default StatusList;
