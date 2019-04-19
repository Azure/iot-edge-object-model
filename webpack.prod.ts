import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as webpack from 'webpack';
import path = require('path');

const config: webpack.Configuration = {
    entry: {
        main: ['./src/index.ts']
    },
    mode: 'production',
    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true
                },
                test: /\.tsx?$/

            },

            { test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
        ]
    },
    output: {
        filename: 'index.js',
        library: 'edgeObjectModel',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        plugins: [
            new TsConfigPathsPlugin()
        ]
    },
};

export default config;
