import Component from 'vue-class-component';
import { KeyCode } from '../../utils/keycode/keycode';
import { ModulVue } from '../../utils/vue/vue';
import { InputManagement } from '../input-management/input-management';
import { InputState } from '../input-state/input-state';
import { MediaQueries } from '../media-queries/media-queries';


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

    public inputOnKeydownTab($event: KeyboardEvent): void {
        if (this.as<MediaQueries>().isMqMinS) {
            this.open = false;
        }
    }

    public inputOnKeydownDelete(): void {
        this.internalValue = '';
    }

    public inputOnKeydown($event: KeyboardEvent): void {

        // tslint:disable: deprecation
        if ($event.keyCode !== KeyCode.M_RETURN &&
            $event.keyCode !== KeyCode.M_ENTER &&
            $event.keyCode !== KeyCode.M_TAB &&
            $event.keyCode !== KeyCode.M_SHIFT &&
            $event.keyCode !== KeyCode.M_ESCAPE && !this.open) {
            this.open = true;
        }
        // tslint:enable: deprecation
    }

    public inputOnFocus(): void {
        if (!this.open && !this.as<InputState>().isDisabled && this.as<MediaQueries>().isMqMinS) {
            this.open = true;
        }
    }

    public get isEmpty(): boolean {
        return this.as<InputManagement>().hasValue || (this.hasPlaceholder() && this.open) ? false : true;
    }


    public hasPlaceholder(): boolean {
        return this.placeholder !== undefined && this.placeholder !== '';
    }
}
