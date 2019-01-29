import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { CHARACTER_COUNT_NAME } from '../component-names';
import CharacterCountPlugin from './character-count';
import WithRender from './character-count.sandbox.html';


@WithRender
@Component
export class MCharacterCountSandbox extends Vue {
}

const CharacterCountSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(CharacterCountPlugin);
        v.component(`${CHARACTER_COUNT_NAME}-sandbox`, MCharacterCountSandbox);
    }
};

export default CharacterCountSandboxPlugin;
