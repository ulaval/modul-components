import * as ts from 'typescript';

import { Meta } from './meta-model';

/**
 * Extract meta from a TS file using typescript compiler API
 *
 * @ref: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 * @ref: https://ts-ast-viewer.com/
 */
export class MetaGenerator {

    private program: ts.Program;
    private checker: ts.TypeChecker;

    constructor(sourceFileName: string) {

        this.program = ts.createProgram([sourceFileName], {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.None
        });

        // Get the checker, we will use it to find more about classes
        this.checker = this.program.getTypeChecker();

    }

    public generateMeta(): Meta {
        let output: Meta = {};

        // Get the main source file
        const sourceFile: any = this.program.getSourceFile(this.program.getRootFileNames()[0]);

        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, (node: any) => {
            this.visitClassComponent(node);
        });

        return output;
    }

    visitClassComponent(node: any): void {

        if (ts.isClassDeclaration(node) && node.name) {

            if (this.isClassAComponent(node)) {
                let symbol: any = this.checker.getSymbolAtLocation(node.name);

                // tslint:disable-next-line:no-console
                console.log(`**** visit class component with name ${symbol.getName()}`);

                this.visitComponentDecorator(node);

                // This is a Class, visit its children
                ts.forEachChild(node, (node: any) => {
                    this.visitProps(node);
                });
            }

        }
    }

    visitProps(node: ts.Node): void {

        if (ts.isPropertyDeclaration(node) && node.name) {

            if (this.isPropertyAPropOrModel(node)) {
                let symbol: any = this.checker.getSymbolAtLocation(node.name);

                let type: any = this.checker.getTypeAtLocation(node);
                const typeName: string = this.getTypeAsString(type);
                const typeValues: string[] = this.getTypeTypesAsStrings(type);
                // tslint:disable-next-line:no-console
                console.log(`**** visiting prop with name ${symbol.getName()} of type ${typeName} possible values = ${JSON.stringify(typeValues)}`);
            }

        }
    }

    private isClassAComponent(node: any): boolean {
        if (node.decorators && node.decorators.length > 0) {
            let componentDecorator: ts.Decorator = node.decorators.find((decorator: ts.Decorator) => {
                return (decorator.getText() && (decorator.getText().startsWith('@Component')));
            });

            if (componentDecorator) {
                return true;
            }
        }
        return false;
    }

    private visitComponentDecorator(node: any): any {
        if (node.decorators && node.decorators.length > 0) {
            let componentDecorator: ts.Decorator = node.decorators.find((decorator: ts.Decorator) => {
                return (decorator.getText() && (decorator.getText().startsWith('@Component')));
            });

            if (ts.isCallLikeExpression(componentDecorator.expression)) {
                if ((componentDecorator.expression as ts.CallExpression).arguments[0]) {
                    //get the first arguments and parse it
                    //(componentDecorator.expression as ts.CallExpression).arguments[0].
                }
            }
        }
    }

    private isPropertyAPropOrModel(node): boolean {
        if (node.decorators && node.decorators.length > 0) {
            if (node.decorators.find((decorator: ts.Decorator) => {

                return (decorator.getText() && (decorator.getText().startsWith('@Prop') || decorator.getText().startsWith('@Model')));
            }), this) {
                return true;
            }
        }
        return false;
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
