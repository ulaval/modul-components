import * as Lint from 'tslint';
import * as ts from 'typescript';

const FAILURE_STRING: string = 'Return type must be explicitly declared';

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(
            new MustHaveReturnTypeWalker(sourceFile, this.getOptions())
        );
    }
}

class MustHaveReturnTypeWalker extends Lint.RuleWalker {
    public visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (!node.type) {
            this.reportMissingReturnType(node, node.body);
        }
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        if (!node.type) {
            this.reportMissingReturnType(node, node.body);
        }
    }

    private reportMissingReturnType(node: ts.Node, body: ts.FunctionBody | undefined): void {
        if (body) {
            const fix = Lint.Replacement.appendText(body.pos, ': void');
            this.addFailure(
                this.createFailure(
                    node.getStart(),
                    node.getWidth(),
                    FAILURE_STRING,
                    fix
                )
            );
        }
    }
}
