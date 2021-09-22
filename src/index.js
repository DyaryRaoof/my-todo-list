import './style.css';
import update from './update.js';

const button = document.querySelector('button');
class Todo {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

let todos = [
  new Todo('Hello world 1', false, 0),
  new Todo('Hello world 2', false, 1),
  new Todo('Hello world 5', false, 4),
  new Todo('Hello world 3', false, 2),
  new Todo('Hello world 4', false, 3),
];

function populate() {
  todos.sort((a, b) => (a.index > b.index ? 1 : -1));
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.innerHTML = `
    <div class="flex">
      <div>
          <input type="checkbox" class="checkbox" 
          ${todo.completed ? 'checked' : ''}>
          <span>${todo.description}</span>
      </div>
      <span class="material-icons">
          more_vert
      </span>
    </div>
    <hr>`;

    button.parentElement.insertBefore(li, button);
  });
}

function saveTodosLocally() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addEventsToCheckboxes() {
  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
      update(todos[index]);
      saveTodosLocally();
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
});
