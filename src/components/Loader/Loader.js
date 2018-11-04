import React from 'react'
import './Loader.css'

const Loader = () => (
	<div className="loader">
		<div className="loader__title">Loading</div>
		<div>(This may take some time)</div>
		<div className="loader__lds-ellipsis">
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
)

export default Loader
