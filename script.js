'use strict';

const grid = document.getElementById('grid');
const homeMenu = document.getElementById('home');
const editor = document.getElementById('editor');
const btnNew = document.getElementById('newMap');
const btnBackHome = document.getElementById('backHome');
const btnClear = document.getElementById('clear');
const btnSave = document.getElementById('save');
const btnOpen = document.getElementById('openFromFile');
const mapListDiv = document.getElementById('mapList');
const savedMapsList = document.getElementById('savedMapsList');
const btnCloseMapList = document.getElementById('closeMapList');

editor.classList.add('hidden');

const WIDTH = 20;
const HEIGHT = 20;
let mapData = new Array(WIDTH * HEIGHT).fill(0);

function getTileAt(x, y) {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return 0;
    return mapData[y * WIDTH + x];
}

function updateRoadVisuals() {
    const cells = grid.children;

    for (let i = 0; i < 400; i++) {
        const cell = cells[i];
        const type = mapData[i];

        cell.className = 'cell';
        cell.dataset.state = type;

        if (type !== 1) continue;

        const x = i % WIDTH;
        const y = Math.floor(i / HEIGHT);

        const n = getTileAt(x, y - 1) === 1;
        const s = getTileAt(x, y + 1) === 1;
        const e = getTileAt(x + 1, y) === 1;
        const w = getTileAt(x - 1, y) === 1;

        if (n && s && !e && !w) {
        } else if (!n && !s && e && w) {
            cell.classList.add('rotate-90');
        } else if (s && e) {
            cell.classList.add('is-corner');
        } else if (s && w) {
            cell.classList.add('is-corner', 'rotate-90');
        } else if (n && w) {
            cell.classList.add('is-corner', 'rotate-180');
        } else if (n && e) {
            cell.classList.add('is-corner', 'rotate-270');
        } else if (n || s) {
        } else if (e || w) {
            cell.classList.add('rotate-90');
        }
    }
}

function renderGrid() {
    grid.innerHTML = '';
    mapData.forEach((state, index) => {
        const cell = document.createElement("span");
        cell.classList.add('cell');
        cell.dataset.index = index;
        grid.appendChild(cell);
    });
    updateRoadVisuals();
}

renderGrid();

btnNew.addEventListener('click', (e) => {
    e.preventDefault();
    mapData.fill(0);
    renderGrid();
    editor.classList.remove('hidden');
    homeMenu.classList.add('hidden');
});

btnBackHome.addEventListener('click', (e) => {
    e.preventDefault();
    homeMenu.classList.remove('hidden');
    editor.classList.add('hidden');
});

btnClear.addEventListener('click', () => {
    mapData.fill(0);
    renderGrid();
});

grid.addEventListener("click", e => {
    if (!e.target.classList.contains("cell")) return;
    const index = Number(e.target.dataset.index);

    mapData[index] = (mapData[index] + 1) % 4;

    updateRoadVisuals();
});

btnSave.addEventListener('click', () => {
    const mapName = prompt("Input name for the map: ");
    if (mapName) {
        localStorage.setItem(mapName, JSON.stringify(mapData));
        alert("Saved");
    }
});

btnOpen.addEventListener('click', (e) => {
    e.preventDefault();

    savedMapsList.innerHTML = '';

    if (localStorage.length === 0) {
        savedMapsList.innerHTML = '<li>No saved Maps</li>';
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const li = document.createElement('li');
            li.textContent = key;

            li.addEventListener('click', () => {
                const savedData = localStorage.getItem(key);
                if(savedData) {
                    mapData = JSON.parse(savedData);
                    renderGrid();
                    editor.classList.remove('hidden');
                    homeMenu.classList.add('hidden');
                    mapListDiv.classList.add('hidden');
                }
            });
            savedMapsList.appendChild(li);
        }
    }

    mapListDiv.classList.remove('hidden');
});

btnCloseMapList.addEventListener('click', () => {
    mapListDiv.classList.add('hidden');
});
