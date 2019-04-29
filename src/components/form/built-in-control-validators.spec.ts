import { FormControl } from "../../utils/form/form-control";
import { FormGroup } from "../../utils/form/form-group";
import { BetweenValidator, CompareValidator, EmailValidator, MaxLengthValidator, MaxValidator, MinLengthValidator, MinValidator, RequiredValidator } from "./built-in-control-validators";

describe('Required validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        'test',
        [RequiredValidator('test')]
    );

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return false if value is empty array', () => {
        formControl.value = [];
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return false is value is empty string', () => {
        formControl.value = '';
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return true if value is 0', () => {
        formControl.value = 0;
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return true if value is set', () => {
        formControl.value = 'test';
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });
});

describe('Min length validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        'test',
        [MinLengthValidator('test', 3)]
    );

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return false if value is empty string', () => {
        formControl.value = '';
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return true if is longer', () => {
        formControl.value = '1234';
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return true is same', () => {
        formControl.value = '123';
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return true if number length is longer', () => {
        formControl.value = 1234;
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return false if array length is smaller', () => {
        formControl.value = [];
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return true if array length is longer', () => {
        formControl.value = [1, 2, 3, 4];
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });
});

describe('Max length validator', () => {
    let formControl: FormControl<any> = new FormControl<any>(
        'test',
        [MaxLengthValidator('test', 3)]
    );

    test('it should return true if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return true if value is empty string', () => {
        formControl.value = '';
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return false if is longer', () => {
        formControl.value = '1234';
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return true is same', () => {
        formControl.value = '123';
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return true if number length is shorter', () => {
        formControl.value = 12;
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    test('it should return false if array length is longer', () => {
        formControl.value = [1, 2, 3, 4];
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return true if array length is shorter', () => {
        formControl.value = [1, 2];
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });
});

describe('Min validator', () => {
    let formControl: FormControl<any>;

    beforeAll(() => {
        formControl = new FormControl<any>(
            'test',
            [MinValidator('test', 3)]
        );
    })

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    describe('number value', () => {
        beforeAll(() => {
            formControl = new FormControl<number>(
                'test',
                [MinValidator('test', 3)]
            );
        });

        test('it should return false if value is 0 and min value is higher', () => {
            formControl.value = 0;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is 0 and min value is lower', () => {
            const formControlTest0: FormControl<number> = new FormControl<number>(
                'test',
                [MinValidator('test', -1)],
                {
                    initialValue: 0
                }
            );

            formControlTest0.validate();

            expect(formControlTest0.isValid).toBe(true);
        });

        test('it should return false if value is lower', () => {
            formControl.value = 1;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is same', () => {
            formControl.value = 3;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is higher', () => {
            formControl.value = 4;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });
    });

    describe('date value', () => {
        beforeAll(() => {
            formControl = new FormControl<Date>(
                'test',
                [MinValidator('test', new Date(2019, 0, 1))]
            );
        });

        test('it should return false if value is lower', () => {
            formControl.value = new Date(2018, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is same', () => {
            formControl.value = new Date(2019, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is higher', () => {
            formControl.value = new Date(2019, 1, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });
    });
});

describe('Max validator', () => {
    let formControl: FormControl<any>;

    beforeAll(() => {
        formControl = new FormControl<any>(
            'test',
            [MaxValidator('test', 3)]
        );
    });

    test('it should return true if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });

    describe('number value', () => {
        beforeAll(() => {
            formControl = new FormControl<number>(
                'test',
                [MaxValidator('test', 3)]
            );
        });

        test('it should return true if value is 0 and max value is higher', () => {
            formControl.value = 0;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return false if value is 0 and max value is lower', () => {
            const formControlTest0: FormControl<number> = new FormControl<number>(
                'test',
                [MaxValidator('test', -1)],
                {
                    initialValue: 0
                }
            );

            formControlTest0.validate();

            expect(formControlTest0.isValid).toBe(false);
        });

        test('it should return true if value is lower', () => {
            formControl.value = 1;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is same', () => {
            formControl.value = 3;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return false if value is higher', () => {
            formControl.value = 4;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });
    });

    describe('date value', () => {
        beforeAll(() => {
            formControl = new FormControl<Date>(
                'test',
                [MaxValidator('test', new Date(2019, 0, 1))]
            );
        });

        test('it should return true if value is lower', () => {
            formControl.value = new Date(2018, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is same', () => {
            formControl.value = new Date(2019, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return false if value is higher', () => {
            formControl.value = new Date(2019, 1, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });
    });
});

describe('between validator', () => {
    let formControl: FormControl<any>;

    beforeAll(() => {
        formControl = new FormControl<any>(
            'test',
            [BetweenValidator('test', 1, 3)]
        );
    });

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    describe('number value', () => {
        beforeAll(() => {
            formControl = new FormControl<number>(
                'test',
                [BetweenValidator('test', 1, 3)]
            );
        });

        test('it should return false if value is lower than the lower bound', () => {
            formControl.value = -1;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return false if value is higher than the upper bound', () => {
            formControl.value = 4;
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is between the bounds', () => {
            formControl.value = 2;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the lower bound', () => {
            formControl.value = 1;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the upper bound', () => {
            formControl.value = 3;
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is 0 and between the bounds', () => {
            let formControlTest0: FormControl<number> = new FormControl<number>(
                'test',
                [BetweenValidator('test', -1, 1)],
                {
                    initialValue: 0
                }
            );

            formControlTest0.validate();
            expect(formControlTest0.isValid).toBe(true);
        });
    });

    describe('date value', () => {
        beforeAll(() => {
            formControl = new FormControl<Date>(
                'test',
                [BetweenValidator('test', new Date(2019, 0, 1), new Date(2019, 1, 1))]
            );
        });

        test('it should return false if value is lower than the lower bound', () => {
            formControl.value = new Date(2018, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return false if value is higher than the upper bound', () => {
            formControl.value = new Date(2020, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(false);
        });

        test('it should return true if value is between the bounds', () => {
            formControl.value = new Date(2019, 0, 2);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the lower bound', () => {
            formControl.value = new Date(2019, 0, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });

        test('it should return true if value is equal to the upper bound', () => {
            formControl.value = new Date(2019, 1, 1);
            formControl.validate();
            expect(formControl.isValid).toBe(true);
        });
    });
});

describe('email validator', () => {
    let formControl: FormControl<string>;

    beforeAll(() => {
        formControl = new FormControl<string>(
            'test',
            [EmailValidator()]
        );
    });

    test('it should return false if value is undefined', () => {
        expect(formControl.value).toBe(undefined);
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return false with invalid email', () => {
        formControl.value = 'test';
        formControl.validate();
        expect(formControl.isValid).toBe(false);
    });

    test('it should return true with valid email', () => {
        formControl.value = 'test@test.ulaval.ca';
        formControl.validate();
        expect(formControl.isValid).toBe(true);
    });
});

describe('compare validator', () => {
    let formGroup: FormGroup;

    beforeAll(() => {
        formGroup = new FormGroup(
            'test group',
            [CompareValidator(['test 1', 'test 2', 'test 3'])],
            [
                new FormControl<string>('test 1', []),
                new FormControl<string>('test 2', []),
                new FormControl<string>('test 3', [])
            ]
        );
    });

    test('it should return true if all controls are undefined', () => {
        expect((formGroup.getControl('test 1') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test 2') as FormControl<string>).value).toBe(undefined);
        expect((formGroup.getControl('test 3') as FormControl<string>).value).toBe(undefined);

        formGroup.validate();

        expect(formGroup.isValid).toBe(true);
    });

    test('it should return false if one value is different', () => {
        (formGroup.getControl('test 1') as FormControl<string>).value = 'test';

        formGroup.validate();

        expect(formGroup.isValid).toBe(false);
    });

    test('it should return true if all values are the same', () => {
        (formGroup.getControl('test 1') as FormControl<string>).value = 'test';
        (formGroup.getControl('test 2') as FormControl<string>).value = 'test';
        (formGroup.getControl('test 3') as FormControl<string>).value = 'test';

        formGroup.validate();

        expect(formGroup.isValid).toBe(true);
    });
});
