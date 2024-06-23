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

// Отслеживание события отправки формы (списка дел)
// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask)
// Отмечаем задачу выполненной
tasksList.addEventListener('click', doneTask)

// Функции

// event отменяет перезагрузку сайта при отправки формы!
function addTask(event) {
        // отменяем отправку формы
        event.preventDefault();

        // Достаём текст задачи из поля ввода
        const taskText = taskInput.value;

        // Описываем задачу в виде объекта
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false,
        }

        // Добавляем задачу в массив с задачами
        tasks.push(newTask);

        // Добавляем задачу в хранилище браузера LocalStorage
        saveToLocalStorage();

        renderTask(newTask);
    
        // Очищаем поле ввода
        taskInput.value = "";
        // Даёт возможность перевести фокус на ввод текста (не нужно нажимать снова на поле ввода)
        taskInput.focus();
        checkEmptyList();
}

// Функция, выполняющая удаление задачи
function deleteTask(event) {
    // Проверяем если клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;

    // Проверяет что клик был по кнопке "удалить задачу"
    const parenNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parenNode.id);
    
    // Находим индекс задачи в массиве
    const index = tasks.findIndex( (task) => task.id === id);

    // Удаляем задачу из массива с задачами
    tasks.splice(index, 1)

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    // Удаляем задачу из разметки
    parenNode.remove();

    checkEmptyList();
}
// Функция, отмечающая задачу выполненной
function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;

// Проверяем что клик был по кнопке "добавить задачу"
    const parentNode = event.target.closest('.list-group-item');

    // определяем ID задачи
    const id = Number(parentNode.id);
    const task = tasks.find( (task) => task.id === id)
    task.done = !task.done

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
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
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // Формируем CSS класс
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // Формируем разметку для новой задачи
    const taskHTML = `				
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
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
