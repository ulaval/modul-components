import Vue, { PluginObject } from 'vue';

// this create a webpack context of all required file that end with sandbox.ts
export const sandboxRequiredContext: any = require.context('../../src', true, /\.sandbox.ts$/);

export function getSandboxesNames(): string[] {
    return sandboxRequiredContext.keys().map((filename) => {

        const indexStart: number = filename.lastIndexOf('/');
        const indexEnd: number = filename.indexOf('.sandbox.ts');

        return filename.substring(indexStart + 1, indexEnd);
    });
}


export function getSandboxPlugin(): PluginObject<any> {
    return {
        install(v, options): void {
            sandboxRequiredContext.keys().forEach((filename) => {
                // Required the sandbox plugin (should be the default export)
                const sandBoxPlugin: any = sandboxRequiredContext(filename).default;

                Vue.use(sandBoxPlugin);
            });
        }
    };
}
