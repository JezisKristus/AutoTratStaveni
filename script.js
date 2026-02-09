'use strict';

const grid = document.getElementById('grid');
const homeMenu = document.getElementById('home');
const editor = document.getElementById('editor');
const btnNew = document.getElementById('newMap');


editor.classList.add('hidden');

btnNew.addEventListener('click', (e) => {
    e.preventDefault();
    editor.classList.remove('hidden');
    homeMenu.classList.add('hidden');
})

for(let i = 0; i < 400; i++) {
    const cell = document.createElement("span");
    grid.appendChild(cell);
}

