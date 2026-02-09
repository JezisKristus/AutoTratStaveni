'use strict';

const grid = document.getElementById('grid');
const homeMenu = document.getElementById('home');
const editor = document.getElementById('editor');
const btnNew = document.getElementById('newMap');
const btnBackHome = document.getElementById('backHome');
const btnClear = document.getElementById('clear');

editor.classList.add('hidden');

btnClear.addEventListener('click', () => {
    for(let i = 0; i < 400; i++) {
       grid.children[i].dataset.state = 0;
    }
})

btnNew.addEventListener('click', (e) => {
    e.preventDefault();
    editor.classList.remove('hidden');
    homeMenu.classList.add('hidden');
})

btnBackHome.addEventListener('click', (e) => {
    e.preventDefault();
    homeMenu.classList.remove('hidden');
    editor.classList.add('hidden');
})

for(let i = 0; i < 400; i++) {
    const cell = document.createElement("span");
    cell.classList.add('cell');
    cell.dataset.state = 0;

    grid.appendChild(cell);
}

grid.addEventListener("click", e => {
    if (!e.target.classList.contains("cell")) return;
    e.target.dataset.state =
        (Number(e.target.dataset.state) + 1) % 4;
});

