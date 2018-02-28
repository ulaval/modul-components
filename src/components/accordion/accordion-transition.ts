import Vue, { VNode, VNodeData } from 'vue';

interface MAccordionTransitionProps {
    heightDelta?: number;
}

export const MAccordionTransition = Vue.extend({
    functional: true,
    render(createElement, context): VNode {
        let data: VNodeData = {
            props: {
                name: 'accordion'
            },
            on: {
                enter(el: HTMLElement): void {
                    const props: MAccordionTransitionProps = context.props as MAccordionTransitionProps;
                    const heightDelta = props.heightDelta
                        ? props.heightDelta
                        : 0;

                    el.style.height = el.scrollHeight - heightDelta + 'px';
                },
                afterEnter(el: HTMLElement): void {
                    el.style.removeProperty('height');
                },
                beforeLeave(el: HTMLElement): void {
                    el.style.height = el.scrollHeight + 'px';
                },
                afterLeave(el: HTMLElement): void {
                    el.style.removeProperty('height');
                }
            }
        };
        return createElement('transition', data, context.children);
    }
});
