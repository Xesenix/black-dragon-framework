const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

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
		filename: './js/[name].js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: {
			'~*': path.resolve('node_modules') + '/*'
		}
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
			},//, { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
			{
				test: /\.scss$/,
				/*use: [{
					loader: 'css-loader',
					options: { includePaths: [path.resolve('src/styles')] }
				}, {
					loader: 'sass-loader',
					options: { includePaths: [path.resolve('src/styles')] }
				}]*/
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [{
						loader: 'css-loader',
						options: { includePaths: [path.resolve('src/styles')] }
					}, {
						loader: 'sass-loader',
						options: { includePaths: [path.resolve('src/styles')] }
					}]
				})
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [ 'file-loader?name=public/fonts/[name].[ext]' ]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {}
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
		/*new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			openAnalyzer: false,
			statsFilename: path.resolve('./dist/stats.json'),
			generateStatsFile: true
		})*/
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
		new ExtractTextPlugin('css/styles.css'),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: ({ resource } = {} ) => (resource && resource.includes('node_modules'))
		}),
	]
}
