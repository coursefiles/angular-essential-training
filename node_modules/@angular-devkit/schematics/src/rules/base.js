"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exception_1 = require("../exception/exception");
const host_tree_1 = require("../tree/host-tree");
const interface_1 = require("../tree/interface");
const scoped_1 = require("../tree/scoped");
const static_1 = require("../tree/static");
const call_1 = require("./call");
/**
 * A Source that returns an tree as its single value.
 */
function source(tree) {
    return () => tree;
}
exports.source = source;
/**
 * A source that returns an empty tree.
 */
function empty() {
    return () => static_1.empty();
}
exports.empty = empty;
/**
 * Chain multiple rules into a single rule.
 */
function chain(rules) {
    return (tree, context) => {
        return rules.reduce((acc, curr) => {
            return call_1.callRule(curr, acc, context);
        }, rxjs_1.of(tree));
    };
}
exports.chain = chain;
/**
 * Apply multiple rules to a source, and returns the source transformed.
 */
function apply(source, rules) {
    return context => call_1.callRule(chain(rules), call_1.callSource(source, context), context);
}
exports.apply = apply;
/**
 * Merge an input tree with the source passed in.
 */
function mergeWith(source, strategy = interface_1.MergeStrategy.Default) {
    return (tree, context) => {
        const result = call_1.callSource(source, context);
        return result.pipe(operators_1.map(other => static_1.merge(tree, other, strategy || context.strategy)));
    };
}
exports.mergeWith = mergeWith;
function noop() {
    return (tree, _context) => tree;
}
exports.noop = noop;
function filter(predicate) {
    return ((tree) => {
        if (host_tree_1.HostTree.isHostTree(tree)) {
            return new host_tree_1.FilterHostTree(tree, predicate);
        }
        else {
            throw new exception_1.SchematicsException('Tree type is not supported.');
        }
    });
}
exports.filter = filter;
function asSource(rule) {
    return apply(empty(), [rule]);
}
exports.asSource = asSource;
function branchAndMerge(rule, strategy = interface_1.MergeStrategy.Default) {
    return (tree, context) => {
        const branchedTree = static_1.branch(tree);
        return call_1.callRule(rule, rxjs_1.of(branchedTree), context)
            .pipe(operators_1.last(), operators_1.map(t => static_1.merge(tree, t, strategy)));
    };
}
exports.branchAndMerge = branchAndMerge;
function when(predicate, operator) {
    return (entry) => {
        if (predicate(entry.path, entry)) {
            return operator(entry);
        }
        else {
            return entry;
        }
    };
}
exports.when = when;
function partitionApplyMerge(predicate, ruleYes, ruleNo) {
    return (tree, context) => {
        const [yes, no] = static_1.partition(tree, predicate);
        if (!ruleNo) {
            // Shortcut.
            return call_1.callRule(ruleYes, rxjs_1.of(static_1.partition(tree, predicate)[0]), context)
                .pipe(operators_1.map(yesTree => static_1.merge(yesTree, no, context.strategy)));
        }
        return call_1.callRule(ruleYes, rxjs_1.of(yes), context)
            .pipe(operators_1.concatMap(yesTree => {
            return call_1.callRule(ruleNo, rxjs_1.of(no), context)
                .pipe(operators_1.map(noTree => static_1.merge(yesTree, noTree, context.strategy)));
        }));
    };
}
exports.partitionApplyMerge = partitionApplyMerge;
function forEach(operator) {
    return (tree) => {
        tree.visit((path, entry) => {
            if (!entry) {
                return;
            }
            const newEntry = operator(entry);
            if (newEntry === entry) {
                return;
            }
            if (newEntry === null) {
                tree.delete(path);
                return;
            }
            if (newEntry.path != path) {
                tree.rename(path, newEntry.path);
            }
            if (!newEntry.content.equals(entry.content)) {
                tree.overwrite(newEntry.path, newEntry.content);
            }
        });
        return tree;
    };
}
exports.forEach = forEach;
function composeFileOperators(operators) {
    return (entry) => {
        let current = entry;
        for (const op of operators) {
            current = op(current);
            if (current === null) {
                // Deleted, just return.
                return null;
            }
        }
        return current;
    };
}
exports.composeFileOperators = composeFileOperators;
function applyToSubtree(path, rules) {
    return (tree, context) => {
        const scoped = new scoped_1.ScopedTree(tree, path);
        return call_1.callRule(chain(rules), rxjs_1.of(scoped), context).pipe(operators_1.map(result => {
            if (result === scoped) {
                return tree;
            }
            else {
                throw new exception_1.SchematicsException('Original tree must be returned from all rules when using "applyToSubtree".');
            }
        }));
    };
}
exports.applyToSubtree = applyToSubtree;
