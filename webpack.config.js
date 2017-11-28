const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

module.exports = {
	entry: {
		app: [
			// 'babel-polyfill',
			'./src/main.ts'
		],
	},
	output: {
		filename: './dist/[name].js'
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
	externals: {
		'react': 'React',
		'resct-dom': 'ReactDOM'
	},
	devtool: 'source-map',
	plugins: [
		new UglifyJsPlugin(),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			openAnalyzer: false,
			statsFilename: path.resolve('./dist/stats.json'),
			generateStatsFile: true
		})
	]
}
