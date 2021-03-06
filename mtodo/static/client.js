var todoList = {

	todos: [],

	addTodo: function(todoText) {
		this.todos.push({
			todoText: todoText,
			completed: false
		});

        var CSRFtoken = $('input[name=csrfmiddlewaretoken]').val();
        $.when($.post('/mtodo/add_todo/',{todo_text: todoText, csrfmiddlewaretoken: CSRFtoken}))
            .done(function() {
                getTodos();
            });
	},

	changeTodo: function(position, todoText) {
	    var todo = this.todos[position];
		this.todos[position].todoText = todoText;

        var CSRFtoken = $('input[name=csrfmiddlewaretoken]').val();
        $.post('/mtodo/' + todo.pk + '/change/',{todo_text: todoText, csrfmiddlewaretoken: CSRFtoken})
        view.displayTodos();
	},

	deleteTodo: function(position) {
	    var todo = this.todos[position];
		this.todos.splice(position, 1);
		$.get('/mtodo/' + todo.pk + '/delete/');

	},

	toggleCompleted: function(position) {
		var todo = this.todos[position];
		todo.completed = !todo.completed
		$.get('/mtodo/' + todo.pk + '/complete/');
	},

	toggleAll: function() {
		// Get number of total todos
		var totalTodos = this.todos.length;

		// Get number of completed todos
		var completedTodos = 0;
		this.todos.forEach(function(todo) {
			if (todo.completed === true) {
				completedTodos++;
			}
		});

		this.todos.forEach(function(todo) {
			// Case 1: If everything's true, make everything false
			if (completedTodos === totalTodos) {
				todo.completed = false;
			// Case 2: Otherwise, make everything true
			} else {
				todo.completed = true;
			}
		});
		$.get('/mtodo/toggle_all/');
	}
};


var handlers = {
	addTodo: function() {
		var addTodoTextInput = document.getElementById('addTodoTextInput');
		if (addTodoTextInput.value.replace(/ /g,'') === '') {
		} else {
			todoList.addTodo(addTodoTextInput.value);
			addTodoTextInput.value = '';
			view.displayTodos();
		}
	},
	updateTodo: function(position) {
		var changeTodoTextInput = document.getElementById('changeTodoTextInput');
		if (changeTodoTextInput.value.replace(/ /g,'') === '') {
		} else {
			todoList.changeTodo(position, changeTodoTextInput.value);
			view.displayTodos();
		}
	},
	deleteTodo: function(position) {
		todoList.deleteTodo(position);
		view.displayTodos();
	},
	toggleCompleted: function(position) {
		todoList.toggleCompleted(position);
		view.displayTodos();
	},
	toggleAll: function() {
		todoList.toggleAll();
		view.displayTodos();
	},
	changeTodo: function(position) {
		view.changeTodo(position);		
	}
};


var view = {
	displayTodos: function() {
		var todosUl = document.querySelector('ul');
		todosUl.innerHTML = '';
		if (todoList.todos.length === 0) {
			todosUl.innerHTML = 'You have no todos!';
		} else {
			todoList.todos.forEach(function(todo, position) {
				var todoLi = document.createElement('li');
				todoLi.className = 'todoItem list-group-item';
				var todoTextWithCompletion = '';

				if (todo.completed === true) {
					todoLi.className += ' completed';
					todoTextWithCompletion = todo.todoText;
				} else {
					todoTextWithCompletion = todo.todoText;
				}

				todoLi.id = position;
				todoLi.textContent = todoTextWithCompletion;
				todoLi.appendChild(this.createCompleteButton());
				todoLi.appendChild(this.createDeleteButton());
				todoLi.appendChild(this.createEditButton());
				todosUl.appendChild(todoLi);
			}, this);			
		}
	},
	changeTodo: function(position) {
		var todo = todoList.todos[position];
		var todoLi = document.getElementById(position);
		todoLi.innerHTML = '';
		todoLi.appendChild(this.createEditInput(todo));
		todoLi.appendChild(this.createSaveButton());
		todoLi.appendChild(this.createCancelButton());
	},
	createDeleteButton: function() {
		var deleteButton = document.createElement('button');
		deleteButton.type = 'button';
		deleteButton.textContent = 'x';
		deleteButton.className = 'deleteButton btn btn-sm btn-danger';
		return deleteButton;
	},
	createCompleteButton: function() {
		var completeButton = document.createElement('button');
		completeButton.type = 'button';
		completeButton.textContent = 'v';
		completeButton.className = 'completeButton btn btn-sm btn-success';
		return completeButton;
	},
	createEditButton: function() {
		var editButton = document.createElement('button');
		editButton.type = 'button';
		editButton.textContent = 'edit';
		editButton.className = 'editButton btn btn-sm btn-primary';
		return editButton;
	},
	createEditInput: function(todo) {
		var editInput = document.createElement('input');
		editInput.type = 'text';
		editInput.value = todo.todoText;
		editInput.id = 'changeTodoTextInput';
		editInput.className += 'form-control';
		return editInput;
	},
	createSaveButton: function() {
		var saveButton = document.createElement('button');
		saveButton.type = 'button';
		saveButton.textContent = 'save';
		saveButton.className = 'saveButton btn btn-sm btn-success';
		return saveButton;
	},
	createCancelButton: function() {
		var cancelButton = document.createElement('button');
		cancelButton.type = 'button';
		cancelButton.textContent = 'cancel';
		cancelButton.className = 'cancelButton btn btn-sm btn-warning';
		return cancelButton;
	},
	setUpEventListeners: function() {
		var todosUl = document.querySelector('ul');

		todosUl.addEventListener('click', function(event) {
			
			var elementClicked = event.target;

			// console.log(event.target);

			if (elementClicked.classList.contains('deleteButton')) {
				handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('completeButton')) {
				handlers.toggleCompleted(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('editButton')) {
				handlers.changeTodo(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('saveButton')) {
				handlers.updateTodo(parseInt(elementClicked.parentNode.id));
			}

			if (elementClicked.classList.contains('cancelButton')) {
				getTodos();
			}
		});
	}
};


function getTodos() {
    $.getJSON('/mtodo/todo_list/', function (data) {
        djangoTodos = []
        for (var i=0; i < data.length; i++) {
           djangoTodos.push({
            pk: data[i].pk,
            todoText: data[i].fields.todo_text,
            completed: data[i].fields.completed
           });
        }
        todoList.todos = djangoTodos;
        view.displayTodos();
    });
};


view.setUpEventListeners();
getTodos();

