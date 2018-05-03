import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './status.html?style=./status.scss';
import { STATUS_NAME } from '../component-names';
import IconPlugin from '../icon/icon';

export enum MStatusListStates {
    Completed = 'completed',
    Pending = 'pending',
    Error = 'error'
}

export enum MStatusListIconName {
    Check = 'chip-check',
    Error = 'chip-error'
}

@WithRender
@Component
export class MStatus extends Vue {
    @Prop({
        validator: value =>
            value == MStatusListStates.Completed ||
            value == MStatusListStates.Pending ||
            value == MStatusListStates.Error
    })
    public status: MStatusListStates;

    private statusEnum = MStatusListStates;

    private getIconName(state: MStatusListStates): string {
        return state == MStatusListStates.Error ? MStatusListIconName.Error : MStatusListIconName.Check;
    }

    private get isCompleted() {
        return this.status === this.statusEnum.Completed;
    }

    private get isPending() {
        return this.status === this.statusEnum.Pending;
    }

    private get isError() {
        return this.status === this.statusEnum.Error;
    }

}

const Status: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.warn(STATUS_NAME + ' is not ready for production');
        v.use(IconPlugin);
        v.component(STATUS_NAME, MStatus);
    }
};

export default Status;
