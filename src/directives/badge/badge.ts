import Vue, { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BADGE } from '../directive-names';
import { MIcon } from '../../components/icon/icon';
import { MIconFile } from '../../components/icon-file/icon-file';
import { ComponentMeta } from '../../meta/meta';

// Icon state
enum MBadgeState {
    Empty = 'empty',
    Completed = 'completed',
    Failed = 'failed'
}

type BadgeIcon = {
    [key: string]: string
};

const ICON_COMPLETED: string = 'chip-check';
const ICON_FAILED: string = 'chip-error';
const COLOR_COMPLETED: string = '#00c77f';
const COLOR_FAILED: string = '#e30513';

const BADGE_ICON: BadgeIcon = {
    [MBadgeState.Completed]: ICON_COMPLETED,
    [MBadgeState.Failed]: ICON_FAILED
};

const BADGE_COLOR: BadgeIcon = {
    [MBadgeState.Completed]: COLOR_COMPLETED,
    [MBadgeState.Failed]: COLOR_FAILED
};

const getBadgeOrigin: (vnode: VNode) => String[] = (vnode: VNode) => {
    let elTag = (vnode.componentOptions as ComponentMeta).tag;
    let elID;
    if (elTag == 'm-icon') {
        elID = (vnode.componentInstance as MIcon).name;
    } else if (elTag == 'm-icon-file') {
        elID = (vnode.componentInstance as MIconFile).spriteId;
    }

    if ((document.getElementById(elID) as HTMLElement).dataset.badgeOrigin != undefined) {
        return (((document.getElementById(elID) as HTMLElement).dataset.badgeOrigin) as string).split(',');
    } else {
        return ['23.5', '23.5'];
    }
};

interface BadgeOffset {
    x: number;
    y: number;
}
const getBadgeOffset: (binding: VNodeDirective) => BadgeOffset = (binding: VNodeDirective) => {
    let offsetX = 0;
    let offsetY = 0;
    // Badge offsetX settings
    if (binding.value.offsetX != undefined) {
        offsetX = parseInt(binding.value.offsetX, 10);
    }
    // Badge offsetY settings
    if (binding.value.offsetY != undefined) {
        offsetY = parseInt(binding.value.offsetY, 10);
    }
    return { x: offsetX, y: offsetY };
};

interface BadgePosition {
    size: number;
    leftDistance: number;
    topDistance: number;
}
const getBadgePosition: (element: HTMLElement, binding: VNodeDirective, vnode: VNode) => BadgePosition = (element: HTMLElement, binding: VNodeDirective, vnode: VNode) => {
    let leftDistance;
    let topDistance;
    let badgeOrigin = getBadgeOrigin(vnode);
    let badgeOffset = getBadgeOffset(binding);
    let elSize = parseInt((vnode.componentOptions as ComponentMeta)['propsData']['size'], 10);
    let badgeSize = elSize * (16 / 30);
    let elLeftOrigin = Number(parseFloat(badgeOrigin[0].replace(/,/g, '.')).toFixed(2));
    let elTopOrigin = Number(parseFloat(badgeOrigin[1].replace(/,/g, '.')).toFixed(2));
    if (elSize == 24) {
        leftDistance = elLeftOrigin - (badgeSize * 0.5) + badgeOffset.x;
        topDistance = elTopOrigin - (badgeSize * (2 / 3)) + badgeOffset.y;
    } else {
        let elWidth = parseInt(element.attributes['width']['value'], 10);
        let elHeight = parseInt(element.attributes['height']['value'], 10);
        leftDistance = ((elLeftOrigin / 24) * elWidth) - (badgeSize * 0.5) + badgeOffset.x;
        topDistance = ((elTopOrigin / 24) * elHeight) - (badgeSize * (2 / 3)) + badgeOffset.y;
    }
    return { size: badgeSize , leftDistance, topDistance };
};

const buildBadge = (element, binding, vnode) => {
    element.style.overflow = 'visible';

    let badge = getBadgePosition(element, binding, vnode);
    const MyComponent = Vue.extend({
        template: `<m-icon
                        :name="'${BADGE_ICON[binding.value.state]}'"
                        :size="'${badge.size}'"
                        x="${badge.leftDistance}"
                        y="${badge.topDistance}">
                    </m-icon>`
    });

    const component = new MyComponent().$mount();
    component.$el.style.color = BADGE_COLOR[binding.value.state];
    element.appendChild(component.$el);
};

const MBadgeDirective: DirectiveOptions = {
    bind(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        buildBadge(element, binding, vnode);
    },
    update(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        element.removeChild(element.children[element.children.length - 1]);
        buildBadge(element, binding, vnode);
    },
    unbind(
        element: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        element.removeChild(element.children[element.children.length - 1]);
    }
};

const BadgePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(BADGE, MBadgeDirective);
    }
};

export default BadgePlugin;
