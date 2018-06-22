import { shallow, Wrapper } from '@vue/test-utils';

import ErrorTemplatePlugin, { MErrorTemplate } from './error-template';

let wrapper: Wrapper<MErrorTemplate>;

// const getMocks = () => {
//     return {
//     };
// };

const getStubs: any = () => {
    return {
    };
};

const initializeWrapper: any = () => {
    wrapper = shallow(MErrorTemplate, {
        // mocks: getMocks(),
        stubs: getStubs(),
        mixins: [{
            data: { },
            methods: { }
        }]
    });
};

describe(``, () => {
    describe(``, () => {
        describe(``, () => {
            it(``, () => {
                initializeWrapper();

            });
        });
    });
});
// tests : passer n'importe quoi comme type
// aucune valeurs dans errorDate : donne date courante
// valeur fournir pour errorDate : donne date fournie
// userAgent donne userAgent courant (mocké)
// dateInfo : vérifier date bien formattée?
// détecter que le message est bien passé ? throw quelque chose sinon?
// affiche un hint
// affiche plusieurs hint
// m-accordion présent si displayErrorDetails true
// --reference number présent si non undefined
// --reference number absent si undefined
// --dateInfo affiché
// --stack affichée si non undefined
// --stack absente si undefined
// m-accordion absent si displayErrorDetails false
// affiche un link si présent
// affiche plusieurs link si présents
// un test de snapshot

// les tests pour chacune des pages suivantes seront surement juste un snapshot + test de quelques méthodes...

/***************** tests transférés depuis error-message.spec.ts et améliorés *******************/
// import { mount, Wrapper } from '@vue/test-utils';
// import moment from 'moment';
// import Vue from 'vue';

// import { addMessages } from '../../../tests/helpers/lang';
// import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
// import uuid from '../../utils/uuid/uuid';
// import ErrorMessagePlugin, { MErrorMessage } from './error-message';

// jest.mock('../../utils/uuid/uuid');
// (uuid.generate as jest.Mock).mockReturnValue('uuid');

// const MOCK_USER_AGENT: string = 'modul-user-agent';
// describe('MErrorMessage', () => {
//     beforeEach(() => {
//         Vue.use(ErrorMessagePlugin);
//         addMessages(Vue, ['components/error-message/error-message.lang.fr.json']);

//         Object.defineProperty(window.navigator, 'userAgent', { value: MOCK_USER_AGENT, configurable: true });
//     });

//     it('should render correctly collapsed', () => {
//         const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
//             localVue: Vue
//         });

//         expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
//     });

//     it('should render correctly expanded', () => {
//         const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
//             localVue: Vue,
//             propsData: {
//                 date: moment('2018-01-02T00:01:02'),
//                 referenceNumber: '123456879'
//             },
//             stubs: {
//                 'm-accordion': WrapChildrenStub('div')
//             }
//         });

//         expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
//     });

//     describe('given error', () => {
//         it('should render correctly expanded', () => {
//             const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
//                 localVue: Vue,
//                 propsData: {
//                     date: moment('2018-01-02T00:01:02'),
//                     referenceNumber: '123456879',
//                     error: {
//                         message: 'An error message'
//                     }
//                 },
//                 stubs: {
//                     'm-accordion': WrapChildrenStub('div')
//                 }
//             });

//             expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
//         });

//         it('should render correctly expanded with stack trace on', () => {
//             const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
//                 localVue: Vue,
//                 propsData: {
//                     date: moment('2018-01-02T00:01:02'),
//                     referenceNumber: '123456879',
//                     error: {
//                         message: 'An error message'
//                     },
//                     stacktrace: true
//                 },
//                 stubs: {
//                     'm-accordion': WrapChildrenStub('div')
//                 }
//             });

//             expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
//         });
//     });

//     describe('given error with stack trace', () => {
//         it('should render correctly expanded', () => {
//             const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
//                 localVue: Vue,
//                 propsData: {
//                     date: moment('2018-01-02T00:01:02'),
//                     referenceNumber: '123456879',
//                     error: {
//                         message: 'An error message',
//                         stack: 'This is a stack trace'
//                     }
//                 },
//                 stubs: {
//                     'm-accordion': WrapChildrenStub('div')
//                 }
//             });

//             expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
//         });

//         it('should render correctly expanded with stack trace on', () => {
//             const error: Wrapper<MErrorMessage> = mount(MErrorMessage, {
//                 localVue: Vue,
//                 propsData: {
//                     date: moment('2018-01-02T00:01:02'),
//                     referenceNumber: '123456879',
//                     error: {
//                         message: 'An error message',
//                         stack: 'This is a stack trace'
//                     },
//                     stacktrace: true
//                 },
//                 stubs: {
//                     'm-accordion': WrapChildrenStub('div')
//                 }
//             });

//             expect(renderComponent(error.vm)).resolves.toMatchSnapshot();
//         });
//     });
// });
