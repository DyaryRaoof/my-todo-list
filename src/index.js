import './style.css';

const button = document.querySelector('button');
class Todo {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

const todos = [
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
          <input type="checkbox">
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

window.addEventListener('load', () => {
  populate();
});
