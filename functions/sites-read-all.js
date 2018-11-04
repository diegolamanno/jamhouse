import faunadb from 'faunadb'

const q = faunadb.query
const client = new faunadb.Client({
	secret: process.env.FAUNADB_SERVER_SECRET,
})

exports.handler = (event, context, callback) => {
	console.log('Function `sites-read-all` invoked')
	return client
		.query(q.Paginate(q.Match(q.Ref("classes/sites"))))
		.then(response => {
			const sitesRefs = response.data
			console.log('Sites refs', sitesRefs)
			console.log(`${sitesRefs.length} todos found`)
			// create new query out of todo refs. http://bit.ly/2LG3MLg
			const getAllSiteDataQuery = sitesRefs.map(ref => {
				return q.Get(ref)
			})
			// then query the refs
			return client.query(getAllSiteDataQuery).then(ret => {
				return callback(null, {
					statusCode: 200,
					body: JSON.stringify(ret),
				})
			})
		})
		.catch(error => {
			console.log('error', error)
			return callback(null, {
				statusCode: 400,
				body: JSON.stringify(error),
			})
		})
}
