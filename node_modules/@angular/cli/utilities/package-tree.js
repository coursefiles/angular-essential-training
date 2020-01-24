"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function readPackageTree(path) {
    const rpt = require('read-package-tree');
    return new Promise((resolve, reject) => {
        rpt(path, (e, data) => {
            if (e) {
                reject(e);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.readPackageTree = readPackageTree;
function findNodeDependencies(root, node = root) {
    const actual = node.isLink ? node.target : node;
    const rawDeps = {
        ...actual.package.dependencies,
        ...actual.package.devDependencies,
        ...actual.package.peerDependencies,
    };
    return Object.entries(rawDeps).reduce((deps, [name, version]) => {
        const depNode = root.children.find(child => {
            return child.name === name && !child.isLink && child.parent === node;
        });
        deps[name] = depNode || version;
        return deps;
    }, {});
}
exports.findNodeDependencies = findNodeDependencies;
