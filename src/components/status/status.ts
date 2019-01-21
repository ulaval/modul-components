import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { STATUS_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './status.html?style=./status.scss';

export enum MStatusListStates {
    Completed = 'completed',
    Pending = 'pending',
    Error = 'error'
}

export enum MStatusListIconName {
    Check = 'm-svg__completed-filled',
    Error = 'm-svg__error-filled'
}

@WithRender
@Component
export class MStatus extends Vue {
    @Prop({
        validator: value =>
            value === MStatusListStates.Completed ||
            value === MStatusListStates.Pending ||
            value === MStatusListStates.Error
    })
    public status: MStatusListStates;

    private statusEnum = MStatusListStates;

    private getIconName(state: MStatusListStates): string {
        return state === MStatusListStates.Error ? MStatusListIconName.Error : MStatusListIconName.Check;
    }

    private get isCompleted(): boolean {
        return this.status === this.statusEnum.Completed;
    }

    private get isPending(): boolean {
        return this.status === this.statusEnum.Pending;
    }

    private get isError(): boolean {
        return this.status === this.statusEnum.Error;
    }

}

const Status: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.error('MStatus will be deprecated in modul v.1.0');

        v.use(IconPlugin);
        v.component(STATUS_NAME, MStatus);
    }
};

export default Status;
