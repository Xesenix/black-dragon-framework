const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const extractCss = new ExtractTextPlugin({
	filename: 'css/[name].[contenthash].css',
	disable: true
});
const extractSass = new ExtractTextPlugin({
	filename: 'css/[name].[contenthash].css',
	disable: true
});

module.exports = (env) => ({
	context: path.resolve(__dirname, 'src'),
	entry: {
		app: [
			'babel-polyfill',
			'./main.ts'
		],
	},
	output: {
		path: path.resolve('dist'),
		publicPath: '/',
		filename: './js/[name].js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules'
		],
	},
	devtool: env.prod ? 'source-map' : 'eval',
	bail: env.prod,
	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				loaders: [{
					loader: 'awesome-typescript-loader',
					options: {
						configFileName: 'tsconfig.json'
					}
				}],
				exclude: /^src\/.+\.spec\.(t|j)sx?$/
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.css$/,
				use: extractCss.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						{
							loader: 'resolve-url-loader',
							options: {
								debug: true,
								sourceMap: true,
							}
						}
					]
				})
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						{
							loader: 'resolve-url-loader',
							options: {
								debug: true,
								sourceMap: true,
							}
						},
						{
							loader: 'sass-loader',
							options: { sourceMap: true }
						}
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
						outputPath: 'assets/fonts/'
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
						outputPath: 'assets/images/'
					}
				}]
			},
		]
	},
	/*externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},*/
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve('./src/index.html'),
			minify: {
				removeComments: true,
				preserveLineBreaks: false
			},
			xhtml: false,
			mobile: true,
			showErrors: true
		}),
		extractCss,
		extractSass,
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: ({ resource } = {} ) => /node_modules/.test(resource)
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'react',
			minChunks: ({ resource }) => /node_modules(\\|\/)(react|react-dom)/.test(resource)
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development'
		}),
		new webpack.optimize.OccurrenceOrderPlugin()
	]
})
