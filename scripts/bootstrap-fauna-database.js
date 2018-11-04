/* bootstrap database in your FaunaDB account */
const readline = require('readline')
const faunadb = require('faunadb')
const chalk = require('chalk')
const insideNetlify = insideNetlifyBuildContext()
const q = faunadb.query

if (!process.env.FAUNADB_SERVER_SECRET) {
  console.log("No FAUNADB_SERVER_SECRET found");
  console.log("Please run `netlify addons:create fauna-staging` and redeploy");
  // @ts-ignore
  return false;
}

// @ts-ignore
console.log(chalk.cyan("Creating your FaunaDB Database...\n"));
if (insideNetlify) {
	// Run idempotent database creation

	console.log(process.env)
	createFaunaDB(process.env.FAUNADB_SERVER_SECRET).then(() => {
		console.log('Database created')
	})
} else {
  console.log();
  console.log("You can create fauna DB keys here: https://dashboard.fauna.com/db/keys");
  console.log();
  // @ts-ignore
  ask(chalk.bold("Enter your faunaDB server key"), (err, answer) => {
    if (err) {
      console.log(err);
    }
    if (!answer) {
      console.log("Please supply a faunaDB server key");
      process.exit(1);
    }
    createFaunaDB(process.env.FAUNADB_SERVER_SECRET).then((client) =>
    {
      createIndex(client, false)
      createIndex(client, true)
      console.log("Database index created");
    });
  });
}

/* idempotent operation */
function createFaunaDB(key) {
  console.log("Create the database!");
  // @ts-ignore
  const client = new faunadb.Client({
    secret: key
  });

	/* Based on your requirements, change the schema here */
	return client
		.query(
			q.CreateClass({
				name: 'sites',
			})
		)
		.then(ret => console.log(ret))
		.catch(e => {
			// Database already exists
			if (e.requestResult.statusCode === 400 && e.message === 'instance not unique') {
				console.log('DB already exists')
				throw e
			}
		})
}

function createIndex(client, rev) {
  console.log(`creating index. reverse_order:${rev}`)
  if (!rev) {
    return client.query(
        q.CreateIndex({
          name: "UNIQUE_ENTRY_CONSTRAINT",
          // @ts-ignore
          source: Class("sites"),
          terms: [{
            field: ["data", "clientID"]
          }],
          values: [{
              field: ["data", "clientTS"]
            },
            {
              field: ["data", "Performance"]
            },
            {
              field: ["data", "Progressive Web App"]
            },
            {
              field: ["data", "Accessibility"]
            },
            {
              field: ["data", "Best Practices"]
            },
            {
              field: ["data", "SEO"]
            }
          ],
          unique: true
        })
      )
      .then((ret) => console.log(`Created index with rev: ${rev}`, ret))
  }
  else if (rev)
  {
    return client.query(
        q.CreateIndex({
          name: "site_client_id",
          // @ts-ignore
          source: Class("sites"),
          terms: [{
            field: ["data", "clientID"]
          }],
        values:
          [
            {
              field: ["data", "clientTS"],
              reverse: true
            },
            {
              field: ["data", "Performance"]
            },
            {
              field: ["data", "Progressive Web App"]
            },
            {
              field: ["data", "Accessibility"]
            },
            {
              field: ["data", "Best Practices"]
            },
            {
              field: ["data", "SEO"]
            },
            {
              field:["ref"]
            }
          ],
          unique: false,
          serialized: true
        })
      )
      .then((ret) => console.log(`created index with rev: ${ rev} `, ret))
  }
}

/* util methods */

// Test if inside netlify build context
function insideNetlifyBuildContext() {
	if (process.env.DEPLOY_PRIME_URL) {
		return true
	}
	return false
}

// Readline util
function ask(question, callback) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	rl.question(question + '\n', function(answer) {
		rl.close()
		callback(null, answer)
	})
}
