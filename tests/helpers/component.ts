import Vue from 'vue';

export const resetModulPlugins: any = (keepI18n: boolean = true) => {
    let vueCstr: any = Vue as any;

    cleanComponentsOptions(vueCstr.options.components);

    const modulServices: any = Object.keys(vueCstr.prototype).filter(
        c => (!keepI18n || c !== '$i18n') && typeof vueCstr.prototype[c] === 'object' && c !== '$log'
    );
    modulServices.forEach(m => delete vueCstr.prototype[m]);
    vueCstr._installedPlugins = [];
};

const cleanComponentsOptions: any = components => {
    if (components) {
        cleanComponentsOptions(Object.getPrototypeOf(components));
        const modulComponents: any = Object.keys(components).filter(c =>
            c.startsWith('m-')
        );
        modulComponents.forEach(m => delete components[m]);
    }
};
