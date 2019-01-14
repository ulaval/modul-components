import { toArray } from './enum';

enum MyTestEnum {
    Test1 = 'test1',
    Test2 = 'test2',
    Test3 = 'test3'
}

describe('enum.toArray', () => {
    it('returns the converted enum to array', () => {
        let result: { key: string | number, value: string }[] = toArray(MyTestEnum);

        expect(result.length).toEqual(3);
        expect(result[0]).toMatchObject({ key: 'Test1', value: 'test1' });
        expect(result[1]).toMatchObject({ key: 'Test2', value: 'test2' });
        expect(result[2]).toMatchObject({ key: 'Test3', value: 'test3' });
    });
});
