const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.report)
    });
  });
}

const opts = {
  chromeFlags: ['--show-paint-rects'],
  output: ['html', 'json']
};

// Usage:
launchChromeAndRunLighthouse('https://example.com', opts).then(results => {
  // Use results!

  /**
   * results[0] : The html report as a string.
   * results[1] : The json report as a string. 
   */

  var categories = JSON.parse(results[1])['categories'];
  var out = '';
  for(var key in categories){
    out += key + ': ' + (categories[key].score * 100) + '%\n';
  }

  console.log(out);
});