import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { AVATAR_NAME } from '../component-names';
import AvatarPlugin from './avatar';

Vue.use(AvatarPlugin);

const image192: string = 'http://placekitten.com/192/192';

storiesOf(`${componentsHierarchyRootSeparator}${AVATAR_NAME}`, module)
    .add('Small', () => ({
        template: `<m-avatar pixel-size="32"></m-avatar>`
    }))
    .add('Large', () => ({
        template: `<m-avatar pixel-size="192"></m-avatar>`
    }))
    .add('Image slot', () => ({
        template: `<m-avatar pixel-size="192"><img slot="avatar" src="${image192}"></m-avatar>`
    }))
    .add('Svg slot', () => ({
        template: `<m-avatar pixel-size="192"><m-icon slot="avatar" name="m-svg__profile" :size="192"></m-icon></m-avatar>`
    }))
    .add('Clickable', () => ({
        template: `<m-avatar pixel-size="192" :clickable="true"><img slot="avatar" src="${image192}"></m-avatar>`
    }))
    .add('Custom slot - animation', () => ({
        template: `<m-avatar pixel-size="192" :clickable="true">
                        <img slot="avatar" src="${image192}">
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

