import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import { MButtonSkin } from '../../button/button';
import { SLIDE_TRANSITION_NAME } from '../../component-names';
import { MNavbarSkin } from '../../navbar/navbar';
import SlideTransitionPlugin, { MSlideTransitionDirection } from './slide-transition';

Vue.use(SlideTransitionPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${SLIDE_TRANSITION_NAME}`, module)

    .add('Tabs example', () => ({
        data: () => ({
            selectedTabIndex: 1,
            direction: MSlideTransitionDirection.LeftToRight,
            nbParagraphe: 1,
            nbTab: 7,
            skinNavbar: MNavbarSkin.TabLight,
            disabledTransiton: false,
            buttonSkin: MButtonSkin.Secondary
        }),
        methods: {
            showTab(newIndex): void {
                let _this: any = this as any;
                _this.direction = (newIndex < _this.selectedTabIndex) ? MSlideTransitionDirection.LeftToRight : MSlideTransitionDirection.RightToLeft;
                _this.selectedTabIndex = newIndex;
                _this.nbParagraphe = (_this.selectedTabIndex % 2) === 0 ? 4 : newIndex;
            }
        },
        template: `
        <div>
            <m-navbar :selected="selectedTabIndex"
                      :skin="skinNavbar">
                <m-navbar-item v-for="index in nbTab"
                               :key="index"
                               :value="index"
                               @click="showTab(index)">
                    Tab {{index}}
                </m-navbar-item>
            </m-navbar>
            <m-slide-transition :direction="direction"
                                :disabled="disabledTransiton">
                <div v-for="index in nbTab"
                     :key="index"
                     v-if="selectedTabIndex === index"
                     class="m-u--margin-top">
                    <h3 class="m-u--no-margin">Tab {{index}}</h3>
                    <p v-for="index in nbParagraphe"
                       :key="index">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A laudantium odio ipsum, quae quos cum dolor, omnis perferendis, veritatis deleniti iusto consectetur? Impedit tempora quam ab laborum maiores sapiente earum?</p>
                </div>
            </m-slide-transition>
            <div class="m-u--margin-top--m">
                <m-button @click="nbTab++"
                          :disabled="nbTab === 12">Add tab</m-button>
                <m-button :skin="buttonSkin"
                          class="m-u--margin-left"
                          :disabled="nbTab === 2"
                          @click="nbTab--">Delete tab</m-button>
                <m-button :skin="buttonSkin"
                          class="m-u--margin-left"
                          @click="disabledTransiton = !disabledTransiton">{{disabledTransiton ? 'Enabled' : 'Disabled'}} transition</m-button>
            </div>
        </div>`
    }));
