let todos = []
let isEdit = false
let editId = null

fetchTodos().then((data) => {
  todos = data
  render(todos)
})

const todoForm = document.querySelector('#todoForm')
const btn = document.querySelector('#btn')
const title = document.querySelector('#title')
const description = document.querySelector('#description')

btn.addEventListener('click', function () {
  const form = new FormData(todoForm)
  var formValues = {}
  for (var val of form.keys()) {
    // console.log(form.get(key))
    formValues[val] = form.get(val)
  }
  if (!isEdit) {
    var todo = getTodo(formValues.title, formValues.description)
    createTodos(todo).then(data => {
      todo = { ...todo, id: data.id }
      todos = [...todos, todo]
      render(todos)
    })
  } else {
    // console.log(editId)
    var newTodos = [...todos]
    var idx = newTodos.findIndex((t) => t.id == editId)
    var t = { ...newTodos[idx] }
    t.title = formValues.title
    t.description = formValues.description
    newTodos[idx] = t

    updateTodo(editId, t)
      .then(_ => {
        releaseEditLock()
        todos = newTodos
        render(todos)
        // console.log(editId)
      })
  }
  title.value = null
  description.value = null
})

function editLock(id) {
  // console.log(id)
  editId = id
  isEdit = true
  btn.textContent = 'Save'
}

function releaseEditLock() {
  editId = null
  isEdit = false
  btn.textContent = 'Add Todo'
}

function getTodo(title, description) {
  return {
    title,
    description,
    createdAt: new Date().toString(),
    status: 'Active'
  }
}

function render(todos) {
  const todo_list = document.querySelector('.todo_list')
  const items = todos.map((todo) => renderATodoList(todo))
  todo_list.innerHTML = null
  // console.log(items)
  items.forEach((item) => todo_list.appendChild(item))
}

function renderATodoList(todo) {
  const mainRow = document.createElement('div')
  mainRow.className = 'row jumbotron section'

  const titleDiv = document.createElement('div')
  const descriptionDiv = document.createElement('div')
  const statusDiv = document.createElement('div')

  titleDiv.className = 'col-md-2'
  titleDiv.textContent = todo.title
  descriptionDiv.className = 'col-md-2'
  descriptionDiv.textContent = todo.description
  statusDiv.className = 'col-md-2'
  statusDiv.textContent = todo.status

  let markCompletedDiv = document.createElement('div')
  markCompletedDiv.className = 'col-md-2'

  let statusBtn = document.createElement('button')
  statusBtn.className = 'btn btn-info'
  statusBtn.textContent = 'Mark Completed'

  statusBtn.addEventListener('click', () => {
    // console.log(todo.id)
    var newTodos = [...todos]
    var idx = newTodos.findIndex((t) => t.id == todo.id)
    var t = { ...newTodos[idx] }
    t.status = 'Completed'
    newTodos[idx] = t
    todos = newTodos
    updateTodo(todo.id, t).then(_ => {
      // console.log(todos);
      render(todos)
    })
    // render(newTodos)
  })

  markCompletedDiv.appendChild(statusBtn)

  const actionDiv = document.createElement('div')
  actionDiv.className = 'col-md-4'

  const row = document.createElement('div')
  row.className = 'row'

  let editDiv = document.createElement('div')
  editDiv.className = 'col-md-3'

  statusBtn = document.createElement('button')
  statusBtn.className = 'btn btn-primary'
  statusBtn.textContent = 'Edit'

  statusBtn.addEventListener('click', function () {
    title.value = todo.title
    description.value = todo.description
    editLock(todo.id)
  })

  editDiv.appendChild(statusBtn)

  row.appendChild(editDiv)

  let statusAction = document.createElement('div')
  statusAction.className = 'col-md-3'

  statusBtn = document.createElement('button')
  statusBtn.className = 'btn btn-danger'
  statusBtn.textContent = 'Delete'

  statusBtn.addEventListener('click', () => {
    // console.log(todo.id)
    var newTodos = todos.filter((t) => t.id != todo.id)
    deleteTodos(todo.id)
      .then(_ => {
        todos = newTodos
        render(newTodos)
      })
  })

  statusAction.appendChild(statusBtn)

  row.appendChild(statusAction)

  actionDiv.appendChild(row)

  mainRow.appendChild(titleDiv)
  mainRow.appendChild(descriptionDiv)
  mainRow.appendChild(statusDiv)
  mainRow.appendChild(markCompletedDiv)
  mainRow.appendChild(actionDiv)

  return mainRow
}
