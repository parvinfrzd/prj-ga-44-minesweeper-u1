// click on cell to reveal the styleStatus of cell

// check win or lose 
//a. if a cell state is bee then you lose 
//b. if a cell state is not bee then you go on 

/*const cell = {
    DOM element, 
    x, 
    y, 
    styleStatus

}*/
const gridCount = 10;
const bees = 10;


window.onload = function () {
    const styleStatus = {
        EMPTY: 'empty',
        NEIGHBORED: 'neighbored',
        BOMB: 'bomb'
    }

    const beeGrid = MakeGrid(gridCount);
    MakeBees(beeGrid, bees, gridCount);
    flatGrid = beeGrid.flat();
    flatGrid.forEach((cell) => {
        console.log(FindNeighbourCells(beeGrid, cell, gridCount));
        checkCellState(beeGrid, cell, gridCount);
    })


    function ClickToGo() {
        //click to reveal 
    }

    function MakeGrid(size) {
        grid = new Array()
        gridEl = document.querySelector('.grid');
        for (let i = 0; i < size; i++) {
            //make columns  
            column = new Array();
            for (let j = 0; j < size; j++) {
                //make div and display
                el = document.createElement('div');
                el.setAttribute('class', 'cell');
                gridEl.appendChild(el);

                //construct cell 
                const cell = {
                    el,
                    x: i,
                    y: j,
                    isBee: false,
                    state: styleStatus.HIDDEN
                }
                column.push(cell);
            }
            grid.push(column);
        }
        return grid;
    };

    function MakeBees(grid, beeCount, size) {
        randomArr = generateRandom(beeCount, size)
        grid.forEach(column => column.forEach(function (cell) {
            randomArr.forEach(function (random) {
                if (checkNumberMatch(cell, random)) {
                    cell.isBee = true;
                    cell.state = styleStatus.BOMB;
                    cell.el.setAttribute('class', `cell ${cell.state}`);
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

    function FindNeighbourCells(grid, cell, size) {
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
        neighbours = FindNeighbourCells(grid, cell, count);
        let bombCount = 0;
        neighbours.forEach((nbr) => {
            if (nbr.state === 'bomb') {
                bombCount += 1;
            }
        });

        if (cell.state !== 'bomb')
            cell.el.innerHTML = bombCount.toString();
    }

    //function to see if numbers match with generated numbers 
    function checkNumberMatch(a, b) {
        return a.x === b.x && a.y === b.y;
    }
}