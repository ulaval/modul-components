import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './status-list.html?style=./status-list.scss';
import { STATUS_LIST_NAME } from '../component-names';

const STATE_COMPLETED: string = 'completed';
const STATE_PENDING: string = 'pending';
const STATE_ERROR: string = 'error';

const ICON_NAME_CHIP_CHECK: string = 'chip-check';
const ICON_NAME_CHIP_ERROR: string = 'chip-error';

export interface MStatusListData {
    state: MStatusListStates;
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
                    'state': STATE_COMPLETED,
                    'text': 'Informations default'
                },
                {
                    'state': STATE_PENDING,
                    'text': 'Questions default'
                },
                {
                    'state': STATE_ERROR,
                    'text': 'Pièces default'
                },
                {
                    'state': STATE_COMPLETED,
                    'text': 'Formulaire default'
                }
            ];
        }
    })
    public listData: MStatusListData[];

    private getIconName(state: MStatusListStates): string {
        return state == STATE_ERROR ? ICON_NAME_CHIP_ERROR : ICON_NAME_CHIP_CHECK;
    }
}

const StatusList: PluginObject<any> = {
    install(v, options) {
        v.component(STATUS_LIST_NAME, MStatusList);
    }
};

export default StatusList;
