import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { TOGGLE_BUTTONS_NAME } from '../component-names';
import MToggleButtons, { MToggleButton } from './toggle-buttons';
import WithRender from './toggle-buttons.sandbox.html';


@WithRender
@Component
export class MToggleButtonsSandbox extends Vue {
    session201709: MToggleButton = { id: 'session201709', title: 'Automne 2017' };
    session201801: MToggleButton = { id: 'session201801', title: 'Printemps 2018', pressed: true };
    session201805: MToggleButton = { id: 'session201805', title: 'Été 2018' };
    session201809: MToggleButton = { id: 'session201809', title: 'Automne 2018' };
    session201901: MToggleButton = { id: 'session201901', title: 'Printemps 2019' };
    sessionsMultiple: MToggleButton[] = [this.session201709, this.session201801, this.session201805, this.session201809, this.session201901];
    sessionsSingle: MToggleButton[] = [this.session201709, this.session201801, this.session201805, this.session201809, this.session201901];
    sessionsScoped: MToggleButton[] = [this.session201709, this.session201801, this.session201805, this.session201809, this.session201901];

    get selectedMultiple(): string {
        let selection: string[] = this.sessionsMultiple.filter(b => b.pressed).map(b => b.id);
        return selection.length === 0 ? '' : selection.reduce((acc, b) => acc + ', ' + b);
    }

    get selectedSingle(): string {
        let selection: string[] = this.sessionsSingle.filter(b => b.pressed).map(b => b.id);
        return selection.length === 0 ? '' : selection.reduce((acc, b) => acc + ', ' + b);
    }

    get selectedScoped(): string {
        let selection: string[] = this.sessionsScoped.filter(b => b.pressed).map(b => b.id);
        return selection.length === 0 ? '' : selection.reduce((acc, b) => acc + ', ' + b);
    }
}

const ToggleButtonsSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${TOGGLE_BUTTONS_NAME}-sandbox`, MToggleButtonsSandbox);
        v.use(MToggleButtons);
    }
};

export default ToggleButtonsSandboxPlugin;
