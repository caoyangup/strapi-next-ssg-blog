module.exports = () => ({
    'pinyin-slug': {
        // my-plugin is going to be the internal name used for this plugin
        enabled: true,
        resolve: './src/plugins/pinyin-slug',
        config: {
            // user plugin config goes here
        },
    },
});
