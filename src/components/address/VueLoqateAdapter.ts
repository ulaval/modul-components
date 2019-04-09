export default {
    install(vue: any, options): void {
        const { find, retrieve } = options;

        vue.prototype.$find = find;
        vue.prototype.$retrieve = retrieve;
    }
};
