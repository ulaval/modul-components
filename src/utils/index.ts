import UtilsPlugin from './utils-plugin';

/**
 * List public declaration here.
 */
export * from './dialog/alert';
export * from './dialog/confirm';
export * from './file/file';
export * from './http/http';
export * from './i18n/i18n';
export * from './logger/logger';
// re-exporte because of a conflit with ./mixin/media-queries
export { MediaQueries as MediaQueriesUtils, MediaQueriesBp, MediaQueriesBpMax, MediaQueriesBpMin } from './media-queries/media-queries';
export * from './modul/modul';
export * from './scroll-to/scroll-to';
export { default as DefaultSpritesPlugin } from './svg/default-sprites';
export { default as SpritesPlugin } from './svg/sprites';
export { default as UtilsPlugin, UtilsPluginOptions } from './utils-plugin';
export * from './vue/vue';

// Preserve the default import to prevent breaking changes when using legacy import.
export default UtilsPlugin;
