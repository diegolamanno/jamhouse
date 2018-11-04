import React from 'react'
import LighthouseForm from '../LighthouseForm/LighthouseForm'

const AppHome = () => (
	<main id="front-page">
		<section>
			<h2>What is Spotlight?</h2>
			<p>
				Spotlight is a tool that leverages the power of{' '}
				<a href="https://developers.google.com/web/tools/lighthouse/" target="_blank">
					Google's Lighthouse
				</a>{' '}
				to automatically audit the quality of your websites, logging changes over time and making it
				easy to compare your site against others. Give it a try, and if you like it then consider
				using the web hook to easily include it in your deployment process.
			</p>
		</section>
		<section id="getting-started">
			<h2>How do I get started?</h2>
			<div id="getting-started-grid">
				<div id="check-site" className="shadow">
					<LighthouseForm />
					<h3>Check your site right now...</h3>
					{/* <p className="field">
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
					</p> */}
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
)

export default AppHome
