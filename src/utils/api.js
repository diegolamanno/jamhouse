/* Api methods to call /functions */

// const create = data => {
// 	return fetch('/.netlify/functions/todos-create', {
// 		body: JSON.stringify(data),
// 		method: 'POST',
// 	}).then(response => {
// 		return response.json()
// 	})
// }

const createSite = data => {
	return fetch('/.netlify/functions/site-create', {
		body: JSON.stringify(data),
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

const readAll = () => {
	return fetch('/.netlify/functions/sites-read-all').then(response => {
		return response.json()
	})
}

const update = (siteId, data) => {
	return fetch(`/.netlify/functions/sites-update/${siteId}`, {
		body: JSON.stringify(data),
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

const deleteTodo = siteId => {
	return fetch(`/.netlify/functions/sites-delete/${siteId}`, {
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

const batchDeleteTodo = siteIds => {
	return fetch(`/.netlify/functions/sites-delete-batch`, {
		body: JSON.stringify({
			ids: siteIds,
		}),
		method: 'POST',
	}).then(response => {
		return response.json()
	})
}

export default {
	create: create,
	createSite: createSite,
	readAll: readAll,
	update: update,
	delete: deleteTodo,
	batchDelete: batchDeleteTodo,
}
