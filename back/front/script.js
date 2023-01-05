const $ = (...args) => {
  const elements = document.querySelectorAll(...args)
  return elements.length === 1 ? elements[0] : elements
}


const boardDifficulties = [
  { name: 'Easy', size: 9, numberOfBombs: 10 },
  { name: 'Medium', size: 16, numberOfBombs: 40 },
  { name: 'Hard', size: 24, numberOfBombs: 150 }
]


let currentCursor = 'cursor'
let flaggedCount = 0

/////////////////////////////////////////////////////////////////////////////





function createTextNode(line) {
  return document.createTextNode(line);
}

function createElement(type, line) {
  // get classes
  let classes = line.match(/\.([a-z0-9-]+)/g)?.map((c) => c.slice(1)) || [];

  // get attributes
  let attributes =
    line.match(/@([a-z]+)\s*=\s*["'](.+)["']/g)?.map((a) => {
      let [_, key, value] = a.match(/@([a-z]+)\s*=\s*["'](.+)["']/);
      return { key, value };
    }) || [];

  let element = document.createElement(type);
  element.classList.add(...classes);
  attributes.forEach(({ key, value }) => {
    element.setAttribute(key, value);
  });

  return element;
}


function createContainer() {


  let k = `.container
  .header
    .Titlediv
      p.title
        |MINESWEEPER
      p.name
        |M. Kaan ASIK
  .game
    .flags
      button.flag-cursor(@onclick="toggleCursor()")
        |🚩
      .flagged-count
        |0
      |/
      .mine-count
        |0
    .board
  .buttons
  .footer
    p.copyright`;


  let parentElementArray = [document.body];
  k.split("\n").forEach((line, i) => {
    let leadingSpaceCount = line.match(/^\s+/)?.[0].length || 0;
    // remove leading spaces
    line = line.replace(/^\s+/, "");
    // get element type
    let type = line.startsWith("|")
      ? "textnode"
      : line.match(/^[a-z]+/)?.[0] || "div";

    let el =
      type === "textnode"
        ? createTextNode(line.slice(1))
        : createElement(type, line);

    // get parent element
    console.log(leadingSpaceCount);
    let parentElement = parentElementArray[leadingSpaceCount / 2];
    parentElement.appendChild(el);
    parentElementArray[leadingSpaceCount / 2 + 1] = el;
  });
  
}





function Buildfooter() {
  /*
  const footer = document.createElement('footer')
  footer.className = "footer"
  const footerDiv = document.createElement('div')
  const copyR = document.createElement('h3')
  footer.appendChild(footerDiv)
  footerDiv.appendChild(copyR)
  const myContainer = document.querySelector('.container')
  myContainer.append(footer)
  copyR.innerHTML = '&copy; Copyright 2029 by M. Kaan Asik'
  */
  const copyR = document.querySelector('.copyright')
  copyR.innerHTML = "&copy; 2029 by M. Kaan Asik" 
}
/*
function buildHeader() {
 
  const header = document.createElement('header') 
  const headerDiv = document.createElement('div')
  const title = document.createElement('h1')
  const myContainer = document.querySelector('.container')
  const myname = document.createElement('h3')
  /////////////////////////////////////////////////////////////////////////
  header.appendChild(headerDiv)
  headerDiv.appendChild(title)
  headerDiv.appendChild(myname)
  myContainer.prepend(header)
  header.className ="header"
  myname.innerHTML = "M. Kaan Asik"   
  title.innerHTML = "MINESWEEPER"
}*/

function generateRandomNumber(max) {
  return Math.floor(Math.random() * max)
}

function toggleCursor() {
  currentCursor = currentCursor === 'flag' ? 'cursor' : 'flag'
  $('.flag-cursor').classList.toggle('active')
}

function updateFlaggedCount(numberOfBombs) {
  // update ui
  $('.flagged-count').textContent = numberOfBombs - flaggedCount
}


function checkGameState() {
  const board = $('.board')
  const bombs = $('.bomb')
  const flaggedBombs = $('.bomb.flagged')
  const notRevealedCells = $('.cell:not(.clicked):not(.bomb)')

  // check if all bombs are flagged
  if (bombs.length === flaggedBombs.length && notRevealedCells.length === 0) {
    // show win message
    board.classList.add('game-won')
  }
}

function toggleFlag(e, maxFlagCount) {
  const cell = e.target
  // if cell is already clicked, do nothing
  if (cell.classList.contains('clicked')) {
    return
  }
  // you can unflag your flag even if you have reached the max flag count
  if (!cell.classList.contains('flagged') && flaggedCount >= maxFlagCount) {
    return
  }

  if (cell.classList.toggle('flagged')) {
    flaggedCount++
  } else {
    flaggedCount--
  }
  updateFlaggedCount(maxFlagCount)
}

function getAdjacentCells(row, col, size) {
  const cells = []
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < size && j >= 0 && j < size) {
        cells.push([i, j])
      }
    }
  }
  return cells
}

