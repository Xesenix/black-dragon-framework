const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const extractCss = new ExtractTextPlugin({
	filename: 'css/[name].[contenthash].css',
	disable: false
});
const extractSass = new ExtractTextPlugin({
	filename: 'css/[name].[contenthash].css',
	disable: false
});

module.exports = {
	entry: {
		app: [
			'babel-polyfill',
			'./src/main.ts'
		],
	},
	output: {
		path: path.resolve('dist'),
		publicPath: '/',
		filename: './js/[name].[hash].js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: {
			assets$: path.resolve(__dirname, 'src/assets')
		},
		modules: [
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, 'src/styles'),
			path.resolve(__dirname, 'src/assets'),
			'node_modules'
		]
	},
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
				test: /\.css$/,
				use: extractCss.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						{
							loader: 'resolve-url-loader',
							options: {
								debug: false,
								sourceMap: false,
								root: path.resolve(__dirname, 'src/assets')
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
								debug: false,
								sourceMap: false,
								root: path.resolve(__dirname, 'src/assets')
							}
						},
						{
							loader: 'sass-loader',
							options: { sourceMap: false }
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
				use: [ 'file-loader?name=assets/fonts/[name].[ext]' ]
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
	devtool: 'source-map',
	plugins: [
		new UglifyJsPlugin(),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			openAnalyzer: false,
			statsFilename: path.resolve('./dist/stats.json'),
			generateStatsFile: true
		}),
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
			NODE_ENV: 'production'
		}),
		new webpack.optimize.OccurrenceOrderPlugin()
	]
}
