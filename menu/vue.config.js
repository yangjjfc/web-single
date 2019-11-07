// Temporary until we can use https://github.com/webpack/webpack-dev-server/pull/2143
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: false,
    configureWebpack: {
        externals: {
            'vue': 'vue',
            'element-ui': 'Element',
            'vuex': 'vuex',
            'vue-router': 'vue-router',
            'echarts': 'echarts',
            'ycloud-ui': 'ycloud',
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('~', resolve('src/utils/custom'))
            .set('@', resolve('src'));
        config.output.set('libraryTarget', 'umd')
        config.devServer.set('inline', false)
        config.devServer.set('hot', false)
        if (IS_PRODUCTION) {
            // #region 启用GZip压缩
            config
                .plugin('compression')
                .use(CompressionPlugin, {
                    asset: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                    cache: true
                })
                .tap(args => {});
        }
    },
    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/style/common.scss";'
            }
        }
    }
}