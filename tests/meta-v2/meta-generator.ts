import Project, { ClassDeclaration, ClassInstancePropertyTypes, Decorator, Expression, LanguageService, ObjectLiteralExpression, PropertyAssignment, PropertyDeclaration, SourceFile, SyntaxKind, Type, TypeChecker } from 'ts-simple-ast';

import { Meta, MetaComponent, MetaProps } from '../../src/meta/v2';

const MIXINS_PROPERTY_NAME: string = 'mixins';
const COMPONENT_DECORATOR_NAME: string = 'Component';
const PROP_DECORATOR_NAME: string = 'Prop';
const DEFAULT_PROPERTY_NAME: string = 'default';
/**
 * Extract static meta from a TS file using the typescript compiler API
 *
 * @ref: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 * @ref: https://github.com/dsherret/ts-simple-ast
 * @ref: https://ts-ast-viewer.com/
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
        // this.project.addExistingSourceFile('src/components/accordion/accordion.ts');

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
                let componentDecorator: Decorator = classDeclaration.getDecorator(COMPONENT_DECORATOR_NAME);

                // If the class has the @Component decorator
                if (componentDecorator) {
                    output.components.push(this.generateComponentMeta(classDeclaration));
                }

            });
        });

        return output;
    }
    /**
     *
     */
    public generateComponentMeta(classDeclaration: ClassDeclaration): MetaComponent {
        let output: MetaComponent = {
            componentName: classDeclaration.getName()
        };

        let componentDecorator: Decorator = classDeclaration.getDecorator(COMPONENT_DECORATOR_NAME);

        // Decorators with parenthesis (ex. @decorator(3)) are decorator factories,
        // while decorators without (ex. @decorator) are not.
        if (componentDecorator.isDecoratorFactory()) {
            // extract initializer from @component
            output.mixins = this.extractorMixinsFromComponentDecorator(componentDecorator);
        }

        output.props = this.extractMetaPropsFromClass(classDeclaration);

        return output;
    }

    private extractorMixinsFromComponentDecorator(decorator: Decorator): string[] {

        let result: string[] = [];

        decorator.getArguments().forEach((argument) => {
            if (argument instanceof ObjectLiteralExpression) {
                // tslint:disable-next-line:no-console
                if ((argument as ObjectLiteralExpression).getProperty(MIXINS_PROPERTY_NAME)) {
                    // tslint:disable-next-line:no-console
                    let mixins: string = ((argument as ObjectLiteralExpression).getProperty(MIXINS_PROPERTY_NAME) as PropertyAssignment).getInitializer().getText();
                    if (mixins) {
                        result = mixins.replace(/\[?\]?\r?\n?/g, '').split(',').map((str) => str.trim());
                    }
                }
            }
        });

        return result;
    }

    private extractMetaPropsFromClass(classDeclaration: ClassDeclaration): MetaProps[] {

        // Get a list of all annotated @props
        let propertyDeclarationWithProps: ClassInstancePropertyTypes[] = classDeclaration.getInstanceProperties().filter((property: PropertyDeclaration) => {
            let propDecorator: Decorator = property.getDecorator(PROP_DECORATOR_NAME);
            if (propDecorator) {
                return true;
            }
            return false;
        });

        // extract name and type from prop.
        return propertyDeclarationWithProps.map((classInstancePropertyTypes: ClassInstancePropertyTypes) => {

            return this.extractMetaPropFromPropertyTypes(classInstancePropertyTypes);
        }, this);
    }

    private extractMetaPropFromPropertyTypes(classInstancePropertyTypes: ClassInstancePropertyTypes): MetaProps {
        let name: string = classInstancePropertyTypes.getName();
        let type: Type = classInstancePropertyTypes.getType();

        let output: MetaProps = {
            name: name,
            type: type.getNonNullableType().getText().split('.').pop(),
            optional: type.isNullable()
        };

        // extact values of non nullable enum literal type
        if (type.getNonNullableType().isEnumLiteral()) {
            output.values = this.getTypeTypesAsStrings(type.getNonNullableType().compilerType);
        }

        let propDecorator: Decorator = classInstancePropertyTypes.getDecorator(PROP_DECORATOR_NAME);
        if (propDecorator.isDecoratorFactory()) {
            let defaultValue: string = this.extractDefaultValueFromPropDecorator(propDecorator);
            if (defaultValue) {
                output.default = defaultValue;
                output.optional = true; // props is optional if have a default value
            }
        }

        return output;
    }

    private extractDefaultValueFromPropDecorator(propDecorator: Decorator): string {
        let _default: string = '';
        propDecorator.getArguments().forEach((argument) => {
            if (argument instanceof ObjectLiteralExpression) {
                let arg: ObjectLiteralExpression = argument as ObjectLiteralExpression;
                if (arg.getProperty(DEFAULT_PROPERTY_NAME)) {

                    let initializer: Expression = (arg.getProperty(DEFAULT_PROPERTY_NAME) as PropertyAssignment).getInitializer();
                    // we dont want arrow function here
                    if (initializer.getKind() !== SyntaxKind.ArrowFunction) {
                        _default = initializer.getText().split('.').pop();
                    } else {
                        _default = initializer.getText();
                    }

                }

            }
        });
        return _default;
    }

    private getTypeAsString(type): string {

        if (type.getSymbol()) {
            return type.getSymbol().getName();
        }
        return type.intrinsicName;

    }

    private getTypeTypesAsStrings(type): string[] {
        if (type.types) {
            return type.types.map((type) => this.getTypeAsString(type));
        }
        return [];
    }

}
