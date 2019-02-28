import * as fs from 'fs';
import * as parser from 'node-html-parser';
import Project, { ClassDeclaration, ClassInstanceMemberTypes, ClassInstancePropertyTypes, Decorator, Expression, LanguageService, MethodDeclaration, ObjectLiteralExpression, ParameterDeclaration, PropertyAssignment, SourceFile, StringLiteral, SyntaxKind, Type, TypeChecker } from 'ts-morph';
import { Meta, MetaComponent, MetaEvent, MetaProps, MetaSlot } from '../../src/meta/v2';


const MIXINS_PROPERTY_NAME: string = 'mixins';
const COMPONENT_DECORATOR_NAME: string = 'Component';
const PROP_DECORATOR_NAME: string = 'Prop';
const EMIT_DECORATOR_NAME: string = 'Emit';
const DEFAULT_PROPERTY_NAME: string = 'default';

const DEFAULT_ARROW_FUNCTION_VALUE: string = 'function()';

/**
 * Extract static meta from a TS file using the typescript compiler API
 * @see {@link https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API}
 * @see {@link https://github.com/dsherret/ts-simple-ast}
 * @see {@link https://ts-ast-viewer.com/}
 *
 */
export class MetaGenerator {

    private project: Project;
    private typeChecker: TypeChecker;
    private languageService: LanguageService;

    constructor() {

        this.project = new Project({
            tsConfigFilePath: './tsconfig.meta.json',
            addFilesFromTsConfig: true
        });

        // use this for test a specific file
        // this.project = new Project({
        //     tsConfigFilePath: './tsconfig.meta.json',
        //     addFilesFromTsConfig: false
        // });
        // this.project.addExistingSourceFile('src/components/datefields/datefields.ts');

        this.typeChecker = this.project.getTypeChecker();
        this.languageService = this.project.getLanguageService();

    }

    public generateMeta(): Meta {
        let output: Meta = {
            components: []
        };

        this.project.getSourceFiles().forEach((sourceFile: SourceFile) => {
            let classDeclarations: ClassDeclaration[] = sourceFile.getClasses();
            classDeclarations.forEach((classDeclaration: ClassDeclaration) => {
                let componentDecorator: Decorator | undefined = classDeclaration.getDecorator(COMPONENT_DECORATOR_NAME);

                // If the class has the @Component decorator
                if (componentDecorator) {
                    output.components.push(this.generateComponentMeta(classDeclaration, this.getTemplateAsString(`${sourceFile.getFilePath().slice(0, -3)}.html`)));
                }

            });
        });

        return output;
    }

    private getTemplateAsString(filePath: string): string {
        // get the template
        let template: string = '';
        try {
            template = fs.readFileSync(filePath, {
                encoding: 'utf8'
            });

        } catch (err) { }
        return template;
    }

    /**
     *
     */
    private generateComponentMeta(classDeclaration: ClassDeclaration, template: string): MetaComponent {
        // extract component name
        let output: MetaComponent = {
            componentName: classDeclaration.getName()!
        };

        let componentDecorator: Decorator = classDeclaration.getDecorator(COMPONENT_DECORATOR_NAME)!;

        output.mixins = this.extractorMixinsFromComponentDecorator(componentDecorator);

        output.props = this.extractMetaPropsFromClass(classDeclaration);

        output.events = this.extractMetaEventFromClass(classDeclaration);

        output.slots = template ? this.extractMetaSlotFromTemplate(template) : [];

        return output;
    }

    private extractorMixinsFromComponentDecorator(decorator: Decorator): string[] {

        let result: string[] = [];

        decorator.getArguments().forEach((argument) => {
            if (argument instanceof ObjectLiteralExpression) {
                if ((argument).getProperty(MIXINS_PROPERTY_NAME)) {
                    let mixins: string = ((argument).getProperty(MIXINS_PROPERTY_NAME) as PropertyAssignment).getInitializer()!.getText();
                    if (mixins) {
                        result = mixins.replace(/\[?\]?\r?\n?/g, '').split(',').map((str) => str.trim());
                    }
                }
            }
        });

        return result;
    }

    private extractMetaPropsFromClass(classDeclaration: ClassDeclaration): MetaProps[] {

        // Get a list of all instance properties annotated @props
        let propertyDeclarationWithProps: ClassInstancePropertyTypes[] = classDeclaration.getInstanceProperties().filter((classInstancePropertyTypes: ClassInstancePropertyTypes) => {
            return classInstancePropertyTypes.getDecorator(PROP_DECORATOR_NAME) !== undefined;
        });

        // extract name and type from prop.
        return propertyDeclarationWithProps.map((classInstancePropertyTypes: ClassInstancePropertyTypes) => {
            return this.extractMetaPropFromPropertyTypes(classInstancePropertyTypes);
        }, this);
    }

