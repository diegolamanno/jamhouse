

/* =============================================
 =       Extend Webpack Configuration         =
============================================= */

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
	switch (stage) {
		case 'build-javascript': {
            /* fix for https://medium.com/@danbruder/typeerror-require-is-not-a-function-webpack-faunadb-6e785858d23b */
			actions.setWebpackConfig({
				plugins: [
                    new webpack.DefinePlugin({ "global.GENTLY": false })
                  ],
                  node: {
                    __dirname: true,
                  }
			})
			break
		}

		default:
			break
	}
}
