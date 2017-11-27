module.exports = {
	entry: [
		'./src/main.test.ts'
	],
	output: {
		filename: './dist/test.js'
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
						configFileName: 'tsconfig.test.json'
					}
				}]
			}
		]
	},
	externals: {
		'react': 'React',
		'resct-dom': 'ReactDOM'
	}
}
