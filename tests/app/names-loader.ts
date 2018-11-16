export function getComponentsNames(): string[] {
    const componentsName: any = require('../../src/components/component-names');
    return Object.keys(componentsName).map((prop) => {
        return componentsName[prop];
    });
}

export function getDirectiveNames(): string[] {
    const directivesName: any = require('../../src/directives/directive-names');
    return Object.keys(directivesName).map((prop) => {
        return directivesName[prop];
    });
}

export function getFiltersNames(): string[] {
    const filtersName: any = require('../../src/filters/filter-names');
    return Object.keys(filtersName).map((prop) => {
        return filtersName[prop];
    });
}

export function getUtilsNames(): string[] {
    const utilsNames: any = require('../../src/utils/utils-names');
    return Object.keys(utilsNames).map((prop) => {
        return utilsNames[prop];
    });
}
