const path = require("path");
const entryPath = "Weather_App";
const entryFile = "app.js";

module.exports = {
    entry: `./${entryPath}/js/${entryFile}`,
    output: {
        filename: "out.js",
        path: path.resolve(__dirname, `${entryPath}/build`)
    },
    devServer: {
        contentBase: path.join(__dirname, `${entryPath}`),
        publicPath: "/build/",
        compress: true,
        port: 3001
    },
    node: {
        fs: "empty"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }

};