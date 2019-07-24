import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { AVATAR_NAME } from '../component-names';
import AvatarPlugin, { MAvatarSize } from './avatar';

Vue.use(AvatarPlugin);

const image192: string = 'http://placekitten.com/192/192';

storiesOf(`${componentsHierarchyRootSeparator}${AVATAR_NAME}`, module)
    .add('Small', () => ({
        template: `<m-avatar></m-avatar>`
    }))
    .add('Medium', () => ({
        template: `<m-avatar :size="${MAvatarSize.MEDIUM}"></m-avatar>`
    }))
    .add('Large', () => ({
        template: `<m-avatar :size="${MAvatarSize.LARGE}"></m-avatar>`
    }))
    .add('Image slot', () => ({
        template: `<m-avatar :size="${MAvatarSize.LARGE}"><img src="${image192}"></m-avatar>`
    }))
    .add('Svg slot', () => ({
        template: `<m-avatar :size="${MAvatarSize.LARGE}"><m-icon name="m-svg__profile" :size="${MAvatarSize.LARGE}"></m-icon></m-avatar>`
    }))
    .add('Clickable', () => ({
        template: `<m-avatar :size="${MAvatarSize.LARGE}" :clickable="true"><img src="${image192}"></m-avatar>`
    }))
    .add('Custom slot - animation', () => ({
        template: `<m-avatar :size="${MAvatarSize.LARGE}" :clickable="true">
                        <div slot="content" slot-scope={hover} style="
                            transition: all 0.1s linear;
                            width: 100%;
                            text-align: center;
                            position: absolute;
                            bottom: -30%;
                            height: 30%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: #333;
                            color: white"
                            :style="[hover ? { 'transform': 'translateY(-100%)' } : {}]"
                        >
                            <span class="m-avatar__default-button">Edit</span>
                        </div>
                    </m-avatar>`
    }));

