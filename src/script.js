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
const BEE_COUNT = 20;
const GAME_OVER_STATE = "YOU GOT BEE STING!! TAP TO PLAY AGAIN";
let IS_GAME_OVER = false;
let IS_GAME_WON = false;
const style_status = {
    EMPTY: 'empty',
    NEIGHBORED: 'neighbored',
    BOMB: 'bomb'
}

window.onload = function () {

    startGame();

    function gameOver(flatGrid) {
        document.querySelector('.game-state-text').textContent = GAME_OVER_STATE;
        document.querySelector('.game-state').style.display = 'flex';
        document.querySelector('.image').style.backgroundImage = "url('src/img/dizzy.png')";
        // document.querySelector('.bee').style.display = 'inline-block';
        flatGrid.forEach((cell) => {
            cell.el.classList.add(cell.state);
            cell.el.querySelector('.bomb-count').style.display = 'flex';
            if (cell.state === style_status.BOMB) {
                cell.el.querySelector('.bee').style.display = 'inline-block';
            }
            //remove all eventlisteners on cells
            cell.el.replaceWith(cell.el.cloneNode(true));
        });
    }
    function startGame() {
        const beeGrid = makeGrid(GRID_COUNT);
        mapBees(beeGrid, BEE_COUNT, GRID_COUNT);
        flatGrid = beeGrid.flat();
        flatGrid.forEach((cell) => {
            changeEmoji(cell);
            bombCount = checkCellState(beeGrid, cell, GRID_COUNT);
            cell.el.addEventListener('click', function () { gameLogic(cell, beeGrid) });
        })
    }
    function gameLogic(cell, grid) {
        cell.el.classList.add(cell.state);
        cell.el.querySelector('.bomb-count').style.display = "flex";
        revealEmptyCells(grid, cell, GRID_COUNT)
        if (cell.state == style_status.BOMB) {
            gameOver(flatGrid);
        }
    }
    function revealEmptyCells(grid, cell, size) {
        while (cell.isCellEmpty) {
            console.log('reveal empty cells while loop')
            // cell.el.classList.add(cell.state);
            neighbours = findNeighbourCells(grid, cell, size);
            neighbours.forEach((nbr) => {
                console.log('looping neighbours')
                if (nbr.isCellEmpty) {
                    nbr.el.classList.add(nbr.state);
                    console.log('neighbours if met')

                }
            });
            cell.isCellEmpty = false;
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
                    span = document.createElement('span');
                    span.setAttribute('class', 'bee');
                    cell.el.appendChild(span);
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
                // cell.el.classList.add(cell.state);
                span = cell.el.childNodes[0];
                span.textContent = bombCount.toString();
            }
            else if (bombCount === 0) {
                cell.state = style_status.EMPTY;
                // cell.el.classList.add(cell.state);

                cell.isCellEmpty = true;
            }
        }
        return bombCount;
    }

    //function to see if numbers match with generated numbers 
    function checkNumberMatch(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    function changeEmoji(cell) {
        let emoji = document.querySelector('.image');
        cell.el.addEventListener('mouseenter', function () {
            emoji.style.backgroundImage = "url('src/img/worried.png')"
        });
        cell.el.addEventListener('mouseout', function () {
            emoji.style.backgroundImage = "url('src/img/smiling.png')"
        });
        if (IS_GAME_WON)
            emoji.style.backgroundImage = "url('src/img/partying.png')";


    }
}