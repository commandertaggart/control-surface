const path = require('path')

module.exports = {
    entry: {
        main: './web/main/index.ts',
        config: './web/config/index.ts',
        page: './web/page/index.ts'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/js')
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};