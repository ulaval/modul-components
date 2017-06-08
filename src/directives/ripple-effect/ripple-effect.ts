import Vue from 'vue';
import { PluginObject } from 'vue';
import { RIPPLE_EFFECT_NAME } from '../directive-names';

export class MRippleEffect extends Vue {

    public bind(element: HTMLElement, binding) {
        let isActif: boolean = binding.value == undefined ? true : binding.value;
        let el: HTMLElement = element;

        if (el) {
            el.addEventListener('mousedown', (event: MouseEvent) => {
                if (isActif) {
                    let rippleEl: HTMLElement = document.createElement('span');
                    let rippleELStyle = rippleEl.style;
                    let elClick = (event.target as HTMLElement);
                    el.style.overflow = 'hidden';

                    let elBoundingRect = el.getBoundingClientRect();

                    let positionX: number = event.offsetX;
                    let positionY: number;

                    elClick.style.position = 'relative';

                    if (positionX !== undefined) {
                        positionY = event.offsetY;
                    } else {
                        positionX = event.clientX - elBoundingRect.left;
                        positionY = event.clientY - elBoundingRect.top;
                    }

                    let max: number;

                    if (elBoundingRect.width === elBoundingRect.height) {
                        max = elBoundingRect.width * 1.412;
                    } else {
                        max = Math.sqrt(
                            (elBoundingRect.width * elBoundingRect.width) + (elBoundingRect.height * elBoundingRect.height)
                        );
                    }

                    let dimension = (max * 2) + 'px';
                    let rippleElClassName: string = RIPPLE_EFFECT_NAME;

                    rippleEl.className = rippleElClassName;
                    rippleELStyle.position = 'absolute';
                    rippleELStyle.borderRadius = '50%';

                    rippleELStyle.width = dimension;
                    rippleELStyle.height = dimension;
                    rippleELStyle.left = -max + positionX + 'px';
                    rippleELStyle.top = -max + positionY + 'px';

                    rippleELStyle.pointerEvents = 'none';
                    rippleELStyle.userSelect = 'none';
                    rippleELStyle.borderRadius = '50%';
                    rippleELStyle.backgroundColor = '#CCFAFF';
                    rippleELStyle.backgroundClip = 'padding-box';
                    rippleELStyle.opacity = '0.2';
                    rippleELStyle.transform = 'scale(0)';
                    rippleELStyle.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

                    elClick.appendChild(rippleEl);

                    setTimeout(() => {
                        rippleEl.className += ' enter-active';
                        rippleELStyle.opacity = '0.4';
                        rippleELStyle.transform = 'scale(1)';
                    }, 0);

                    let releaseEvent = (event.type === 'mousedown' ? 'mouseup' : 'touchend');

                    let release = () => {
                        document.removeEventListener(releaseEvent, release);
                        rippleEl.className = rippleElClassName + ' leave-active';
                        rippleELStyle.opacity = '0';
                        setTimeout(() => {
                            rippleEl.remove();
                        }, 450);
                    };
                    document.addEventListener(releaseEvent, release);
                }
            });
        }
    }

    public unbind(element: HTMLElement) {
        if (element) {
            element.removeEventListener('mousedown', () => false, false);
        }
    }
}

const RippleEffectPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(RIPPLE_EFFECT_NAME, new MRippleEffect());
    }
};

export default RippleEffectPlugin;
