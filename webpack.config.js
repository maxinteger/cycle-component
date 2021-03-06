module.exports = {
    debug: true,
    devtool: 'inline-source-map',
    entry: './src/index.js',
    output: {
        path: './public/build',
        filename: 'bundle.js',
        sourceMapFilename: 'bundle.js.map'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.css$/,
            loader: 'style!css'
        }]
    }
};
