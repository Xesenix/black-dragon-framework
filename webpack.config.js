const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
	const isProd = !!env.prod;
	const isTest = !!env.test;
	const extractCss = new ExtractTextPlugin({
		filename: 'css/[name].[contenthash].css',
		disable: !isProd
	});
	const extractSass = new ExtractTextPlugin({
		filename: 'css/[name].[contenthash].css',
		disable: !isProd
	});

	return {
		// context: path.resolve(__dirname, 'src'),
		entry: {
			app: [
				'babel-polyfill',
				'./src/main.ts'
			],
		},
		output: {
			path: isProd ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'public'),
			publicPath: '',
			filename: 'js/[name].[hash].js'
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
			modules: [
				path.resolve(__dirname, 'src'),
				'node_modules'
			],
		},
		devtool: isTest ? 'inline-source-map' : 'source-map',
		bail: isProd,
		module: {
			rules: [
				{
					test: /\.(t|j)sx?$/,
					loaders: [{
						loader: 'awesome-typescript-loader',
						options: {
							configFileName: 'tsconfig.json',
							sourceMap: !isTest,
							inlineSourceMap: isTest
						}
					}],
					exclude: /^src\/.+\.spec\.(t|j)sx?$/
				},
				{
					test: /\.json$/,
					use: [
						'json-loader',
					]
				},
				{
					test: /\.css$/,
					use: extractCss.extract({
						fallback: 'style-loader',
						use: [
							'css-loader?sourceMap',
							'resolve-url-loader',
						]
					})
				},
				{
					test: /\.scss$/,
					use: extractSass.extract({
						fallback: 'style-loader',
						use: [
							{ loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
							'resolve-url-loader',
							{ loader: 'sass-loader', options: { sourceMap: true } },
						]
					})
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				},
				{
					test: /\.(eot|svg|ttf|woff|woff2)$/,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}]
				},
				{
					test: /\.(png|jpg|gif)$/,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
							context: path.resolve(__dirname, 'src/assets'), // root for path
							outputPath: 'assets/'
						}
					}]
				},
			]
		},
		externals: {
			'phaser-ce': 'Phaser'
		},
		devServer: {
			hot: true,
			contentBase: path.resolve('public/'),
			inline: true
		},
		plugins: [
			isProd ? new BundleAnalyzerPlugin({
				analyzerMode: 'disabled',
				openAnalyzer: false,
				statsFilename: path.resolve('./dist/stats.json'),
				generateStatsFile: true
			}) : null,
			new webpack.EnvironmentPlugin({
				NODE_ENV: isProd ? 'production' : isTest ? 'test' : 'development'
			}),
			new webpack.LoaderOptionsPlugin({
				minimize: isProd,
				debug: !isProd,
				sourceMap: true,
			}),
			new HtmlWebpackPlugin({
				inject: true,
				template: path.resolve('./src/index.html'),
				minify: {
					removeComments: true,
					preserveLineBreaks: true
				},
				xhtml: false,
				mobile: true,
				showErrors: true
			}),
			new CopyWebpackPlugin([{
				from: path.resolve(__dirname, 'node_modules/phaser-ce/build/custom/phaser-arcade-physics.min.js'),
				to: path.resolve(__dirname, 'public/js/phaser.js')
			}]),
			isProd ? new CopyWebpackPlugin([{
				from: path.resolve(__dirname, 'public'),
				to: path.resolve(__dirname, 'dist')
			}]) : null,
			extractCss,
			extractSass,
			isTest ? null : new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: ({ resource } = {} ) => /node_modules/.test(resource)
			}),
			isTest ? null : new webpack.optimize.CommonsChunkPlugin({
				name: 'react',
				minChunks: ({ resource }) => /node_modules(\\|\/)(react|react-dom)/.test(resource)
			}),
			isProd ? new CleanWebpackPlugin(['dist']) : null,
			isProd ? new webpack.optimize.OccurrenceOrderPlugin() : null,
			isProd ? new UglifyJsPlugin() : null,
		].filter(p => !!p)
	}
}
