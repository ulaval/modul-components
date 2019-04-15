import Vue, { DirectiveOptions, PluginObject, VNode, VNodeDirective, VueConstructor } from 'vue';
import { MIconFile } from '../../components/icon-file/icon-file';
import { MIcon } from '../../components/icon/icon';
import { ComponentMeta } from '../../meta/meta';
import { BADGE_NAME } from '../directive-names';

// Icon state
export enum MBadgeState {
    Completed = 'completed',
    Error = 'error',
    Warning = 'warning'
}

type BadgeIcon = {
    [key: string]: string
};

const ICON_COMPLETED: string = 'm-svg__completed-filled';
const ICON_ERROR: string = 'm-svg__error-filled';
const ICON_WARNING: string = 'm-svg__warning-filled';
const COLOR_COMPLETED: string = '#00c77f';
const COLOR_ERROR: string = '#e30513';
const COLOR_WARNING: string = '#ffc103';

const DEFAULT_ORIGIN: string[] = ['23.5', '23.5'];

const BADGE_SIZE_RATIO: number = 16 / 30;

const BADGE_ICON: BadgeIcon = {
    [MBadgeState.Completed]: ICON_COMPLETED,
    [MBadgeState.Error]: ICON_ERROR,
    [MBadgeState.Warning]: ICON_WARNING
};

const BADGE_COLOR: BadgeIcon = {
    [MBadgeState.Completed]: COLOR_COMPLETED,
    [MBadgeState.Error]: COLOR_ERROR,
    [MBadgeState.Warning]: COLOR_WARNING
};

const getBadgeOrigin: (vnode: VNode) => String[] = (vnode: VNode) => {
    let elTag: string = (vnode.componentOptions as ComponentMeta).tag;
    let elID: string = '';
    if (elTag === 'm-icon') {
        elID = (vnode.componentInstance as MIcon).name;
    } else if (elTag === 'm-icon-file') {
        elID = (vnode.componentInstance as MIconFile).spriteId;
    }

    const element: HTMLElement = document.getElementById(elID) as HTMLElement;
    if (element && element.dataset && element.dataset.badgeOrigin) {
        return (((document.getElementById(elID) as HTMLElement).dataset.badgeOrigin) as string).split(',');
    } else {
        return DEFAULT_ORIGIN;
    }
};

interface BadgeOffset {
    x: number;
    y: number;
}
const getBadgeOffset: (binding: VNodeDirective) => BadgeOffset = (binding: VNodeDirective) => {
    return {
        x: binding.value.offsetX !== undefined ? parseInt(binding.value.offsetX, 10) : 0,
        y: binding.value.offsetY !== undefined ? parseInt(binding.value.offsetY, 10) : 0
    };
};

interface BadgePosition {
    size: number;
    leftDistance: number;
    topDistance: number;
}
const getBadgePosition: (element: HTMLElement, binding: VNodeDirective, vnode: VNode) => BadgePosition = (element: HTMLElement, binding: VNodeDirective, vnode: VNode) => {
    let leftDistance: number;
    let topDistance: number;
    let badgeOrigin: String[] = getBadgeOrigin(vnode);
    let badgeOffset: BadgeOffset = getBadgeOffset(binding);

    let elSize: number = (vnode.componentOptions as ComponentMeta)['propsData']['size'] ? parseInt((vnode.componentOptions as ComponentMeta)['propsData']['size'], 10) : (vnode.elm as HTMLElement).clientWidth;
    let badgeSize: number = elSize * BADGE_SIZE_RATIO;
    let elLeftOrigin: number = Number(parseFloat(badgeOrigin[0].replace(/,/g, '.')).toFixed(2));
    let elTopOrigin: number = Number(parseFloat(badgeOrigin[1].replace(/,/g, '.')).toFixed(2));

    leftDistance = ((elLeftOrigin / 24) * elSize) - (badgeSize * 0.5) + badgeOffset.x;
    topDistance = ((elTopOrigin / 24) * elSize) - (badgeSize * (2 / 3)) + badgeOffset.y;

    return { size: badgeSize, leftDistance, topDistance };
};

const buildBadge: (element, binding, vnode) => void = (element, binding, vnode) => {

    element.style.overflow = 'visible';

    let badge: BadgePosition = getBadgePosition(element, binding, vnode);
    const MyComponent: VueConstructor<Vue> = Vue.extend({
        template: `<m-icon
                        :name="'${BADGE_ICON[binding.value.state]}'"
                        :size="'${badge.size}'"
                        :x="${badge.leftDistance}"
                        :y="${badge.topDistance}">
                    </m-icon>`
    });

    Vue.nextTick(() => {
        const component: Vue = new MyComponent().$mount();
        (component.$el as HTMLElement).style.color = BADGE_COLOR[binding.value.state];
        element.appendChild(component.$el);
    });
};

const MBadgeDirective: DirectiveOptions = {
    inserted(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        if (binding.value.state !== undefined && binding.value.state !== '') {
            buildBadge(element, binding, vnode);
        }
    },
    update(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        if (element
            && element.children
            && element.children[element.children.length - 1] !== undefined
            && element.children[element.children.length - 1].classList.contains('m-icon')) {
            element.removeChild(element.children[element.children.length - 1]);
        }
        if (binding.value.state !== undefined && binding.value.state !== '') {
            buildBadge(element, binding, vnode);
        }
    },
    unbind(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        if (element
            && element.children
            && element.children[element.children.length - 1] !== undefined) {
            element.removeChild(element.children[element.children.length - 1]);
        }
    }
};

const BadgePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(BADGE_NAME, MBadgeDirective);
    }
};

export default BadgePlugin;
