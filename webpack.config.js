const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: './src/main.ts',
	output: {
		filename: './dist/bundle.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{ test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader' } },
			{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
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
			statsFilename: 'dist/stats.json',
			generateStatsFile: true
		})
	]
}
