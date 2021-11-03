//make a grid with  cells  and bees

// click on cell to reveal the status of cell

// check win or lose 
//a. if a cell state is bee then you lose 
//b. if a cell state is not bee then you go on 
/*const cell = {
    DOM element, 
    x, 
    y, 
    STATUS

}*/

window.onload = function () {
    const status = {
        HIDDEN: 'hidden',
        REVEALED: 'revealed',
    }
    const gridCount = 3;
    const bees = 3;
    const beeGrid = MakeGridAndBees(gridCount);
    MakeBees(beeGrid, bees);

    function MakeGridAndBees(size) {
        grid = []
        gridEl = document.querySelector('.grid');
        for (let i = 0; i < size; i++) {
            //make columns  
            column = new Array(size);
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
                    state: status.HIDDEN
                }
                column.push(cell);
            }
            grid.push(column);
        }
        return grid;
    };

    function MakeBees(grid, beeCount) {
        randomArr = generateRandom(beeCount)
        grid.forEach(column => column.forEach(function (cell) {
            randomArr.forEach(function (random) {
                if (checkeNumberMatch(cell, random)) {
                    cell.isBee = true;
                    cell.el.style.backgroundColor = 'red';
                }
            });
        }));
        console.log(grid);
        return grid;
    }

    //function to generate random x and y
    function generateRandom(beeCount) {
        let generatedNumbers = [];
        for (let i = 0; i < beeCount; i++) {
            const index = {
                x: Math.floor(Math.random() * beeCount),
                y: Math.floor(Math.random() * beeCount)
            }
            //doesn't work!
            if (!generatedNumbers.includes(index)) {
                generatedNumbers.push(index);
            }
        }
        console.log(generatedNumbers);
        return generatedNumbers;
    }
    //function to see if numbers match with generated numbers 
    function checkeNumberMatch(a, b) {
        return a.x === b.x && a.y === b.y;
    }


}