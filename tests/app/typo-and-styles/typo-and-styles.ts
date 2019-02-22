import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import WithRender from './typo-and-styles.html';

@WithRender
@Component
export class TypoAndStylesTest extends Vue {
}
