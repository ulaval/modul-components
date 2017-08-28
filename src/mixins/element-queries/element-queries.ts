import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

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

    private resizeSensor: ResizeSensor;

    protected mounted(): void {
        this.resizeElement(this.$el);
        this.resizeSensor = new ResizeSensor(this.$el, () => this.resizeElement(this.$el));
    }
    protected destroyed(): void {
        this.resizeSensor.detach();
    }

    private resizeElement(el: HTMLElement): void {
        this.checkMinWidth(el);
        this.checkMaxWidth(el);
        this.checkMinMaxWidth(el);
    }

    private checkMinWidth(el: HTMLElement): void {
        // width >= XL
        if (el.clientWidth >= ElementQueriesBpMin.XL) {
            if (!this.isEqMinXL) {
                this.isEqMinXL = true;
            }
        } else {
            if (this.isEqMinXL) {
                this.isEqMinXL = false;
            }
        }

        // width >= L
        if (el.clientWidth >= ElementQueriesBpMin.L) {
            if (!this.isEqMinL) {
                this.isEqMinL = true;
            }
        } else {
            if (this.isEqMinL) {
                this.isEqMinL = false;
            }
        }

        // width >= M
        if (el.clientWidth >= ElementQueriesBpMin.M) {
            if (!this.isEqMinM) {
                this.isEqMinM = true;
            }
        } else {
            if (this.isEqMinM) {
                this.isEqMinM = false;
            }
        }

        // width >= S
        if (el.clientWidth >= ElementQueriesBpMin.S) {
            if (!this.isEqMinS) {
                this.isEqMinS = true;
            }
        } else {
            if (this.isEqMinS) {
                this.isEqMinS = false;
            }
        }

        // width >= XS
        if (el.clientWidth >= ElementQueriesBpMin.XS) {
            if (!this.isEqMinXS) {
                this.isEqMinXS = true;
            }
        } else {
            if (this.isEqMinXS) {
                this.isEqMinXS = false;
            }
        }
    }

    private checkMaxWidth(el: HTMLElement): void {
        // width <= XL
        if (el.clientWidth <= ElementQueriesBpMax.XL) {
            if (!this.isEqMaxXL) {
                this.isEqMaxXL = true;
            }
        } else {
            if (this.isEqMaxXL) {
                this.isEqMaxXL = false;
            }
        }

        // width <= L
        if (el.clientWidth <= ElementQueriesBpMax.L) {
            if (!this.isEqMaxL) {
                this.isEqMaxL = true;
            }
        } else {
            if (this.isEqMaxL) {
                this.isEqMaxL = false;
            }
        }

        // width <= M
        if (el.clientWidth <= ElementQueriesBpMax.M) {
            if (!this.isEqMaxM) {
                this.isEqMaxM = true;
            }
        } else {
            if (this.isEqMaxM) {
                this.isEqMaxM = false;
            }
        }

        // width <= S
        if (el.clientWidth <= ElementQueriesBpMax.S) {
            if (!this.isEqMaxS) {
                this.isEqMaxS = true;
            }
        } else {
            if (this.isEqMaxS) {
                this.isEqMaxS = false;
            }
        }

        // width <= XS
        if (el.clientWidth <= ElementQueriesBpMax.XS) {
            if (!this.isEqMaxXS) {
                this.isEqMaxXS = true;
            }
        } else {
            if (this.isEqMaxXS) {
                this.isEqMaxXS = false;
            }
        }
    }

    private checkMinMaxWidth(el: HTMLElement): void {
        // width >= minM && width <= maxL
        if (el.clientWidth >= ElementQueriesBpMin.M && el.clientWidth <= ElementQueriesBpMax.L) {
            if (!this.isEqL) {
                this.isEqL = true;
            }
        } else {
            if (this.isEqL) {
                this.isEqL = false;
            }
        }

        // width >= minS && width <= maxM
        if (el.clientWidth >= ElementQueriesBpMin.S && el.clientWidth <= ElementQueriesBpMax.M) {
            if (!this.isEqM) {
                this.isEqM = true;
            }
        } else {
            if (this.isEqM) {
                this.isEqM = false;
            }
        }

        // width >= minXS && width <= maxS
        if (el.clientWidth >= ElementQueriesBpMin.XS && el.clientWidth <= ElementQueriesBpMax.S) {
            if (!this.isEqS) {
                this.isEqS = true;
            }
        } else {
            if (this.isEqS) {
                this.isEqS = false;
            }
        }
    }

}
