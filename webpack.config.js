const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const package = require('./package.json');
const config = require('./config.json');

module.exports = (env, argv) => {

    const isProd = argv.mode === 'production';
    const isDev = argv.mode === 'development';

    const runShell = () => {
        const exclude = [
            'node_modules/*',
            'vendor/*',
            'src/*',
            'public/*',
            'postcss.config.js',
            'webpack.config.js',
            'config.json',
            'package-lock.json',
            'package.json',
            'README.md',
            `${package.name}.zip`
        ];
        exclude.forEach((el, i) => exclude[i] = `-x "${el}"`);

        switch (process.platform) {
            case 'win32': return ['echo "Windows is not supported"'];
            case 'darwin': return [
                'cp public/* assets/',
                `zip -r ${package.name}.zip ./* ${exclude.join(' ')}`
            ];
            default: return [];
        }
    };

    const getPlugins = () => {
        const plugins = [];

        if (isDev) {
            plugins.push(
                new BrowserSyncPlugin({
                    proxy: {
                        target: config.proxyURL
                    },
                    files: [
                        '**/*.php'
                    ],
                    cors: true,
                    reloadDelay: 0
                })
            );
        }

        if (isProd) {
            plugins.push(
                new CleanWebpackPlugin(),
                new MiniCSSExtractPlugin({
                    filename: `[name]/${package.name}-[name].min.css`
                }),
                new WebpackShellPluginNext({
                    onBuildEnd: {
                        scripts: runShell(),
                        blocking: false
                    }
                })
            );
        }
        return plugins;
    }

    const getStyleLoaders = () => {
        return [
            isProd ? MiniCSSExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
        ];
    };

    return {
        mode: argv.mode,
        entry: {
            admin: './src/admin/index-admin.js'
        },
        externals: {
            jquery: 'jQuery',
            $: '$'
        },
        output: {
            filename: `[name]/${package.name}-[name].min.js`,
            path: path.resolve(__dirname, 'assets')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: [...getStyleLoaders(),
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        ...getStyleLoaders(),
                        'sass-loader'
                    ]
                },
            ]
        },
        plugins: getPlugins()
    };
};