import Vue from 'vue';
import '../../utils/polyfills';
import SteppersItemPlugin, { MSteppersItem } from './steppers-item';

const STATE_LOCKED_CSS: string = 'm--is-locked';
const STATE_PROGRESS_CSS: string = 'm--is-in-progress';

let step: MSteppersItem;
