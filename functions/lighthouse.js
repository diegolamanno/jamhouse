// import createLighthouse from "lighthouse-lambda";
const launchChrome = require('@serverless-chrome/lambda')
const lighthouse = require('lighthouse')
/* export our lambda function as named "handler" export */
exports.handler = async (event, context, callback) => {
	const chrome = await launchChrome({
		flags: ['--window-size=1280,1696', '--hide-scrollbars'],
	})

	const opts = {
		chromeFlags: ['--show-paint-rects'],
		port: chrome.port,
	}

	const lighthouseResp = await lighthouse('https://github.com', opts, null)

	await chrome.kill()
	return {
		statusCode: 200,
		body: JSON.stringify(lighthouseResp.lhr),
	}
	// Chrome didn't launch correctly 😢
	// console.log("no").catch(callback);
}
