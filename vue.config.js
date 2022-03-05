module.exports = {
    assetsDir: 'static',
    publicPath: './',
    productionSourceMap: false,
    devServer: {
        open: true,
        port: 80,
        proxy: {
            '/api': {
                target: 'http://47.113.226.5:8081',
                // target:'http://localhost:8081',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
}