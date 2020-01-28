/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This file re-exports all symbols contained in this directory.
 *
 * Why is this file not `index.ts`?
 *
 * There seems to be an inconsistent path resolution of an `index.ts` file
 * when only the parent directory is referenced. This could be due to the
 * node module resolution configuration differing from rollup and/or typescript.
 *
 * With commit
 * https://github.com/angular/angular/commit/d5e3f2c64bd13ce83e7c70788b7fc514ca4a9918
 * the `instructions.ts` file was moved to `instructions/instructions.ts` and an
 * `index.ts` file was used to re-export everything. Having had file names that were
 * importing from `instructions' directly (not the from the sub file or the `index.ts`
 * file) caused strange CI issues. `index.ts` had to be renamed to `all.ts` for this
 * to work.
 *
 * Jira Issue = FW-1184
 */
export * from './alloc_host_vars';
export * from './change_detection';
export * from './container';
export * from './storage';
export * from './di';
export * from './element';
export * from './element_container';
export * from './embedded_view';
export * from './get_current_view';
export * from './listener';
export * from './namespace';
export * from './next_context';
export * from './projection';
export * from './property';
export * from './property_interpolation';
export * from './select';
export * from './styling';
export * from './text';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9pbnN0cnVjdGlvbnMvYWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxjQUFjLG1CQUFtQixDQUFDO0FBQ2xDLGNBQWMsb0JBQW9CLENBQUM7QUFDbkMsY0FBYyxhQUFhLENBQUM7QUFDNUIsY0FBYyxXQUFXLENBQUM7QUFDMUIsY0FBYyxNQUFNLENBQUM7QUFDckIsY0FBYyxXQUFXLENBQUM7QUFDMUIsY0FBYyxxQkFBcUIsQ0FBQztBQUNwQyxjQUFjLGlCQUFpQixDQUFDO0FBQ2hDLGNBQWMsb0JBQW9CLENBQUM7QUFDbkMsY0FBYyxZQUFZLENBQUM7QUFDM0IsY0FBYyxhQUFhLENBQUM7QUFDNUIsY0FBYyxnQkFBZ0IsQ0FBQztBQUMvQixjQUFjLGNBQWMsQ0FBQztBQUM3QixjQUFjLFlBQVksQ0FBQztBQUMzQixjQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGNBQWMsVUFBVSxDQUFDO0FBQ3pCLGNBQWMsV0FBVyxDQUFDO0FBQzFCLGNBQWMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKlxuICogVGhpcyBmaWxlIHJlLWV4cG9ydHMgYWxsIHN5bWJvbHMgY29udGFpbmVkIGluIHRoaXMgZGlyZWN0b3J5LlxuICpcbiAqIFdoeSBpcyB0aGlzIGZpbGUgbm90IGBpbmRleC50c2A/XG4gKlxuICogVGhlcmUgc2VlbXMgdG8gYmUgYW4gaW5jb25zaXN0ZW50IHBhdGggcmVzb2x1dGlvbiBvZiBhbiBgaW5kZXgudHNgIGZpbGVcbiAqIHdoZW4gb25seSB0aGUgcGFyZW50IGRpcmVjdG9yeSBpcyByZWZlcmVuY2VkLiBUaGlzIGNvdWxkIGJlIGR1ZSB0byB0aGVcbiAqIG5vZGUgbW9kdWxlIHJlc29sdXRpb24gY29uZmlndXJhdGlvbiBkaWZmZXJpbmcgZnJvbSByb2xsdXAgYW5kL29yIHR5cGVzY3JpcHQuXG4gKlxuICogV2l0aCBjb21taXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvY29tbWl0L2Q1ZTNmMmM2NGJkMTNjZTgzZTdjNzA3ODhiN2ZjNTE0Y2E0YTk5MThcbiAqIHRoZSBgaW5zdHJ1Y3Rpb25zLnRzYCBmaWxlIHdhcyBtb3ZlZCB0byBgaW5zdHJ1Y3Rpb25zL2luc3RydWN0aW9ucy50c2AgYW5kIGFuXG4gKiBgaW5kZXgudHNgIGZpbGUgd2FzIHVzZWQgdG8gcmUtZXhwb3J0IGV2ZXJ5dGhpbmcuIEhhdmluZyBoYWQgZmlsZSBuYW1lcyB0aGF0IHdlcmVcbiAqIGltcG9ydGluZyBmcm9tIGBpbnN0cnVjdGlvbnMnIGRpcmVjdGx5IChub3QgdGhlIGZyb20gdGhlIHN1YiBmaWxlIG9yIHRoZSBgaW5kZXgudHNgXG4gKiBmaWxlKSBjYXVzZWQgc3RyYW5nZSBDSSBpc3N1ZXMuIGBpbmRleC50c2AgaGFkIHRvIGJlIHJlbmFtZWQgdG8gYGFsbC50c2AgZm9yIHRoaXNcbiAqIHRvIHdvcmsuXG4gKlxuICogSmlyYSBJc3N1ZSA9IEZXLTExODRcbiAqL1xuZXhwb3J0ICogZnJvbSAnLi9hbGxvY19ob3N0X3ZhcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vY29udGFpbmVyJztcbmV4cG9ydCAqIGZyb20gJy4vc3RvcmFnZSc7XG5leHBvcnQgKiBmcm9tICcuL2RpJztcbmV4cG9ydCAqIGZyb20gJy4vZWxlbWVudCc7XG5leHBvcnQgKiBmcm9tICcuL2VsZW1lbnRfY29udGFpbmVyJztcbmV4cG9ydCAqIGZyb20gJy4vZW1iZWRkZWRfdmlldyc7XG5leHBvcnQgKiBmcm9tICcuL2dldF9jdXJyZW50X3ZpZXcnO1xuZXhwb3J0ICogZnJvbSAnLi9saXN0ZW5lcic7XG5leHBvcnQgKiBmcm9tICcuL25hbWVzcGFjZSc7XG5leHBvcnQgKiBmcm9tICcuL25leHRfY29udGV4dCc7XG5leHBvcnQgKiBmcm9tICcuL3Byb2plY3Rpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9wcm9wZXJ0eSc7XG5leHBvcnQgKiBmcm9tICcuL3Byb3BlcnR5X2ludGVycG9sYXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9zZWxlY3QnO1xuZXhwb3J0ICogZnJvbSAnLi9zdHlsaW5nJztcbmV4cG9ydCAqIGZyb20gJy4vdGV4dCc7XG4iXX0=