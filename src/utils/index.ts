import UtilsPlugin from './utils-plugin';

/**
 * List public declaration here.
 */
export { default as UtilsPlugin, UtilsPluginOptions } from './utils-plugin';
export * from './file/file';
export * from './http/http';
export * from './i18n/i18n';
export * from './logger/logger';
// re-exporte because of a conflit with ./mixin/media-queries
export { MediaQueries as MediaQueriesUtils, MediaQueriesBpMin, MediaQueriesBpMax, MediaQueriesBp } from './media-queries/media-queries';
export * from './dialog/alert';
export * from './dialog/confirm';
export * from './modul/modul';
export * from './svg/sprites';

// Preserve the default import to prevent breaking changes when using legacy import.
export default UtilsPlugin;
