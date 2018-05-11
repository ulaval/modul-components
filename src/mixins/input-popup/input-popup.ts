import Component from 'vue-class-component';

import { InputState } from '../../mixins/input-state/input-state';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import { KeyCode } from '../../utils/keycode/keycode';
import { ModulVue } from '../../utils/vue/vue';

@Component({
    mixins: [
        InputState,
        MediaQueries
    ]
})
export class InputPopup extends ModulVue {
    public open: boolean;
    public placeholder: string;
    public internalValue: any | undefined = '';

    public inputOnKeydownEnter($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        }
        $event.preventDefault();
    }

    public inputOnKeydownEsc($event: KeyboardEvent): void {
        this.open = false;
        $event.preventDefault();
    }

    public inputOnKeydownTab($event: KeyboardEvent): void {
        if (this.as<MediaQueries>().isMqMinS) {
            this.open = false;
        }
    }

    public inputOnKeydown($event: KeyboardEvent): void {
        if ($event.keyCode !== KeyCode.M_RETURN &&
            $event.keyCode !== KeyCode.M_ENTER &&
            $event.keyCode !== KeyCode.M_TAB &&
            $event.keyCode !== KeyCode.M_ESCAPE && !this.open) {
            this.open = true;
        }
    }

    public inputOnFocus(): void {
        if (!this.open && !this.as<InputState>().isDisabled && this.as<MediaQueries>().isMqMinS) {
            this.open = true;
        }
    }

    public get isEmpty(): boolean {
        return this.hasValue() || (this.hasPlaceholder() && this.open) ? false : true;
    }

    public hasValue(): boolean {
        return this.internalValue !== undefined && this.internalValue !== '' && this.internalValue !== ' ';
    }

    public hasPlaceholder(): boolean {
        return this.placeholder !== undefined && this.placeholder !== '';
    }
}
