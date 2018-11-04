/* Api methods to call /functions */

const create = data =>
	fetch('/.netlify/functions/todos-create', {
		body: JSON.stringify(data),
		method: 'POST',
	}).then(response => response.json())

const readAll = () => fetch('/.netlify/functions/todos-read-all').then(response => response.json())

const lighthouse = () => fetch('/.netlify/functions/lighthouse').then(response => response.json())

const update = (todoId, data) =>
	fetch(`/.netlify/functions/todos-update/${todoId}`, {
		body: JSON.stringify(data),
		method: 'POST',
	}).then(response => response.json())

const deleteTodo = todoId =>
	fetch(`/.netlify/functions/todos-delete/${todoId}`, {
		method: 'POST',
	}).then(response => response.json())

const batchDeleteTodo = todoIds =>
	fetch(`/.netlify/functions/todos-delete-batch`, {
		body: JSON.stringify({
			ids: todoIds,
		}),
		method: 'POST',
	}).then(response => response.json())

export default {
	create,
	readAll,
	update,
	delete: deleteTodo,
	batchDelete: batchDeleteTodo,
	lighthouse,
}
