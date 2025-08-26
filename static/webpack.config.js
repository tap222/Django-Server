const path = require("path");

module.exports = {
    mode: 'production',
    entry: {
        sign_up: './scripts/sign_up.js',
        forgot: './scripts/forgot.js',
        sign_in: './scripts/sign_in.js',
        home: './scripts/home.js',
        additional: './scripts/additional.js',
        redirect: './scripts/redirect.js'
    },
    output: {
        path: path.resolve(__dirname, 'bundles'),
        filename: '[name].bundle.js'
    }
}