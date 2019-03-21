export class Enums {
    static toValueArray<T>(enumType: T): string[] {
        return Object.keys(enumType).map(key => enumType[key]);
    }

    static toKeyValueArray<T>(enumType: T): { key: any, value: string }[] {
        return Object.keys(enumType).map(key => ({ key, value: enumType[key] }));
    }
}
