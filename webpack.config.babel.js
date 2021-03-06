// Copyright 2015, EMC, Inc.

const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    context: `${__dirname}/src`,
    entry: './bundle.js',

    output: {
        path: `${__dirname}/static`,
        publicPath: '/',
        filename: 'monorail.js'
    },

    resolve: {
        extensions: ['', '.jsx', '.js'],

        modulesDirectories: [
            `${__dirname}/node_modules`,
            'node_modules'
        ],

        alias: {
            'src-common': `${__dirname}/src/common`,
            'src-config': `${__dirname}/src/config`,
            'src-monorail': `${__dirname}/src/monorail/`
        }
    },

    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: /src\//,
                loader: 'source-map'
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(xml|html|txt|md)$/,
                loader: 'raw'
            }
        ]
    },

    plugins: ([
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process': JSON.stringify({
                browser: true,
                env: {
                    NODE_ENV: process.env.NODE_ENV
                }
            }),
            '__DEV__': isProduction ? 'false' : 'true'
        })
    ]).concat(isProduction ? [
        new webpack.optimize.OccurenceOrderPlugin()
    ] : []),

    stats: { colors: true },

    node: {
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
    },

    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',

    devServer: {
        // https: true,
        port: process.env.PORT || 4000,
        host: '0.0.0.0',
        colors: true,
        publicPath: '/',
        contentBase: './static',
        historyApiFallback: true,
        proxy: []
    }
};
