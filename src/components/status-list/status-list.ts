import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './status-list.html?style=./status-list.scss';
import { STATUS_LIST_NAME } from '../component-names';

export enum MStatusListStates {
    Completed = 'completed',
    Pending = 'pending',
    Error = 'error'
}

export enum MStatusListIconName {
    Check = 'chip-check',
    Error = 'chip-error'
}

export interface MStatusListData {
    state: MStatusListStatesType;
    text: string;
}

export type MStatusListStatesType = 'completed' | 'pending' | 'error';

@WithRender
@Component

export class MStatusList extends Vue {
    @Prop({
        default: () => {
            return [
                {
                    'state': MStatusListStates.Completed,
                    'text': 'Informations default'
                },
                {
                    'state': MStatusListStates.Pending,
                    'text': 'Questions default'
                },
                {
                    'state': MStatusListStates.Error,
                    'text': 'Pièces default'
                },
                {
                    'state': MStatusListStates.Completed,
                    'text': 'Formulaire default'
                }
            ];
        }
    })
    public listData: MStatusListData[];

    private getIconName(state: MStatusListStates): string {
        return state == MStatusListStates.Error ? MStatusListIconName.Error : MStatusListIconName.Check;
    }
}

const StatusList: PluginObject<any> = {
    install(v, options) {
        v.component(STATUS_LIST_NAME, MStatusList);
    }
};

export default StatusList;
