import React from 'react'
import lighthouse from './lighthouse.svg'

const AppHeader = () => (
	<header>
		<div id="lighthouse">
			<div id="light" />
			<img src={lighthouse} alt="Lighthouse with a rotating lightbeam" />
		</div>
		<h1>
			<div>Spotlight</div>
		</h1>
	</header>
)

export default AppHeader
