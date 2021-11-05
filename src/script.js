// click on cell to reveal the style_status of cell

// check win or lose 
//a. if a cell state is bee then you lose 
//b. if a cell state is not bee then you go on 

/*const cell = {
    DOM element, 
    x, 
    y, 
    style_status

}*/
const GRID_COUNT = 10;
const BEE_COUNT = 50;
const style_status = {
    EMPTY: 'empty',
    NEIGHBORED: 'neighbored',
    BOMB: 'bomb'
}

window.onload = function () {

    initGame();

    function initGame() {
        const beeGrid = makeGrid(GRID_COUNT);
        mapBees(beeGrid, BEE_COUNT, GRID_COUNT);
        flatGrid = beeGrid.flat();
        flatGrid.forEach((cell) => {
            bombCount = checkCellState(beeGrid, cell, GRID_COUNT);
            cell.el.addEventListener('click', function () {
                cell.el.classList.add(cell.state);
                cell.el.querySelector('.bomb-count').style.display = "block";
                revealEmptyCells(beeGrid, cell, GRID_COUNT)
                if (cell.state == style_status.BOMB) document.querySelector('.game-state').childNodes[0].textContent = 'GAME OVER!'
            });
        })
    }
    function revealEmptyCells(grid, cell, size) {
        if (cell.isCellEmpty) {
            neighbours = findNeighbourCells(grid, cell, size);
            neighbours.forEach((nbr) => {
                if (nbr.isCellEmpty) {
                    nbr.el.classList.add(nbr.state);
                }
            });
        }
    }

    function makeGrid(size) {
        grid = new Array()
        gridEl = document.querySelector('.grid');
        for (let i = 0; i < size; i++) {
            //make columns  
            column = new Array();
            for (let j = 0; j < size; j++) {
                //make div and display
                el = document.createElement('div');
                el.setAttribute('class', 'cell');
                span = document.createElement('span');
                span.setAttribute('class', 'bomb-count');
                el.appendChild(span);
                gridEl.appendChild(el);

                //construct cell 
                const cell = {
                    el,
                    x: i,
                    y: j,
                    isBee: false,
                    state: style_status.HIDDEN,
                    isCellEmpty: false
                }
                column.push(cell);
            }
            grid.push(column);
        }
        return grid;
    };

    function mapBees(grid, beeCount, size) {
        randomArr = generateRandom(beeCount, size)
        grid.forEach(column => column.forEach(function (cell) {
            randomArr.forEach(function (random) {
                if (checkNumberMatch(cell, random)) {
                    cell.isBee = true;
                    cell.state = style_status.BOMB;
                }
            });
        }));
        return grid;
    }

    //function to generate random x and y
    function generateRandom(beeCount, size) {
        let generatedNumbers = [];
        while (generatedNumbers.length < beeCount) {
            const index = {
                x: Math.floor(Math.random() * size),
                y: Math.floor(Math.random() * size)
            }
            if (!generatedNumbers.some(number => checkNumberMatch(number, index)))
                generatedNumbers.push(index);
        }
        return generatedNumbers;
    }

    function findNeighbourCells(grid, cell, size) {
        neighbours = [
            { x: cell.x + 1, y: cell.y + 1 },
            { x: cell.x + 1, y: cell.y - 1 },
            { x: cell.x + 1, y: cell.y },
            { x: cell.x - 1, y: cell.y - 1 },
            { x: cell.x - 1, y: cell.y + 1 },
            { x: cell.x - 1, y: cell.y },
            { x: cell.x, y: cell.y + 1 },
            { x: cell.x, y: cell.y - 1 }
        ];
        nbrCells = new Array();
        //filter the ones that are not in the grid. 
        let count = neighbours.length;
        while (count--) {
            if (neighbours[count].x < 0 || neighbours[count].y < 0 || neighbours[count].x > size - 1 || neighbours[count].y > size - 1) {
                const index = neighbours.indexOf(neighbours[count]);
                neighbours.splice(index, 1);
            }
        }

        neighbours.forEach((nbr) => {
            nbrCell = grid[nbr.x][nbr.y];
            nbrCells.push(nbrCell);
        });

        return nbrCells;
    }

    function checkCellState(grid, cell, count) {
        neighbours = findNeighbourCells(grid, cell, count);
        let bombCount = 0;
        neighbours.forEach((nbr) => {
            if (nbr.state === 'bomb') {
                bombCount += 1;
            }
        });
        if (cell.state !== 'bomb') {
            if (bombCount > 0) {
                cell.state = style_status.NEIGHBORED;
                span = cell.el.childNodes[0];
                span.textContent = bombCount.toString();
            }
            else if (bombCount === 0) {
                cell.state = style_status.EMPTY;
                cell.isCellEmpty = true;
            }
        }
        return bombCount;
    }

    //function to see if numbers match with generated numbers 
    function checkNumberMatch(a, b) {
        return a.x === b.x && a.y === b.y;
    }
}