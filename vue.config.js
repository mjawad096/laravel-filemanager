module.exports = {
	configureWebpack: {
		// No need for splitting
		optimization: {
			splitChunks: false
		}
	},
	filenameHashing: false,
	runtimeCompiler: true,
	productionSourceMap: false,

	outputDir: '../../public/file-manager',

	publicPath: process.env.NODE_ENV === 'production'
		? '/vendor/file-manager/'
		: '/',

	// modify the location of the generated HTML file.
	indexPath: process.env.NODE_ENV === 'production'
		? '../../../resources/views/file-manager.blade.php'
		: 'index.html',
};
