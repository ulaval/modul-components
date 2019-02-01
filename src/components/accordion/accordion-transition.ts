import Vue, { PluginObject, VNode, VNodeData, VueConstructor } from 'vue';
import { ACCORDION_TRANSITION_NAME } from '../component-names';


interface MAccordionTransitionProps {
    heightDelta?: number;
    transition?: boolean;
}

export const MAccordionTransition: VueConstructor<Vue> = Vue.extend({
    functional: true,
    render(createElement, context): VNode {
        const props: MAccordionTransitionProps = context.props as MAccordionTransitionProps;
        const CLASS_HAS_TRANSITION: string = 'm-accordion--has-transition';
        let data: VNodeData = {
            props: {
                name: 'm-accordion'
            },
            on: {
                beforeEnter(el: HTMLElement): void {
                    if (props.transition || props.transition === undefined) {
                        el.classList.add(CLASS_HAS_TRANSITION);
                    } else if (el.classList.contains(CLASS_HAS_TRANSITION)) {
                        el.classList.remove(CLASS_HAS_TRANSITION);
                    }
                },
                enter(el: HTMLElement): void {
                    const heightDelta: number = props.heightDelta
                        ? props.heightDelta
                        : 0;

                    el.style.height = el.scrollHeight - heightDelta + 'px';
                },
                afterEnter(el: HTMLElement): void {
                    el.style.removeProperty('height');
                },
                beforeLeave(el: HTMLElement): void {
                    el.style.height = parseInt((window.getComputedStyle(el).height as string), 10) + 'px';
                    if (props.transition === false && el.classList.contains(CLASS_HAS_TRANSITION)) {
                        el.classList.remove(CLASS_HAS_TRANSITION);
                    }
                },
                afterLeave(el: HTMLElement): void {
                    el.style.removeProperty('height');
                }
            }
        };
        return createElement('transition', data, context.children);
    }
});

const AccordionTransitionPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(ACCORDION_TRANSITION_NAME, MAccordionTransition);
    }
};

export default AccordionTransitionPlugin;
