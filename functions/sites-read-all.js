import faunadb from 'faunadb'

const q = faunadb.query
const client = new faunadb.Client({
	secret: process.env.FAUNADB_SERVER_SECRET,
})

exports.handler = (event, context, callback) => {
	console.log('Function `sites-read-all` invoked')
	return client
		.query(q.Paginate(q.Match(q.Index('all_sites'))))
		.then(response => {
			const sitesRefs = response.data
			console.log('Site refs', sitesRefs)
			console.log(`${sitesRefs.length} sites found`)
			// create new query out of todo refs. http://bit.ly/2LG3MLg
			const getAllSitesDataQuery = sitesRefs.map(ref => q.Get(ref))
			// then query the refs
			return client.query(getAllSitesDataQuery).then(ret =>
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(ret),
				})
			)
		})
		.catch(error => {
			console.log('error', error)
			return callback(null, {
				statusCode: 400,
				body: JSON.stringify(error),
			})
		})
}