function placeBombs(size, numberOfBombs,x,y) {
  if (numberOfBombs > size * size) {
    throw new Error('Too many bombs')
  }
  const cells = new Set()
  while (cells.size < numberOfBombs) {
    const randomRow = generateRandomNumber(size)
    const randomColumn = generateRandomNumber(size)
    if (cells.has(`${randomRow},${randomColumn}`)) {
      continue
    }
    if (randomRow === y && randomColumn ===x) {
      continue
    }
    const adjacentCells = getAdjacentCells(randomRow, randomColumn, size)
    adjacentCells.forEach(([row, col]) => {
      // plus one to cell value to indicate that it is adjacent to a bomb
      const adjacentCell = $(`[data-row="${row}"][data-col="${col}"]`)
      adjacentCell.dataset.value =
        (parseInt(adjacentCell.dataset.value) || 0) + 1
    })

    const cell = $(`[data-row="${randomRow}"][data-col="${randomColumn}"]`)
    cell.dataset.type = 'bomb'
    cell.classList.add('bomb')
    cells.add(`${randomRow},${randomColumn}`)
  }
}
function cellRightClicked(evt, numberOfBombs) {
  evt.preventDefault();
  toggleFlag(evt, numberOfBombs)
}

// Create a board of size x size
function createBoard(size, numberOfBombs) {
  
  var mooveCount = 0;
  const board = document.querySelector('.board')
  this.numberOfBombs = numberOfBombs
  board.classList.remove('game-over')
 
  document.querySelector('.flagged-count').textContent = numberOfBombs
  document.querySelector('.mine-count').textContent = numberOfBombs

  // empty the board
  board.innerHTML = ''

  // create a cell
  const cell = document.createElement('div')
  cell.className = 'cell'
  //cell.addEventListener('click',(evt)=> {FindFirstClick(evt)})
  cell.style.width = `${100 / size}%`
  cell.dataset.value = '0'
  var x = 0;
  var y = 0;
  
  // add the cells to the board
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cellClone = cell.cloneNode()
      cellClone.dataset.row = i
      cellClone.dataset.col = j
      cellClone.dataset.type = 'empty'
      cellClone.addEventListener('contextmenu', (evt, numberOfBombs) => { this.cellRightClicked(evt, this.numberOfBombs) })
     
      cellClone.addEventListener('click', (e) => { 
        if (mooveCount === 0) {
           x = parseInt(e.target.dataset.col);
           y = parseInt(e.target.dataset.row);
          console.log(x)
          console.log(y)
          placeBombs(size, numberOfBombs, x, y)
          mooveCount++;
          console.log(numberOfBombs)
       }
      
        
        
        if (e.which !== 1) return ;
        if (currentCursor === 'flag') {
          toggleFlag(e, numberOfBombs)
          return
        }
        if (cellClone.classList.contains('flagged')) {
          return
        }
        const cell = e.target
        if (cell.dataset.type === 'bomb') {
          cell.classList.add('bombed')
          board.classList.add('game-over')
          //playSound('./you-died.mp3')
          return
        }
        //playSound('./click.mp3')
        cell.classList.add('clicked')
        checkGameState()
        if (cell.dataset.value === '0') {
          const row = parseInt(cell.dataset.row)
          const col = parseInt(cell.dataset.col)
          const adjacentCells = getAdjacentCells(row, col, size)
          adjacentCells.forEach(([row, col]) => {
            const adjacentCell = $(`[data-row="${row}"][data-col="${col}"]`)
            if (!adjacentCell.classList.contains('clicked')) {
              adjacentCell.click(e)
            }
          })
        }
      })

      //cellClone.innerHTML = i + ',' + j
      board.appendChild(cellClone)
    }
  }  
}

function createButtons(boardDifficulties) {
  const buttons = document.querySelector('.buttons')
  buttons.innerHTML = ''
  const button = document.createElement('button')
  button.className = 'button'
  boardDifficulties.forEach((difficulty) => {
    const buttonClone = button.cloneNode()
    buttonClone.innerHTML = difficulty.name
    buttonClone.addEventListener('click', () => {
      createBoard(difficulty.size, difficulty.numberOfBombs)
    })
    buttons.appendChild(buttonClone)
  })
}

let playing = false
function playSound(url) {
  if (playing) return
  playing = true

  const audioContext = new AudioContext()
  window
    .fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)

      source.addEventListener('ended', () => {
        playing = false
      })
      source.start()
    })
}






function main() {
  createContainer()
  //buildHeader()
  createButtons(boardDifficulties) 
  createBoard(9, 10)
  
  Buildfooter() 
}

main()
