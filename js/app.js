// console.log('ok');

// TODO: come editare colonne del grid:
// const prova = document.querySelector('.tableContainer');
// console.log(prova);
// prova.style.gridTemplateColumns = "repeat(10, 1fr)";
// console.log(prova);

// recupero tasto play dal DOM
const play = document.querySelector("input[type='submit']");
// console.log(play);

// avvio il gioco al click
play.addEventListener('click', playGame);

// funzione di avvio del gioco
function playGame() {
    // console.log("gioca");

    // recupero status img e la rendo visibile
    const statusImg = document.getElementById('statusImg');
    statusImg.src = "img/smile.png";
    statusImg.style.display = "block";
    // console.dir(statusImg);


    // recupero difficoltà dal DOM
    let rowNum = parseInt(document.querySelector('select').value);

    // riferimento griglia dal DOM
    let tableContainerElement = document.querySelector('.tableContainer');
    // console.log(tableContainerElement);

    // imposto lo stile in base alla difficoltà
    tableContainerElement.style.gridTemplateColumns = `repeat(${rowNum},1fr)`;


    const cellsNum = rowNum ** 2;

    // Creo la griglia in html
    const myGrid = createGrid(cellsNum, tableContainerElement);
    // console.log(myGrid);


    let bombsNum = getBombsNum(rowNum);
    // console.log(bombsNum);

    // genero un array di numeri random
    const bombsArray = getBombsArray(bombsNum, cellsNum);
    // console.log(bombsArray);

    // inserisco le bombe
    insertBombs(bombsArray, myGrid);

    // Creo una matrice
    const matrix = createMatrix(rowNum, myGrid);
    // matrix[x,y]
    console.log(matrix[0][5]);

}

// funzione che crea la griglia
function createGrid(dim, tableContainer) {
    // console.log(tableContainer.innerHTML);

    // creo l'array da ritornare
    const grid = [];
    // problema, anche svuotando gli event listner del gioco precedente rimangono attivi - problemi di performance dopo molti new game
    // => SE table container non è vuoto chiamo clearGame e svuoto
    if (tableContainer.innerHTML != '') {
        clearGame();
        tableContainer.innerHTML = '';
    }

    // console.log('OK', dim, tableContainer);

    // PER OGNI ciclo generare elemento html (square) e lo inserisco nel DOM
    for (let i = 0; i < dim; i++) {
        const cell = getSquareElement();

        //TODO: da rimuovere
        cell.innerHTML = i + 1;

        // appendere elemento al tabellone
        tableContainer.append(cell);
        grid.push(cell);
    }

    return grid;
}

// funzione che crea l'elemento casella
function getSquareElement() {
    const square = document.createElement('div');
    square.classList.add('square');
    // aggancia evento click
    square.addEventListener('click', clickHandler);
    return square;
}

// funzione che gestisce il click
function clickHandler() {
    const square = this;
    if (square.classList[1] == 'bomb') {
        statusImg.src = "img/sad.png"
        clearGame();
    }
    square.classList.toggle('clicked');

    // scrivo in console il numero della cella
    // console.log(square.innerHTML);

    // dobbiamo far sì che una volta partita la funzione venga rimosso l'evento
    square.removeEventListener('click', clickHandler);
}

// funzione che "pulisce" il gioco all'avvio di un new game
function clearGame() {
    // so che se non è vuoto, tutti gli elementi avranno ALMENO la classe square
    const squareElements = document.querySelectorAll('.square');
    // console.log(squareElements.length);

    // PER OGNI elemento square, rimuovo l'evento click
    for (let i = 0; i < squareElements.length; i++) {
        squareElements[i].removeEventListener('click', clickHandler);
        // console.dir(squareElements[i]);
    }
}

// funzione di supporto al filtro per eliminare doppioni da un array
const unique = (value, index, self) => {
    return self.indexOf(value) === index;
}

// funzione che genera il numero di bombe presenti
const getBombsNum = (dim) => {
    if (dim == 7) {
        return dim;
    } else if (dim === 9) {
        return dim * 2;
    } else {
        return dim * 3;
    }
    // console.log("NUMERO: ", bombsNum);
}

// funzione che genera un array con la posizione delle bombe
const getBombsArray = (dim, num) => {
    const array = [];
    for (let i = 0; i < dim; i++) {
        array[i] = Math.floor(Math.random() * num);
        // SE elemento ripetuto, ripeto il ciclo decrementando i
        // TODO: trovata su internet, non so come funzioni...
        const uniqueBombs = array.filter(unique);
        if (array.length > uniqueBombs.length) {
            i--;
        }
    }
    return array;
}

function insertBombs(bombs, grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < bombs.length; j++) {
            if (bombs[j] === i) {
                grid[i].classList.add('bomb');
                // console.log(grid[i]);
            }
        }
    }

    //TODO: SUPERFLUO
    // stampo in console dove sono le bombe
    for (let i = 0; i < bombs.length; i++) {
        console.log((bombs[i] + 1));
    }
}

// funzione che trasforma una griglia in una matrice
function createMatrix(row, grid) {
    const matrixX = [];
    for (let x = 0; x < row; x++) {
        let index = 0;
        const matrixY = [];
        for (let y = 0; y < row; y++) {
            matrixY[y] = grid[index++];
        }
        matrixX.push(matrixY);
    }
    return matrixX;
}