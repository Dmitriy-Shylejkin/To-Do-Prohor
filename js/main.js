// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

// Редактирование задачи
tasksList.addEventListener('dblclick', editTask);

// Функции
function addTask (event) {
  // Отменяем отправку формы 
  event.preventDefault();

  // Достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // Проверка на пустое поле
  if (!taskText) {
    alert('Введите текст задачи');
    return;
  }

  // Проверка на уже существующую задачу
  if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
    alert('Такая задача уже существует');
    return;
  }

  // Описываем задачу в виде обьекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  }

  // Добавляем задачу в массив с задачами
  tasks.push(newTask);

  saveToLocalStorage();
  
  renderTask(newTask);

  // Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // Проверяем если клик был НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'delete') return;

  // Проверяем что клик был по кнопке удаления
    const parenNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parenNode.id);

    // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id);

    // Удаляем задачу из массива
    tasks.splice(index, 1);

    saveToLocalStorage();

    // Удаляем задачу из разметки
    parenNode.remove();

    checkEmptyList();
}

function doneTask(event) {
  // Проверяем если клик был НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.list-group-item');

  // Определяем id задачи
  const id = Number(parentNode.id);
  const task = tasks.find ((task) => task.id === id );
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function editTask(event) {
  if (event.target.classList.contains('task-title')) {
    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);

    const newText = prompt('Введите новое название задачи:', task.text);

    // Если пользователь отменил ввод
    if (newText === null) return;

    const trimmedText = newText.trim();

    // Проверка на пустое поле
    if (!trimmedText) {
      alert('Поле не может быть пустым');
      return;
    }

    // Проверка на уже существующую задачу
    if (tasks.some(t => t.text.toLowerCase() === trimmedText.toLowerCase() && t.id !== id)) {
      alert('Задача с таким именем уже существует');
      return;
    }

    task.text = trimmedText;
    saveToLocalStorage();
    parentNode.querySelector('.task-title').textContent = trimmedText;
  }
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/5321428556637546691_000-transformed.png" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
} 

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем CSS класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // Формируем разметку для новой задачи
  const taskHTML = `<li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
              <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
              </button>
              <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
              </button>
            </div>
          </li>`;

  // Добавляем задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

