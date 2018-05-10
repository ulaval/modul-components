import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import Component from 'vue-class-component';

import { ModulVue } from '../../utils/vue/vue';

export enum ElementQueriesBpMin {
    XL = 1600,
    L = 1200,
    M = 1024,
    S = 768,
    XS = 480
}

export enum ElementQueriesBpMax {
    XL = 1599,
    L = 1199,
    M = 1023,
    S = 767,
    XS = 479
}

export interface ElementQueriesMixin {
    isEqMinXL: boolean;
    isEqMinL: boolean;
    isEqMinM: boolean;
    isEqMinS: boolean;
    isEqMinXS: boolean;

    isEqMaxXL: boolean;
    isEqMaxL: boolean;
    isEqMaxM: boolean;
    isEqMaxS: boolean;
    isEqMaxXS: boolean;

    isEqS: boolean;
    isEqM: boolean;
    isEqL: boolean;
}

@Component
export class ElementQueries extends ModulVue implements ElementQueriesMixin {
    public isEqMinXL: boolean = false;
    public isEqMinL: boolean = false;
    public isEqMinM: boolean = false;
    public isEqMinS: boolean = false;
    public isEqMinXS: boolean = false;

    public isEqMaxXL: boolean = false;
    public isEqMaxL: boolean = false;
    public isEqMaxM: boolean = false;
    public isEqMaxS: boolean = false;
    public isEqMaxXS: boolean = false;

    public isEqS: boolean = false;
    public isEqM: boolean = false;
    public isEqL: boolean = false;

    public eqActive: boolean = true;

    private resizeSensor: ResizeSensor;
    private doneResizeEvent: any;

    protected mounted(): void {
        this.resizeElement(this.$el);
        this.resizeSensor = new ResizeSensor(this.$el, () => this.resizeElement(this.$el));
    }

    protected beforeDestroy(): void {
        if (this.resizeSensor !== undefined) {
            this.resizeSensor.detach();
            this.resizeSensor = undefined;
            delete this.resizeSensor;
        }
    }

    private resizeElement(el: HTMLElement): void {
        if (this.eqActive) {
            this.setEqMin(el);
            this.setEqMax(el);
            this.setEq(el);
            this.$emit('resize');
            clearTimeout(this.doneResizeEvent);
            this.doneResizeEvent = setTimeout(() => {
                this.$emit('resizeDone', event);
            }, 200);
        } else {
            this.isEqMinXL = false;
            this.isEqMinL = false;
            this.isEqMinM = false;
            this.isEqMinS = false;
            this.isEqMinXS = false;
            this.isEqMaxXL = false;
            this.isEqMaxL = false;
            this.isEqMaxM = false;
            this.isEqMaxS = false;
            this.isEqMaxXS = false;
            this.isEqS = false;
            this.isEqM = false;
            this.isEqL = false;
        }
    }

    private setEqMin(el: HTMLElement): void {
        // width >= XL
        if (el.clientWidth >= ElementQueriesBpMin.XL) {
            if (!this.isEqMinXL) {
                this.isEqMinXL = true;
                this.$emit('isEqMinXL', true);
            }
        } else {
            if (this.isEqMinXL) {
                this.isEqMinXL = false;
                this.$emit('isEqMinXL', false);
            }
        }

        // width >= L
        if (el.clientWidth >= ElementQueriesBpMin.L) {
            if (!this.isEqMinL) {
                this.isEqMinL = true;
                this.$emit('isEqMinL', true);
            }
        } else {
            if (this.isEqMinL) {
                this.isEqMinL = false;
                this.$emit('isEqMinL', false);
            }
        }

        // width >= M
        if (el.clientWidth >= ElementQueriesBpMin.M) {
            if (!this.isEqMinM) {
                this.isEqMinM = true;
                this.$emit('isEqMinM', true);
            }
        } else {
            if (this.isEqMinM) {
                this.isEqMinM = false;
                this.$emit('isEqMinM', false);
            }
        }

        // width >= S
        if (el.clientWidth >= ElementQueriesBpMin.S) {
            if (!this.isEqMinS) {
                this.isEqMinS = true;
                this.$emit('isEqMinS', true);
            }
        } else {
            if (this.isEqMinS) {
                this.isEqMinS = false;
                this.$emit('isEqMinS', false);
            }
        }

        // width >= XS
        if (el.clientWidth >= ElementQueriesBpMin.XS) {
            if (!this.isEqMinXS) {
                this.isEqMinXS = true;
                this.$emit('isEqMinXS', true);
            }
        } else {
            if (this.isEqMinXS) {
                this.isEqMinXS = false;
                this.$emit('isEqMinXS', false);
            }
        }
    }

