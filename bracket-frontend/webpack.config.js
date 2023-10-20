const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	target: 'web',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		port: 8080,
		host: '0.0.0.0',
		static: "./dist",
		hot: true
	},
	watchOptions: {
		aggregateTimeout:500,
		poll:1000
	},
	plugins: [new HtmlWebpackPlugin({
		title: 'CMCC Bracket',
		template: './src/index.html'
	})]
};