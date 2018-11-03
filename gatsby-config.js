module.exports = {
	siteMetadata: {
		title: 'Jamhouse',
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		'gatsby-transformer-sharp',
		'gatsby-plugin-sharp',
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: 'Jamhouse',
				short_name: 'jamhouse',
				start_url: '/',
				background_color: '#152898',
				theme_color: '#152898',
				display: 'minimal-ui',
				icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
			},
		},
		'gatsby-plugin-offline',
	],
}