    private setEqMax(el: HTMLElement): void {
        // width <= XL
        if (el.clientWidth <= ElementQueriesBpMax.XL) {
            if (!this.isEqMaxXL) {
                this.isEqMaxXL = true;
                this.$emit('isEqMaxXL', true);
            }
        } else {
            if (this.isEqMaxXL) {
                this.isEqMaxXL = false;
                this.$emit('isEqMaxXL', false);
            }
        }

        // width <= L
        if (el.clientWidth <= ElementQueriesBpMax.L) {
            if (!this.isEqMaxL) {
                this.isEqMaxL = true;
                this.$emit('isEqMaxL', true);
            }
        } else {
            if (this.isEqMaxL) {
                this.isEqMaxL = false;
                this.$emit('isEqMaxL', false);
            }
        }

        // width <= M
        if (el.clientWidth <= ElementQueriesBpMax.M) {
            if (!this.isEqMaxM) {
                this.isEqMaxM = true;
                this.$emit('isEqMaxM', true);
            }
        } else {
            if (this.isEqMaxM) {
                this.isEqMaxM = false;
                this.$emit('isEqMaxM', false);
            }
        }

        // width <= S
        if (el.clientWidth <= ElementQueriesBpMax.S) {
            if (!this.isEqMaxS) {
                this.isEqMaxS = true;
                this.$emit('isEqMaxS', true);
            }
        } else {
            if (this.isEqMaxS) {
                this.isEqMaxS = false;
                this.$emit('isEqMaxS', false);
            }
        }

        // width <= XS
        if (el.clientWidth <= ElementQueriesBpMax.XS) {
            if (!this.isEqMaxXS) {
                this.isEqMaxXS = true;
                this.$emit('isEqMaxXS', true);
            }
        } else {
            if (this.isEqMaxXS) {
                this.isEqMaxXS = false;
                this.$emit('isEqMaxXS', false);
            }
        }
    }

    private setEq(el: HTMLElement): void {
        // width >= minM && width <= maxL
        if (el.clientWidth >= ElementQueriesBpMin.M && el.clientWidth <= ElementQueriesBpMax.L) {
            if (!this.isEqL) {
                this.isEqL = true;
                this.$emit('isEqL', true);
            }
        } else {
            if (this.isEqL) {
                this.isEqL = false;
                this.$emit('isEqL', false);
            }
        }

        // width >= minS && width <= maxM
        if (el.clientWidth >= ElementQueriesBpMin.S && el.clientWidth <= ElementQueriesBpMax.M) {
            if (!this.isEqM) {
                this.isEqM = true;
                this.$emit('isEqM', true);
            }
        } else {
            if (this.isEqM) {
                this.isEqM = false;
                this.$emit('isEqM', false);
            }
        }

        // width >= minXS && width <= maxS
        if (el.clientWidth >= ElementQueriesBpMin.XS && el.clientWidth <= ElementQueriesBpMax.S) {
            if (!this.isEqS) {
                this.isEqS = true;
                this.$emit('isEqS', true);
            }
        } else {
            if (this.isEqS) {
                this.isEqS = false;
                this.$emit('isEqS', false);
            }
        }
    }

}
