import { DirectiveOptions, VNodeDirective, VNode, PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BADGE } from '../directive-names';
import { MIcon } from '../../components/icon/icon';

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
        let elWidth = parseInt(el.attributes['width']['value'], 10);
        let elHeight = parseInt(el.attributes['height']['value'], 10);
        let elID = (vnode.componentInstance as MIcon).name;
        let elFormat = (document.getElementById(elID) as HTMLElement).dataset.format;
        el.style.overflow = 'visible';

        let iconInstance = new MIcon({
            el: document.createElement('span')
        });

        // Badge settings
        let badgeSise = elWidth / (30 / 16) ;
        let portraitRatio = (24 / 18);
        let landscapeRatio = (24 / 18);
        let offsetX = 0;
        let offsetY = 0;

        if (binding.value.state != undefined) {
            iconInstance.name = BADGE_ICON[binding.value.state];
            iconInstance.$el.style.color = BADGE_COLOR[binding.value.state];
        }

        if (binding.value.offsetX != undefined) {
            offsetX = parseInt(binding.value.offsetX, 10);
        }

        if (binding.value.offsetY != undefined) {
            offsetY = parseInt(binding.value.offsetY, 10);
        }

        iconInstance.size = badgeSise + 'px';

        if (elFormat != undefined) {
            if (elFormat == 'portrait') {
                let leftDistance = (elWidth - ((elWidth - (elWidth / portraitRatio)) * 0.5) - (badgeSise / 2)) + offsetX;
                let topDistance = (elHeight - (badgeSise * 0.5)) + offsetY;
                iconInstance.$el.setAttribute('x', leftDistance + 'px');
                iconInstance.$el.setAttribute('y', topDistance + 'px');
            } else if (elFormat == 'landscape') {
                let leftDistance = (elWidth - (badgeSise * 0.5)) + offsetX;
                let topDistance = (elHeight - ((elHeight - (elHeight / landscapeRatio)) * 0.5) - (badgeSise / 2)) + offsetY;
                iconInstance.$el.setAttribute('x', leftDistance + 'px');
                iconInstance.$el.setAttribute('y', topDistance + 'px');
            } else {
                console.error('Svg data-format is not recognized for the svg having the id #' + elID + '');
            }
        } else {
            let leftDistance = (elWidth - (badgeSise * 0.5)) + offsetX;
            let topDistance = (elHeight - (badgeSise * 0.5)) + offsetY;
            iconInstance.$el.setAttribute('x', leftDistance + 'px');
            iconInstance.$el.setAttribute('y', topDistance + 'px');
        }

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
