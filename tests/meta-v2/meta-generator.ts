import Project, { ClassDeclaration, ClassInstancePropertyTypes, Decorator, LanguageService, ModuleKind, ObjectLiteralExpression, PropertyAssignment, PropertyDeclaration, ScriptTarget, SourceFile, Type, TypeChecker } from 'ts-simple-ast';

import { Meta, MetaProps } from './meta-model';

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
 */
export class MetaGenerator {

    private project: Project;
    private sourceFile: SourceFile;
    private typeChecker: TypeChecker;
    private languageService: LanguageService;

    constructor(sourceFileName: string) {

        this.project = new Project({
            compilerOptions: {
                target: ScriptTarget.ES5,
                module: ModuleKind.None
            }
        });

        this.sourceFile = this.project.addExistingSourceFileIfExists(sourceFileName);
        this.typeChecker = this.project.getTypeChecker();
        this.languageService = this.project.getLanguageService();

    }

    /**
     *
     */
    public generateMeta(): Meta {
        let output: Meta = {};

        let classDeclarations: ClassDeclaration[] = this.sourceFile.getClasses();
        classDeclarations.forEach((classDeclaration: ClassDeclaration) => {

            let componentDecorator: Decorator = classDeclaration.getDecorator(COMPONENT_DECORATOR_NAME);

            // Decorators with parenthesis (ex. @decorator(3)) are decorator factories,
            // while decorators without (ex. @decorator) are not.
            if (componentDecorator && componentDecorator.isDecoratorFactory()) {
                output.mixins = this.extractorMixinsFromComponentDecorator(componentDecorator);
                // tslint:disable-next-line:no-console
            }

            output.props = this.extractMetaPropFromClass(classDeclaration);

        });

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

    private extractMetaPropFromClass(classDeclaration: ClassDeclaration): MetaProps[] {

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

            let name: string = classInstancePropertyTypes.getName();
            let type: Type = classInstancePropertyTypes.getType();
            let propDecorator: Decorator = classInstancePropertyTypes.getDecorator(PROP_DECORATOR_NAME);

            return {
                name: name,
                type: type.getText(),
                values: this.getTypeTypesAsStrings(type.compilerType),
                default: this.extractDefaultValueFromPropDecorator(propDecorator)
            };
        }, this);
    }

    private extractDefaultValueFromPropDecorator(propDecorator: Decorator): string {
        let _default: string = '';
        propDecorator.getArguments().forEach((argument) => {
            if (argument instanceof ObjectLiteralExpression) {
                let arg: ObjectLiteralExpression = argument as ObjectLiteralExpression;
                if (arg.getProperty(DEFAULT_PROPERTY_NAME)) {
                    _default = (arg.getProperty(DEFAULT_PROPERTY_NAME) as PropertyAssignment).getInitializer().getText();
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
