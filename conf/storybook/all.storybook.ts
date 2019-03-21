export const loadStories: any = () => {
    const req: any = require.context('../../src', true, /\.stories\.ts$/);
    req.keys().forEach(filename => req(filename));
};
