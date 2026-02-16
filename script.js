'use strict';

const grid = document.getElementById('grid');
const homeMenu = document.getElementById('home');
const editor = document.getElementById('editor');
const btnNew = document.getElementById('newMap');
const btnBackHome = document.getElementById('backHome');
const btnClear = document.getElementById('clear');
const btnSave = document.getElementById('save');
const btnOpen = document.getElementById('openFromStorage');
const mapListDiv = document.getElementById('mapList');
const savedMapsList = document.getElementById('savedMapsList');
const btnCloseMapList = document.getElementById('closeMapList');
const btnSaveToFile = document.getElementById('saveToFile');
const btnOpenFromFile = document.getElementById('openFromFile');

const btnDrive = document.getElementById('drive');

editor.classList.add('hidden');

let driving = false;

let car = null;
let carX = 0;
let carY = 0;
let carRotation = 0;

const WIDTH = 20;
const HEIGHT = 20;

let mapData = Array.from({ length: WIDTH * HEIGHT }, () => ({
    type: 0,
    startingLine: false
}));

function switchToEditor() {
    renderGrid();
    editor.classList.remove('hidden');
    homeMenu.classList.add('hidden');
    mapListDiv.classList.add('hidden');
}

function resetMapData() {
    mapData = Array.from({ length: WIDTH * HEIGHT }, () => ({
        type: 0,
        startingLine: false
    }));
}

function getTileAt(x, y) {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return 0;
    return mapData[y * WIDTH + x].type;
}

function updateRoadVisuals() {
    const cells = grid.children;

    for (let i = 0; i < 400; i++) {
        const cell = cells[i];
        const cellData = mapData[i];
        const type = cellData.type;

        cell.className = 'cell';
        cell.dataset.state = type;

        if (cellData.startingLine) {
            cell.classList.add('startFinish');
        }

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
    resetMapData();
    switchToEditor();
});

btnBackHome.addEventListener('click', (e) => {
    e.preventDefault();
    homeMenu.classList.remove('hidden');
    editor.classList.add('hidden');
});

btnClear.addEventListener('click', () => {
    resetMapData();
    renderGrid();
});

grid.addEventListener("click", e => {
    e.preventDefault();

    if (!e.target.classList.contains("cell")) return;

    const index = Number(e.target.dataset.index);
    const cellData = mapData[index];

    if (cellData.type === 1 && e.ctrlKey) {
        if (!cellData.startingLine) {
            mapData.forEach(cell => cell.startingLine = false);
            cellData.startingLine = true;
        }
        else {
            cellData.startingLine = false;
        }
    }
    else {
        cellData.type = (cellData.type + 1) % 4;
        if(cellData.type !== 1) {
            cellData.startingLine = false;
        }
    }

    updateRoadVisuals();
});

btnSave.addEventListener('click', () => {
    const mapName = prompt("Input name for the map: ");
    if (mapName) {
        localStorage.setItem(mapName, JSON.stringify(mapData));
        alert("Saved");
    }
});

btnSaveToFile.addEventListener('click', () => {
    const mapName = prompt("Input name for the map: ");

    if (mapName) {

        const dataStr = JSON.stringify(mapData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${mapName}.json`;
        document.body.appendChild(link);
        link.click(); // vytvořim element a kliknu na něj abych to stáhnul protože saveFile() neexistuje for security reasons

        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert("Saved");
    }
})

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
                    switchToEditor();
                }
            });
            savedMapsList.appendChild(li);
        }
    }

    mapListDiv.classList.remove('hidden');
});

btnOpenFromFile.addEventListener('click', (e) => {
    e.preventDefault();

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (loadEvent) => {
            try {
                const importedData = JSON.parse(loadEvent.target.result);

                mapData = importedData;
                switchToEditor();


                console.log("Data loaded successfully:", importedData);
            } catch (err) {
                alert("Error parsing JSON: " + err.message);
            }
        };
        reader.readAsText(file);
    };
    fileInput.click();
})

btnCloseMapList.addEventListener('click', () => {
    mapListDiv.classList.add('hidden');
});

btnDrive.addEventListener('click', () => {
    if (driving) {
        driving = false;
        btnDrive.innerHTML = 'Drive';
        if (car) {
            car.remove();
            car = null;
        }
        switchToEditor();
    } else {
        const startIndex = mapData.findIndex(tile => tile.startingLine);

        if (startIndex === -1) {
            alert("No starting line found! Ctrl+Click a road to set one.");
            return;
        }
        driving = true;
        btnDrive.innerHTML = 'Stop';

        carX = startIndex % WIDTH;
        carY = Math.floor(startIndex / WIDTH);
        carRotation = 0;

        car = document.createElement('div');
        car.classList.add('car');
        grid.appendChild(car);

        updateCarVisuals();
    }
});

document.addEventListener('keydown', (e) => {
    if (!driving || !car) return;
    let nextX = carX;
    let nextY = carY;
    switch(e.key) {
        case 'ArrowUp':
            nextY--;
            carRotation = 0;
            break;
        case 'ArrowDown':
            nextY++;
            carRotation = 180;
            break;
        case 'ArrowLeft':
            nextX--;
            carRotation = 270;
            break;
        case 'ArrowRight':
            nextX++;
            carRotation = 90;
            break;
        default:
            return;
    }
    e.preventDefault();
    const nextTileType = getTileAt(nextX, nextY);
    if (nextTileType === 1) {
        carX = nextX;
        carY = nextY;
        updateCarVisuals();
    } else {
        console.log("Bonk! Not a road.");
    }
});

function updateCarVisuals() {
    if (!car) return;
    car.style.left = (carX * 5) + '%';
    car.style.top = (carY * 5) + '%';
    car.style.transform = `rotate(${carRotation}deg)`;
}


