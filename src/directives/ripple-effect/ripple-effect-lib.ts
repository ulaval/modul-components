import { RIPPLE_EFFECT_NAME } from '../directive-names';

export class RippleEffect {

    private clickEl: HTMLElement;
    private rippleEl: HTMLElement;
    private el: HTMLElement;
    private rippleELStyle;
    private boundingRectEl;
    private positionX: number;
    private positionY: number;
    private maxWidth: number;
    private dimension: number;

    public initRipple(event: MouseEvent, el: HTMLElement, isActive: boolean) {
        this.rippleEl = document.createElement('span');
        this.rippleELStyle = this.rippleEl.style;
        this.clickEl = event.target as HTMLElement;
        this.boundingRectEl = el.getBoundingClientRect();
        if (isActive) {
            this.clickEl.style.position = 'relative';
            el.style.overflow = 'hidden';
            this.addRipple(event);
        }
    }

    private addRipple(event: MouseEvent) {
        this.setPosition(event);
        this.setStyle();
        this.clickEl.appendChild(this.rippleEl);
        this.setStyleAnimation();
        this.removeRipple(event);
    }

    private setPosition(event) {
        this.positionX = event.offsetX;

        if (this.positionX !== undefined) {
            this.positionY = event.offsetY;
        } else {
            this.positionX = event.clientX - this.boundingRectEl.left;
            this.positionY = event.clientY - this.boundingRectEl.top;
        }

        if (this.boundingRectEl.width === this.boundingRectEl.height) {
            this.maxWidth = this.boundingRectEl.width * 1.412;
        } else {
            this.maxWidth = Math.sqrt(
                (this.boundingRectEl.width * this.boundingRectEl.width) + (this.boundingRectEl.height * this.boundingRectEl.height)
            );
        }
        this.dimension = (this.maxWidth * 2);
    }

    private setStyle() {
        this.rippleEl.className = RIPPLE_EFFECT_NAME;
        this.rippleELStyle.position = 'absolute';
        this.rippleELStyle.borderRadius = '50%';

        this.rippleELStyle.width = this.dimension + 'px';
        this.rippleELStyle.height = this.dimension + 'px';
        this.rippleELStyle.left = -this.maxWidth + this.positionX + 'px';
        this.rippleELStyle.top = -this.maxWidth + this.positionY + 'px';

        this.rippleELStyle.pointerEvents = 'none';
        this.rippleELStyle.userSelect = 'none';
        this.rippleELStyle.borderRadius = '50%';
        this.rippleELStyle.backgroundColor = '#CCFAFF';
        this.rippleELStyle.backgroundClip = 'padding-box';
        this.rippleELStyle.opacity = '0.2';
        this.rippleELStyle.transform = 'scale(0)';
        this.rippleELStyle.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    }

    private setStyleAnimation() {
        setTimeout(() => {
            this.rippleEl.className += ' enter-active';
            this.rippleELStyle.opacity = '0.4';
            this.rippleELStyle.transform = 'scale(1)';
        }, 0);
    }

    private removeRipple(event: MouseEvent) {
        let releaseEvent = (event.type === 'mousedown' ? 'mouseup' : 'touchend');

        let release = () => {
            document.removeEventListener(releaseEvent, release);
            this.rippleEl.className = RIPPLE_EFFECT_NAME + ' leave-active';
            this.rippleELStyle.opacity = '0';
            setTimeout(() => {
                this.rippleEl.remove();
            }, 450);
        };
        document.addEventListener(releaseEvent, release);
    }
}

const RippleEffectLib = new RippleEffect();

export default RippleEffectLib;
