import './style.css';
import update from './update.js';
import { addTodo, deleteTodo, updateTodo } from './crud';

const button = document.querySelector('button');
class Todo {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

let todos = [];

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.innerHTML = `
    <div class="flex todo-element">
      <div>
          <input type="checkbox" class="checkbox" 
          ${todo.completed ? 'checked' : ''}>
          <span>${todo.description}</span>
      </div>
      <span class="material-icons edit-icon" style="cursor: pointer">
          more_vert
      </span>
    </div>
    <hr>`;

  return li;
}

function createReplaceTodoElement(todo) {
  const html = `
  <div>
    <input type="checkbox" class="checkbox" 
    ${todo.completed ? 'checked' : ''}>
    <span>${todo.description}</span>
  </div>
  <span class="material-icons edit-icon" style=" cursor: pointer">
      more_vert
  </span>
    `;

  return html;
}

function addTodoElement(todo) {
  const li = createTodoElement(todo);
  button.parentElement.insertBefore(li, button);
}

function populate() {
  todos.sort((a, b) => (a.index > b.index ? 1 : -1));
  todos.forEach((todo) => {
    addTodoElement(todo);
  });
}

function saveTodosLocally() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createReplaceTodoElementForCompletedTask(todo) {
  const html = `
  
  <div>
  <span class="material-icons edit-icon" style=" cursor: pointer; color: green">
      done
  </span>
    <strike><span>${todo.description}</span></strike>
  </div>
  <span class="material-icons edit-icon" style=" cursor: pointer">
      more_vert
  </span>
    `;

  return html;
}

function changeElementToCompleted(index) {
  update(todos[index]);
  saveTodosLocally();
  if (todos[index].completed) {
    const completedElement = createReplaceTodoElementForCompletedTask(todos[index]);
    const todoElements = document.querySelectorAll('.todo-element');
    todoElements[index].innerHTML = completedElement;
  }
}

function addEventsToCheckboxes(recievedIndex) {
  const checkboxes = document.querySelectorAll('.checkbox');

  checkboxes.forEach((checkbox, index) => {
    if (recievedIndex) {
      if (recievedIndex === index) {
        checkbox.addEventListener('change', () => {
          changeElementToCompleted(index);
        });
      }
    } else {
      checkbox.addEventListener('change', () => {
        changeElementToCompleted(index);
      });
    }
  });
}

function addEventsToEditIcons() {
  const editIcons = document.querySelectorAll('.edit-icon');
  const todoElements = document.querySelectorAll('.todo-element');

  todos.forEach((todo, index) => {
    editIcons[index].addEventListener('click', () => {
      const div = document.createElement('div');
      div.classList.add('flex', 'todo-element');
      div.style.backgroundColor = '#FFFBAE';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('checkbox');
      checkbox.checked = todo.completed;

      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('edit-input');
      input.value = todo.description;
      input.style.backgroundColor = 'transparent';

      const span = document.createElement('span');
      span.classList.add('material-icons', 'edit-icon');
      span.style.marginLeft = 'auto';
      span.style.cursor = 'pointer';
      span.innerHTML = 'delete';

      div.appendChild(checkbox);
      div.appendChild(input);
      div.appendChild(span);

      todoElements[index].replaceWith(div);

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const todo = todos[index];
          todo.description = input.value;
          updateTodo(todo, todos[index]);
          const html = createReplaceTodoElement(todo);
          div.innerHTML = html;
          addEventsToEditIcons();
          saveTodosLocally();
          div.style.backgroundColor = 'white';
        }
      });

      span.addEventListener('click', () => {
        saveTodosLocally();
        deleteTodo(todo, todos);
        div.parentElement.remove();
        saveTodosLocally();
      });
    });
  });
}

window.addEventListener('load', () => {
  const oldTodos = JSON.parse(localStorage.getItem('todos'));
  if (oldTodos) {
    todos = oldTodos;
  }
  populate();
  addEventsToCheckboxes();
  addEventsToEditIcons();
});

function addEventListenerToInput() {
  const input = document.querySelector('#input');
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const todo = new Todo(input.value, false, todos.length + 1);
      addTodo(todo, todos);
      addTodoElement(todo);
      saveTodosLocally();
      input.value = '';
      addEventsToEditIcons(todos.length);
      addEventsToCheckboxes(todos.length - 1);
    }
  });
}

addEventListenerToInput();

button.addEventListener('click', () => {
  const todoElements = document.querySelectorAll('.todo-element');
  const removedTodos = [];
  for (let i = 0; i < todos.length; i += 1) {
    if (todos[i].completed === true) {
      removedTodos.push(todos[i]);
      todoElements[i].parentNode.remove();
    }
  }

  removedTodos.forEach((todo) => {
    deleteTodo(todo, todos);
  });

  saveTodosLocally();
});
