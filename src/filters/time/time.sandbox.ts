import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import TextfieldPlugin from '../../components/textfield/textfield';
import { TIME_NAME } from '../filter-names';
import WithRender from './time.sandbox.html';

@WithRender
@Component
export class MTimeSandbox extends Vue {
    now: Date = new Date();

    hours: number = this.now.getHours();
    minutes: number = this.now.getMinutes();

    get date(): Date {
        return new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDay(), this.hours, this.minutes);
    }
}

const TimeSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TIME_NAME}-sandbox`, MTimeSandbox);
        v.use(TextfieldPlugin);
    }
};

export default TimeSandboxPlugin;
