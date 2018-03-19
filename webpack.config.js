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
	const phaserModulePath = path.resolve(__dirname, 'node_modules/phaser-ce/build');

	webpackConfig.devtool = 'source-map';

	webpackConfig.module.rules.push({ test: /pixi\.js/, loader: 'expose-loader?PIXI' });
	webpackConfig.module.rules.push({ test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' });
	webpackConfig.module.rules.push({ test: /p2\.js/, loader: 'expose-loader?p2' });

	webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
	webpackConfig.resolve.alias['phaser'] = path.join(phaserModulePath, 'custom/phaser-split.js');
	webpackConfig.resolve.alias['pixi'] = path.join(phaserModulePath, 'custom/pixi.js');
	webpackConfig.resolve.alias['p2'] = path.join(phaserModulePath, 'custom/p2.js');

	return webpackConfig;
}
