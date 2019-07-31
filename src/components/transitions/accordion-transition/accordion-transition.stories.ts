import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import { MButtonSkin } from '../../button/button';
import { ACCORDION_TRANSITION_NAME } from '../../component-names';
import AccordionTransitionPlugin from './accordion-transition';

Vue.use(AccordionTransitionPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${ACCORDION_TRANSITION_NAME}`, module)
    .add('Accordion example', () => ({
        data: () => ({
            open: true,
            disabledTransition: false,
            buttonSkin: MButtonSkin.Secondary
        }),
        methods: {
            toggleOpen(): void {
                let _this: any = this as any;
                _this.open = !_this.open;
            },
            toggleDisabledTransition(): void {
                let _this: any = this as any;
                _this.disabledTransition = !_this.disabledTransition;
            }
        },
        template: `
        <div>
            <div>
                <m-button @click="toggleOpen()">
                    {{open ? 'Close' : 'Open'}} accordion
                </m-button>
                <m-button class="m-u--margin-left"
                          :skin="buttonSkin"
                          @click="toggleDisabledTransition()">
                    {{disabledTransition ? 'Enabled' : 'Disabled'}} transition
                </m-button>
            </div>
            <m-accordion-transition :disabled="disabledTransition">
                <div v-if="open">
                    <p v-for="index in 4"
                       :key="index">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A laudantium odio ipsum, quae quos cum dolor, omnis perferendis, veritatis deleniti iusto consectetur? Impedit tempora quam ab laborum maiores sapiente earum?</p>
                </div>
            </m-accordion-transition>
        </div>`
    }));
