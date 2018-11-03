const createLighthouse = require("lighthouse-lambda");

exports.handler = function(event, context, callback) {
  Promise.resolve()
    .then(() => createLighthouse("https://example.com", { logLevel: "info" }))
    .then(({ chrome, start }) => {
      return start()
        .then(results => {
          // Do something with `results`
          console.log(results);
          return chrome.kill().then(() => callback(null));
        })
        .catch(error => {
          // Handle errors when running Lighthouse
          return chrome.kill().then(() => callback(error));
        });
    })
    // Handle other errors
    .catch(callback);
};
