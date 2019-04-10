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
        this.resizeElement(this.$el as HTMLElement);
        this.resizeSensor = new ResizeSensor(this.$el, () => this.resizeElement(this.$el as HTMLElement));
    }

    protected beforeDestroy(): void {
        if (this.resizeSensor !== undefined) {
            this.resizeSensor.detach();
            this.resizeSensor = undefined;
            delete this.resizeSensor;
        }
        this.$off('resize');
        this.$off('resizeDone');
    }

    private resizeElement(el: HTMLElement): void {
        if (this.eqActive) {
            const elWidth: number = el.clientWidth;
            requestAnimationFrame(() => {
                this.setEqMin(elWidth);
                this.setEqMax(elWidth);
                this.setEq(elWidth);
            });
            this.$emit('resize');
            clearTimeout(this.doneResizeEvent);
            this.doneResizeEvent = setTimeout(() => {
                this.$emit('resizeDone');
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

    private setEqMin(elWidth: number): void {
        // width >= XL
        if (elWidth >= ElementQueriesBpMin.XL) {
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
        if (elWidth >= ElementQueriesBpMin.L) {
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
        if (elWidth >= ElementQueriesBpMin.M) {
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
        if (elWidth >= ElementQueriesBpMin.S) {
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
        if (elWidth >= ElementQueriesBpMin.XS) {
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

    private setEqMax(elWidth: number): void {
        // width <= XL
        if (elWidth <= ElementQueriesBpMax.XL) {
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
        if (elWidth <= ElementQueriesBpMax.L) {
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
        if (elWidth <= ElementQueriesBpMax.M) {
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
        if (elWidth <= ElementQueriesBpMax.S) {
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
        if (elWidth <= ElementQueriesBpMax.XS) {
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

    private setEq(elWidth: number): void {
        // width >= minM && width <= maxL
        if (elWidth >= ElementQueriesBpMin.M && elWidth <= ElementQueriesBpMax.L) {
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
        if (elWidth >= ElementQueriesBpMin.S && elWidth <= ElementQueriesBpMax.M) {
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
        if (elWidth >= ElementQueriesBpMin.XS && elWidth <= ElementQueriesBpMax.S) {
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
