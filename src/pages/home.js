import React, { Component } from 'react'
import './home.css'
import Header from '../components/AppHeader'
import AppHeader from '../components/AppHeader'

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

				<main id="front-page">
					<section>
						<h2>What is Spotlight?</h2>
						<p>
							Spotlight is a tool that leverages the power of{' '}
							<a href="https://developers.google.com/web/tools/lighthouse/" target="_blank">
								Google's Lighthouse
							</a>{' '}
							to automatically audit the quality of your websites, logging changes over time and
							making it easy to compare your site against others. Give it a try, and if you like it
							then consider using the web hook to easily include it in your deployment process.
						</p>
					</section>
					<section id="getting-started">
						<h2>How do I get started?</h2>
						<div id="getting-started-grid">
							<div id="check-site" className="shadow">
								<h3>Check your site right now...</h3>
								<p className="field">
									<label htmlFor="name">Name:</label> <input id="name" />
								</p>
								<p className="field">
									<label htmlFor="email">Email:</label> <input id="email" />
								</p>
								<p className="field">
									<label htmlFor="site">Site:</label> <input id="site" />
								</p>
								<p>
									<button type="submit">Submit</button>
								</p>
							</div>
							<div id="web-hook" className="shadow">
								<h3>...or use our webhook!</h3>
								<p>
									<input value="https://ourwebook.com/" />
								</p>
								<p>
									<button>
										<i className="fas fa-paste" /> Copy
									</button>
								</p>
							</div>
						</div>
					</section>
				</main>

				<footer>
					<h2>About the Project</h2>
					<p>
						This project was created as part of the 2018 JamStack Hackathon by
						<a href="https://github.com/acubas" target="_blank">
							Andres
						</a>
						,
						<a href="https://github.com/camsloanftc" target="_blank">
							Cam
						</a>
						,
						<a href="https://github.com/DSlatkin" target="_blank">
							Danny
						</a>
						,
						<a href="https://github.com/camsloanftc" target="_blank">
							Diego
						</a>
						, and
						<a href="https://github.com/thMthMnky" target="_blank">
							Henry
						</a>
						. The lighthouse logo is from{' '}
						<a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">
							Vectors Market
						</a>{' '}
						from{' '}
						<a href="https://www.flaticon.com/" title="Flaticon">
							www.flaticon.com
						</a>{' '}
						is licensed by{' '}
						<a
							href="http://creativecommons.org/licenses/by/3.0/"
							title="Creative Commons BY 3.0"
							target="_blank"
						>
							CC 3.0 BY
						</a>
						.
					</p>
				</footer>
			</div>
		)
	}
}

export default Home
