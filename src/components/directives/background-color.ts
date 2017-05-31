import Vue from 'vue';

export class MBackgroundColor extends Vue {
    public bind(element: HTMLElement) {
        element.onclick = (ev: MouseEvent) => {
            (ev.target as HTMLElement).style.backgroundColor = 'lime';
        };
    }
}
