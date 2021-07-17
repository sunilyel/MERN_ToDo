function fetchTodos() {
  return fetch('http://localhost:4200/todos')
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

function createTodos(data) {
  return fetch('http://localhost:4200/todos', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

function deleteTodos(id) {
  return fetch(`http://localhost:4200/todos/${id}`, {
    method: 'DELETE',
  })
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

function updateTodo(id, todo) {
  return fetch(`http://localhost:4200/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(data => data.json())
    .catch(err => console.log(err))
}