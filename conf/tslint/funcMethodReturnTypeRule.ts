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
    public visitMethodDeclaration(node: ts.MethodDeclaration) {
        if (!node.type) {
            this.reportMissingReturnType(node, node.body);
        }
    }

    public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        if (!node.type) {
            this.reportMissingReturnType(node, node.body);
        }
    }

    private reportMissingReturnType(node: ts.Node, body: ts.FunctionBody) {
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
