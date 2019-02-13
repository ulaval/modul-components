export class Enums {
    static toValueArray<T>(enumType: T): string[] {
        return Object.keys(enumType).map(key => enumType[key]);
    }
}
