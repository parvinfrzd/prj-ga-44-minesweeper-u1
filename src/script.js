let GRID_COUNT = 5;
let BEE_COUNT = 2;
const GAME_OVER_STATE = "YOU GOT BEE STING!! TAP TO PLAY AGAIN";
const GAME_WIN_STATE = "YOU WON! WANT TO CHALLENGE YOURSELF WITH A LARGER GRID?";
let IS_GAME_OVER = false;
let IS_GAME_WON = false;
let START_GAME = true;
let PIN_COUNT;
let REVEALED_CELLS = 0;
let PINNED_CELLS = 0;
const style_status = {
    PINNED: 'pinned',
    EMPTY: 'empty',
    NEIGHBORED: 'neighbored',
    BOMB: 'bomb',
    HIDDEN: 'hidden'
}



//check window on load
window.onload = function () {
    let emoji = document.querySelector('.image');
    let replayButton = document.querySelector('.replay');
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
        document.querySelector('.game-win').style.display = 'none';

        REVEALED_CELLS = 0;
        PINNED_CELLS = 0;

    }

    function startGame() {
        init();
        PIN_COUNT = BEE_COUNT;
        // if (START_GAME) {
        const beeGrid = makeGrid(GRID_COUNT, BEE_COUNT);
        beeGrid.forEach(column => column.forEach(function (cell) {
            changeEmoji(cell);
            checkCellState(beeGrid, cell, GRID_COUNT);
            cell.el.addEventListener('click', function () { revealCell(beeGrid, cell) });
            cell.el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                pinCell(beeGrid, cell);
            }, false);
        }));
    }


    function pinCell(grid, cell) {
        if (PIN_COUNT > 0) {
            if (!cell.isPinned) {
                cell.isPinned = true;
                cell.state = style_status.NEIGHBORED;
                cell.el.classList.add(`${style_status.PINNED}`);
            }
        }
        if (checkWinState(grid)) {
            document.querySelector('.game-win-text').textContent = GAME_WIN_STATE;
            document.querySelector('.game-win').style.display = 'flex';
            document.querySelector('.replay-win').addEventListener('click', function () { startGame(); });
        }

    }

    function revealCell(grid, cell) {
        if (cell.state === style_status.BOMB) {
            gameOver(grid);
        }

        if (cell.state !== style_status.HIDDEN) {
            return;
        }

        cell.state = style_status.NEIGHBORED;
        const neighbours = findNeighbourCells(grid, cell, GRID_COUNT);
        if (cell.beeCount === 0) {
            cell.el.classList.add(`${style_status.EMPTY}`)
            neighbours.forEach(revealCell.bind(null, grid));

        } else if (cell.beeCount > 0) {
            cell.el.classList.add(`${style_status.NEIGHBORED}`)
            cell.el.querySelector('.bomb-count').style.display = "flex";
        }

        if (checkWinState(grid)) {
            document.querySelector('.game-win-text').textContent = GAME_WIN_STATE;
            document.querySelector('.game-win').style.display = 'flex';
            document.querySelector('.replay').addEventListener('click', function () { startGame(); });
        }

    }

    function gameOver(grid) {
        document.querySelector('.game-state-text').textContent = GAME_OVER_STATE;
        document.querySelector('.game-state').style.display = 'flex';
        emoji.style.backgroundImage = "url('src/img/dizzy.png')";
        const flatGrid = grid.flat();
        flatGrid.forEach((cell) => {

            if (cell.beeCount > 0) {
                cell.el.classList.add(`${style_status.NEIGHBORED}`)
                cell.el.querySelector('.bomb-count').style.display = 'flex';
            }
            if (cell.state === style_status.BOMB) {
                cell.el.querySelector('.bee').style.display = 'inline-block';
            }
            //remove all eventlisteners on cells
            cell.el.replaceWith(cell.el.cloneNode(true));
        });
        document.querySelector('.replay').addEventListener('click', function () { startGame(); });
    }



    function checkWinState(grid) {
        return grid.every(column => column.every(cell => {
            return (cell.state === style_status.NEIGHBORED) ||
                (cell.state === style_status.BOMB && (cell.isPinned === true))
        }));
    }

    //first step: make a grid of cells 
    function makeGrid(size, bees) {
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
                    beeCount: 0,
                    state: style_status.HIDDEN,
                    isPinned: false
                }
                column.push(cell);
            }
            grid.push(column);
        }
        const grid_with_bees = mapBees(grid, bees, size);

        return grid_with_bees;
    }

    function mapBees(grid, beeCount, size) {
        randomArr = generateRandom(beeCount, size)
        grid.forEach(column => column.forEach(function (cell) {
            randomArr.forEach(function (random) {
                if (checkNumberMatch(cell, random)) {
                    cell.state = style_status.BOMB;
                    cell.el.classList.add(cell.state);
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

    function checkCellState(grid, cell, size) {

        neighbours = findNeighbourCells(grid, cell, size);
        neighbours.forEach((nbr) => {
            if (nbr.state === style_status.BOMB) {
                cell.beeCount += 1;
            }
        });
        if (cell.beeCount > 0 && cell.state !== style_status.BOMB) {
            span = cell.el.childNodes[0];
            span.textContent = cell.beeCount.toString();
        }
    }

    //function to see if numbers match with generated numbers 
    function checkNumberMatch(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    function changeEmoji(cell) {
        cell.el.addEventListener('mouseenter', function () {
            emoji.style.backgroundImage = "url('src/img/worried.png')"
        });
        cell.el.addEventListener('mouseout', function () {
            emoji.style.backgroundImage = "url('src/img/smiling.png')"
        });
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
