import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BADGE } from '../directive-names';
import { MIcon } from '../../components/icon/icon';
import { MIconFile } from '../../components/icon-file/icon-file';
import { ComponentMeta } from '../../meta/meta';

// Icon state
export enum MBadgeState {
    Completed = 'completed',
    Error = 'error'
}
// Icon name
export const ICON_COMPLETED: string = 'chip-check';
export const ICON_ERROR: string = 'chip-error';
// Icon color
export const COLOR_COMPLETED: string = '#00c77f';
export const COLOR_ERROR: string = '#e30513';
// Badge icon type
export type BadgeIcon = {
    [key: string]: string
};

const BADGE_ICON: BadgeIcon = {
    [MBadgeState.Completed]: ICON_COMPLETED,
    [MBadgeState.Error]: ICON_ERROR
};

const BADGE_COLOR: BadgeIcon = {
    [MBadgeState.Completed]: COLOR_COMPLETED,
    [MBadgeState.Error]: COLOR_ERROR
};

const MBadgeDirective: DirectiveOptions = {
    bind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {

        // Element data
        let elSize = parseInt((vnode.componentOptions as ComponentMeta)['propsData']['size'], 10);
        let elWidth = parseInt(el.attributes['width']['value'], 10);
        let elHeight = parseInt(el.attributes['height']['value'], 10);
        let elTag = (vnode.componentOptions as ComponentMeta).tag;
        let elID;
        if (elTag == 'm-icon') {
            elID = (vnode.componentInstance as MIcon).name;
        } else if (elTag == 'm-icon-file') {
            elID = (vnode.componentInstance as MIconFile).spriteId;
        }
        let elBadgeOrigin;
        if ((document.getElementById(elID) as HTMLElement).dataset.badgeOrigin != undefined) {
            elBadgeOrigin = (((document.getElementById(elID) as HTMLElement).dataset.badgeOrigin) as string).split(',');
        } else {
            elBadgeOrigin = ['23.5','23.5'];
        }

        let elLeftOrigin = Number(parseFloat(elBadgeOrigin[0].replace(/,/g, '.')).toFixed(2));
        let elTopOrigin = Number(parseFloat(elBadgeOrigin[1].replace(/,/g, '.')).toFixed(2));

        el.style.overflow = 'visible';

        let iconInstance = new MIcon({
            el: document.createElement('span')
        });

        // Badge settings
        let badgeSize = elSize * (16 / 30) ;
        let offsetX = 0;
        let offsetY = 0;
        // Badge state settings
        if (binding.value.state != undefined) {
            iconInstance.name = BADGE_ICON[binding.value.state];
            iconInstance.$el.style.color = BADGE_COLOR[binding.value.state];
        }
        // Badge offsetX settings
        if (binding.value.offsetX != undefined) {
            offsetX = parseInt(binding.value.offsetX, 10);
        }
        // Badge offsetY settings
        if (binding.value.offsetY != undefined) {
            offsetY = parseInt(binding.value.offsetY, 10);
        }
        // Set badge size
        iconInstance.size = badgeSize + 'px';
        // Set badge position
        if (elSize == 24) {
            let leftDistance = elLeftOrigin - (badgeSize * 0.5) + offsetX;
            let topDistance = elTopOrigin - (badgeSize * (2 / 3)) + offsetY;
            iconInstance.$el.setAttribute('x', leftDistance + '');
            iconInstance.$el.setAttribute('y', topDistance + '');
        } else {
            let leftDistance = ((elLeftOrigin / 24) * elWidth) - (badgeSize * 0.5) + offsetX;
            let topDistance = ((elTopOrigin / 24) * elHeight) - (badgeSize * (2 / 3)) + offsetY;
            iconInstance.$el.setAttribute('x', leftDistance + '');
            iconInstance.$el.setAttribute('y', topDistance + '');
        }
        // Adding the badge on the element
        el.appendChild(iconInstance.$el);
    },
    unbind(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode,
        oldVnode: VNode
    ): void {
        //
    }
};

const BadgePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(BADGE, MBadgeDirective);
    }
};

export default BadgePlugin;
