const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
	output: {
		filename: './dist/test.js'
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
						configFileName: 'tsconfig.test.json'
					}
				}]
			},
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
				use: [
					'file-loader?name=assets/fonts/[name].[ext]'
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {}
				}]
			}
		]
	},/*
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	}*/
	plugins: [
		//new UglifyJsPlugin(),
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
		new ExtractTextPlugin('styles.css'),
	]
}
