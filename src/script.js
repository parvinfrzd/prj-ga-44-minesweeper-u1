let GRID_COUNT = 10;
let BEE_COUNT = 10;
const GAME_OVER_STATE = "YOU GOT BEE STING!! TAP TO PLAY AGAIN";
let IS_GAME_OVER = false;
let IS_GAME_WON = false;
let START_GAME = true;
let PIN_COUNT;
const style_status = {
    EMPTY: 'empty',
    NEIGHBORED: 'neighbored',
    BOMB: 'bomb',
    REVEALED: 'revealed'
}

window.onload = function () {

    startGame();
    settingHandler();

    function init() {
        document.querySelector('.setting').style.display = 'flex'
        //make grid empty
        let grid = document.querySelector('.grid');
        if (grid.hasChildNodes) {
            grid.innerHTML = '';
        }
        document.querySelector('.game-state').style.display = 'none';

    }

    function startGame() {
        init();
        PIN_COUNT = BEE_COUNT;
        if (START_GAME) {
            const beeGrid = makeGrid(GRID_COUNT);
            mapBees(beeGrid, BEE_COUNT, GRID_COUNT);
            flatGrid = beeGrid.flat();
            flatGrid.forEach((cell) => {
                changeEmoji(cell);
                bombCount = checkCellState(beeGrid, cell, GRID_COUNT);
                cell.el.addEventListener('click', function () { leftClickCell(cell, beeGrid) });
                cell.el.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    rightClickCell(cell);
                }, false);
            })
        }
    }

    function leftClickCell(cell, grid) {
        if (cell.state === style_status.BOMB) {
            gameOver(flatGrid);
        }
        else {
            //reveal cell 
            revealCell(cell);
            //get neighbours 
            console.log(cell)
            if (cell.state === style_status.EMPTY) {
                neighbours = findNeighbourCells(grid, cell, GRID_COUNT);
                // loop through neibours 
                neighbours.forEach((nbr) => {
                    //if neighoburs are not bomb 
                    if (nbr.state !== style_status.BOMB) {
                        revealCell(nbr);
                    }
                    //reveal the neighbour
                });
            }
            cell.state = style_status.REVEALED;
        }
    }

    function rightClickCell(cell) {
        console.log(PIN_COUNT)
        if (PIN_COUNT > 0)
            if (cell.state !== style_status.REVEALED && cell.isPinned == false) {
                console.log('pinned');
                cell.el.classList.add('pinned');
                cell.isPinned = true;
                PIN_COUNT -= 1;
            }
    }

    function revealCell(cell) {
        cell.el.classList.add(cell.state);
        cell.el.querySelector('.bomb-count').style.display = "flex";
        // cell.state = style_status.REVEALED;
    }
    function gameOver(flatGrid) {
        START_GAME = false;
        document.querySelector('.game-state-text').textContent = GAME_OVER_STATE;
        document.querySelector('.game-state').style.display = 'flex';
        document.querySelector('.image').style.backgroundImage = "url('src/img/dizzy.png')";
        flatGrid.forEach((cell) => {
            cell.el.classList.add(cell.state);
            cell.el.querySelector('.bomb-count').style.display = 'flex';
            if (cell.state === style_status.BOMB) {
                cell.el.querySelector('.bee').style.display = 'inline-block';
            }
            //remove all eventlisteners on cells
            cell.el.replaceWith(cell.el.cloneNode(true));
        });
        document.querySelector('.replay').addEventListener('click', function () { START_GAME = true; startGame(); });
    }

    function checkWinState() {
        //if the sum of pinned cells and revealed cells are the grid size 
        //then if the pinned cells are bombs > then win 
        //otherwise lose 
    }

    //first step: make a grid of cells 
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
                    isPinned: false
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
                span = cell.el.childNodes[0];
                span.textContent = bombCount.toString();
            }
            else if (bombCount === 0) {
                cell.state = style_status.EMPTY;
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

    function settingHandler() {
        const set_btn = document.querySelector('.menu');
        set_btn.addEventListener('click', function () { document.querySelector('.setting').style.display = 'flex'; });
        const play_btn = document.querySelector('.setting').querySelector('.replay');
        play_btn.addEventListener('click', function () {
            GRID_COUNT = document.getElementById('size').value;
            BEE_COUNT = document.getElementById('bees').value;
            document.querySelector('.grid').style.setProperty('grid-template-columns', `repeat(${GRID_COUNT}, auto)`);
            startGame();
            document.querySelector('.setting').style.display = 'none';
        });
    }
}