    private extractMetaEventFromClass(classDeclaration: ClassDeclaration): MetaEvent[] {
        // Get a list of all annotated methods @Emit
        let propertyDeclarationWithEmit: ClassInstanceMemberTypes[] = classDeclaration.getInstanceMembers().filter((instanceMember: ClassInstanceMemberTypes) => {
            if (instanceMember instanceof MethodDeclaration) {
                return instanceMember.getDecorator(EMIT_DECORATOR_NAME) !== undefined;
            }
            return false;
        });

        // extract name and type from prop.
        return propertyDeclarationWithEmit.map((classInstanceMemberTypes: ClassInstanceMemberTypes) => {

            let methodDeclaration: MethodDeclaration = classInstanceMemberTypes as MethodDeclaration;

            return this.extractMetaEventFromPropertyTypes(methodDeclaration);
        }, this);
    }

    private extractMetaSlotFromTemplate(template: string): MetaSlot[] {

        let metaSlots: MetaSlot[] = [];
        if (template) {
            const root: any = parser.parse(template);
            metaSlots = root.querySelectorAll('slot').map((slot: parser.HTMLElement) => {

                if (slot.attributes.name) {
                    // named slot
                    return {
                        name: slot.attributes.name,
                        isDefault: false
                    };
                } else {

                    // default slot
                    return {
                        name: 'default',
                        isDefault: true
                    };
                }
            });
        }

        return metaSlots;

    }

    private extractMetaPropFromPropertyTypes(classInstancePropertyTypes: ClassInstancePropertyTypes): MetaProps {
        let name: string = classInstancePropertyTypes.getName()!;
        let type: Type = classInstancePropertyTypes.getType();

        let output: MetaProps = {
            name: name,
            type: type.getNonNullableType().getText().split('.').pop()!,
            optional: type.isNullable()
        };

        // extact values of non nullable enum literal type
        if (type.getNonNullableType().isEnumLiteral()) {
            output.values = this.getTypeTypesAsStrings(type.getNonNullableType().compilerType);
        }

        let propDecorator: Decorator = classInstancePropertyTypes.getDecorator(PROP_DECORATOR_NAME)!;
        if (propDecorator.isDecoratorFactory()) {
            let defaultValue: string = this.extractDefaultValueFromPropDecorator(propDecorator);
            if (defaultValue) {
                output.default = defaultValue;
                output.optional = true; // props is optional if have a default value
            }
        }

        return output;
    }

    private extractMetaEventFromPropertyTypes(methodDeclaration: MethodDeclaration): MetaEvent {
        let output: MetaEvent = {
            name: ''
        };

        let metaDecorator: Decorator = methodDeclaration.getDecorator(EMIT_DECORATOR_NAME)!;

        // extract the name of event.
        if (metaDecorator.isDecoratorFactory() && metaDecorator.getArguments().length === 1) {
            let stringLitteral: StringLiteral = metaDecorator.getArguments()[0] as StringLiteral;
            output.name = stringLitteral.getLiteralValue();
        } else {
            throw new Error(`Problem while extracting metadata for method ${JSON.stringify(methodDeclaration.getText())}`);
        }

        // extract methods arguments
        if (methodDeclaration.getParameters() && methodDeclaration.getParameters().length > 0) {
            output.arguments = methodDeclaration.getParameters().map((parameterDeclaration: ParameterDeclaration) => {

                let name: string = parameterDeclaration.getName()!;
                let type: Type = parameterDeclaration.getType();

                return {
                    name,
                    type: type.getNonNullableType().getText().split('.').pop()!
                };
            });
        }

        return output;
    }

    private extractDefaultValueFromPropDecorator(propDecorator: Decorator): string {
        let _default: string = '';
        propDecorator.getArguments().forEach((argument) => {
            if (argument instanceof ObjectLiteralExpression) {
                let arg: ObjectLiteralExpression = argument;
                if (arg.getProperty(DEFAULT_PROPERTY_NAME)) {

                    let initializer: Expression = (arg.getProperty(DEFAULT_PROPERTY_NAME) as PropertyAssignment).getInitializer()!;

                    if (initializer.getKind() === SyntaxKind.ArrowFunction) {
                        _default = DEFAULT_ARROW_FUNCTION_VALUE;                    // we dont want arrow function here
                    } else {
                        if (initializer.getType().getNonNullableType()) {
                            _default = this.getTypeValueAsString(initializer.getType().getNonNullableType().compilerType) ? this.getTypeValueAsString(initializer.getType().getNonNullableType().compilerType) : initializer.getText();
                        } else {
                            _default = initializer.getText();
                        }
                    }

                }

            }
        });
        return _default;
    }

    private getTypeTypesAsStrings(type): string[] {
        if (type.types) {
            return type.types.map((type) => type.value);
        }
        return [];
    }

    private getTypeValueAsString(type): string {
        return type.value;
    }

}
