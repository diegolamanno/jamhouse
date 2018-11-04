/* Api methods to call /functions */

const create = data =>
	fetch('/.netlify/functions/todos-create', {
		body: JSON.stringify(data),
		method: 'POST',
	}).then(response => response.json())

const createSite = data =>
	fetch('/.netlify/functions/site-create', {
		body: JSON.stringify(data),
		method: 'POST',
	}).then(response => response.json())

const readAll = () => fetch('/.netlify/functions/todos-read-all').then(response => response.json())

const update = (todoId, data) =>
	fetch(`/.netlify/functions/todos-update/${todoId}`, {
		body: JSON.stringify(data),
		method: 'POST',
	}).then(response => response.json())

const deleteTodo = todoId =>
	fetch(`/.netlify/functions/todos-delete/${todoId}`, {
		method: 'POST',
	}).then(response => response.json())

const lighthouse = async url => {
	try {
		const res = await fetch(
			'https://ey918zoh98.execute-api.us-east-1.amazonaws.com/dev/lighthouse',
			{
				method: 'POST',
				body: JSON.stringify({
					website: url,
				}),
				headers: new Headers({
					'Content-Type': 'application/json',
				}),
			}
		)

		console.log(res)
	} catch (err) {
		console.log(err)
	}
}

const batchDeleteTodo = todoIds =>
	fetch(`/.netlify/functions/todos-delete-batch`, {
		body: JSON.stringify({
			ids: todoIds,
		}),
		method: 'POST',
	}).then(response => response.json())

export default {
	create,
	createSite,
	readAll,
	update,
	lighthouse,
	delete: deleteTodo,
	batchDelete: batchDeleteTodo,
}
