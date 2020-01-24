/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface PackageTreeNodeBase {
    name: string;
    path: string;
    realpath: string;
    error?: Error;
    id: number;
    isLink: boolean;
    package: {
        name: string;
        version: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
        'ng-update'?: {
            migrations?: string;
        };
    };
    children: PackageTreeNode[];
}
export interface PackageTreeActual extends PackageTreeNodeBase {
    isLink: false;
    parent?: PackageTreeActual;
}
export interface PackageTreeLink extends PackageTreeNodeBase {
    isLink: true;
    parent: null;
    target: PackageTreeActual;
}
export declare type PackageTreeNode = PackageTreeActual | PackageTreeLink;
export declare function readPackageTree(path: string): Promise<PackageTreeNode>;
export declare function findNodeDependencies(root: PackageTreeNode, node?: PackageTreeNode): Record<string, string | PackageTreeActual | undefined>;
