'use strict';

const grid = document.getElementById('grid');

for(let i = 0; i < 20; i++) {
    grid.insertRow(i);
    for (let j = 0; j < 20; j++) {
        grid.rows.item(i).insertCell(j);
    }
}