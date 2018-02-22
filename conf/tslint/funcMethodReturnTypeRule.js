"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var FAILURE_STRING = 'Return type must be explicitly declared';
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MustHaveReturnTypeWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var MustHaveReturnTypeWalker = /** @class */ (function (_super) {
    __extends(MustHaveReturnTypeWalker, _super);
    function MustHaveReturnTypeWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MustHaveReturnTypeWalker.prototype.visitMethodDeclaration = function (node) {
        if (!node.type) {
            this.reportMissingReturnType(node, node.body);
        }
    };
    MustHaveReturnTypeWalker.prototype.visitFunctionDeclaration = function (node) {
        if (!node.type) {
            this.reportMissingReturnType(node, node.body);
        }
    };
    MustHaveReturnTypeWalker.prototype.reportMissingReturnType = function (node, body) {
        var fix = Lint.Replacement.appendText(body.pos, ': void');
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING, fix));
    };
    return MustHaveReturnTypeWalker;
}(Lint.RuleWalker));
