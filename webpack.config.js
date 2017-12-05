const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
		extensions: ['.ts', '.tsx', '.js', '.jsx']
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
				exclude: /\.spec\.(t|j)sx?$/
			}//, { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
		]
	},
	/*externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},*/
	devtool: 'source-map',
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
		})
	]
}
