import React from 'react'
import lighthouse from './lighthouse.svg'
import Helmet from 'react-helmet'

const title = 'Spotlight'

const AppHeader = () => (
	<div>
		<Helmet defaultTitle={title} titleTemplate={`%s | ${title}`}>
			<html lang="en" />
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			<link
				href="https://fonts.googleapis.com/css?family=Averia+Serif+Libre|Merriweather|Open+Sans"
				rel="stylesheet"
			/>
			<link
				rel="stylesheet"
				href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
				integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
				crossorigin="anonymous"
			/>
		</Helmet>

		<header>
			<div id="lighthouse">
				<div id="light" />
				<img src={lighthouse} alt="Lighthouse with a rotating lightbeam" />
			</div>
			<h1>
				<div>Spotlight</div>
			</h1>
		</header>
	</div>
)

export default AppHeader
