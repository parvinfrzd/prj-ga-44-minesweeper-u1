$(document).ready(function () {
    function MakeColumn(column) {
        for (let i = 0; i < column; i++) {
            //make columns and append them to container 
            $("<div class='column'/>").appendTo(".container");
        }
    }
    MakeColumn(10);
    MakeRow(10);
    function MakeRow(row) {
        columns = $('.column');
        console.log(columns);
        for (let j = 0; j < row; j++) {
            $("<button class='row'/>").appendTo('.column');
        }
    }
});