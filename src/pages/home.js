import React, { Component } from 'react'
import './home.css'
import Header from '../components/AppHeader'
import AppHeader from '../components/AppHeader'
import AppHome from '../components/AppHome'
import AppFooter from '../components/AppFooter'

class Home extends Component {
	componentDidMount() {
		document.querySelector('#web-hook input').addEventListener('click', this.copyHook)
		document.querySelector('#web-hook input').addEventListener('keypress', this.copyHook)
		document.querySelector('#web-hook button').addEventListener('click', this.copyHook)
	}

	copyHook = e => {
		e.preventDefault()
		const message = document.getElementById('copied')
		if (e.target.tagName === 'INPUT') {
			// Reset the value in case user gave input
			e.target.value = 'https://ourwebook.com/'
		}
		document.querySelector('#web-hook input').select()
		document.execCommand('copy')
	}

	render() {
		return (
			<div>
				<AppHeader />
				<AppHome />
				<AppFooter />
			</div>
		)
	}
}

export default Home
