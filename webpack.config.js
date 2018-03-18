const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const path = require('path');

const { application, webpack } = require('xes-webpack-core');

const app = application.getEnvApp();

const config = {
	useBabelrc: false,
}

module.exports = (env) => {
	const webpackConfig = webpack.webpackConfigFactory(config);

	webpackConfig.plugins.push(
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, 'node_modules/phaser-ce/build/phaser.min.js'),
			to: path.resolve(__dirname, 'dist/js/phaser.js'),
		}])
	);

	return webpackConfig;
}
