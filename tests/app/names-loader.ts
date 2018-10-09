export function getComponentsNames(): string[] {
    const componentsName: any = require('../../src/components/component-names');
    return Object.keys(componentsName).map((prop) => {
        // tslint:disable-next-line:no-console
        return componentsName[prop];
    });
}

export function getDirectiveNames(): string[] {
    const directivesName: any = require('../../src/directives/directive-names');
    return Object.keys(directivesName).map((prop) => {
        // tslint:disable-next-line:no-console
        return directivesName[prop];
    });
}

export function getFiltersNames(): string[] {
    const filtersName: any = require('../../src/filters/filter-names');
    return Object.keys(filtersName).map((prop) => {
        // tslint:disable-next-line:no-console
        return filtersName[prop];
    });
}
