let WIDTH = 7;
let HEIGHT = 6;

let moves = 0;
let currPlayer = 1;
//I had to .map the array and sub-arrays because if I left it as "new Array(HEIGHT).fill(new Array(WIDTH).fill(null))" all of the sub-arrays were referencing the same point in memory.
//.map helps me create a new array with new memory addresses for each subarray. 
let board = new Array(HEIGHT).fill(new Array(WIDTH).fill(null)).map((x) => x.map(y => y)); // array of rows, each row is array of cells  (board[y][x])
const handleClick = evt => {
  // get x from ID of clicked cell
  const x = evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);

  if (y === -1) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win  
  if (checkForWin()){
    //setting timeout so that when a tie happens, it will won't alert for 1ms to allow the css to render the animation for the piece.
    setTimeout(() => endGame(`Player ${currPlayer} won!`), 1);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(checkForTie()){
    //setting timeout so that when a tie happens, it will won't alert for 1ms to allow the css to render the animation for the piece.
    setTimeout(() => endGame(`The game is a tie with ${moves} moves!`), 1);
  }

  // switch players
  switchPlayer();
}
//function for drawing the board
const makeHtmlBoard = () => {
  //select the board table
  const htmlBoard = document.querySelector('#board');
  //removing previous cells if there were any
  htmlBoard.innerHTML = '';
  //create a new row
  const top = document.createElement("tr");
  //set that row id to be column-top which will change the style of the row based on the css
  top.setAttribute('id', 'column-top');
  //add an event listener to that entire row that runs the handleClick function
  top.addEventListener('click', handleClick);
  //create a new array equal to the first array on board array
  const width = board[0];
  //create a new cell in the column-top row for each element of the width array
  width.forEach((value, index) => {
    //create a new cell for this header row
    const headCell = document.createElement('td');
    //set its ID = the index that it should exist in the array
    headCell.setAttribute('id', index);
    //append the cell to the row
    top.append(headCell);
  });
  //append the entire row to the top of the table
  htmlBoard.append(top);
  //for each sub-array (row) in the board array
  board.forEach((value, yindex) => {
    //create a new row on the table
    const row = document.createElement('tr');
    //for each value in those sub-arrays (row)
    value.forEach((value, xindex) => {
      //create a new cell for that row
      const cell = document.createElement('td');
      //set the id of that cell to the coordinates that it exists in the table
      cell.classList.add('cell');
      cell.setAttribute('id', `${yindex}-${xindex}`);
      //append the cell to the row
      row.append(cell);
    })
    //append all of the rows to the table
    htmlBoard.append(row);
  })
}
/* findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = x => {
  //create a new array containing all of the x value cells going down from 0 -> height-1
  const column = board.map((value, index) => board[index][x]);
  //find the index of the last unclaimed cell to the bottom
  return column.lastIndexOf(null);
}
/* placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell
  const cell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`P${currPlayer}`, 'fall');
  cell.append(piece);
  board[y][x] = currPlayer;
  moves++;
}
/* endGame: announce game end */
const endGame = msg => alert(msg);
const win = cells => {
  // Check four cells to see if they're all color of current player
  //  - cells: list of four (y, x) cells
  //  - returns true if all are legal coordinates & all match currPlayer

  //for every element in the selected cell
  return cells.every(
    ([y, x]) =>
      //If all of the elements are on the board
      y >= 0 && 
      y < HEIGHT && 
      x >= 0 && 
      x < WIDTH && 
      board[y][x] === currPlayer
  )
}
/* checkForWin: check board cell-by-cell for "does a win start here?" */
const checkForWin = () => {
        //And all of the cells belong to the curent player

  // TODO: read and understand this code. Add comments to help you.
  //For every row
  return board.some((row, y) => row.some((column, x) => {
    //calculate horizontal win (going right) of each cell
    const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
    //calculate vertical win (going up) of each cell
    const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
    //calculate diagnonal win going down and to the right of each cell
    const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
    //calculate diagnonal win going down and to the left of each cell
    const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    //for each cell, check if any one of the possible win scenarios is true
    if(win(horiz) || win(vert) || win(diagDR) || win(diagDL)){
      return true;
    }
  }));
}


const checkForTie = () => board.every(row => row.every(cell => cell !== null));
const switchPlayer = () => currPlayer = (moves % 2) + 1;
makeHtmlBoard();

