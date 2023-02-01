let history = []
let allPieces = {}
let piecesByColor = {
    'white': [],
    'black': []
}
let allIds = []
let allLocs = {}

class Pieces{
    constructor(x, y, color, name, id){
        this.x = x
        this.y = y
        this.color = color
        this.name = name
        this.id = id
        this.movements = []

        allPieces[id] = this
        piecesByColor[this.color].push(this.id)
        allIds.push(this.id)
        allLocs[this.x * 8 + y] = this.color
    }

    calcMoves(){
        this.movements = []
        //checks if the usual moves are an option
        this.uncheckedMoves.forEach(move => {
            this.checkMoveValid(move, this.color)
        })
    }

    checkMoveValid (coords, pieceColor){
        let x = coords[0]
        let y = coords[1]
        if(0 <= x && x < 8 && 0 <= y && y < 8){
            let sqrPieceColor = allLocs[x * 8 + y]
            if(!sqrPieceColor || sqrPieceColor != pieceColor){
                this.movements.push([x, y])
            }
        }
    }

    showMoves(){
        this.movements.forEach(coords => {
            let sqr = document.querySelector(`.row${coords[0]} .column${coords[1]}`)
            sqr.classList.add('possibleMove')
        })
    }

    diagonalAndHorizontal(times, xInc, yInc){
        let cont = [true, true, true, true]
        for (let i = 1; i <= times; i++){
            let toCheck = [
                [this.x + xInc * i, this.y + yInc * i],
                [this.x + xInc * i, this.y - yInc * i],
                [this.x - yInc * i, this.y + xInc * i],
                [this.x - yInc * i, this.y - xInc * i]
            ]   
            toCheck.forEach((move, ind) => {
                let nextSqr = allLocs[move[0] * 8 + move[1]]
                if(cont[ind] && nextSqr != this.color){
                    this.uncheckedMoves.push(move)
                }
                if (nextSqr){
                    cont[ind] = false
                }
            })
        }
    }
}

class Pawn extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        if (this.x == 1){
            this.direction = 1
        }
        else{
            this.direction = -1
        }
        this.uncheckedMoves = []
    }

    // recalculates all of the possible moves and checks if they are valid
    setUnchecked(){
        this.uncheckedMoves = []
        //checks if pawn is still at start so it can move two squares
        if ((this.x == 1 && this.direction == 1) || (this.x == 6 && this.direction == -1)){
            this.uncheckedMoves.push([this.x + (2 * this.direction), this.y])
        }
        else if (allPieces[(this.x +this.direction) * 8 + this.y + 1]){
            this.uncheckedMoves.push([this.x +this.direction, this.y + 1])
        }
        else if (allPieces[(this.x +this.direction) * 8 + this.y - 1]){
            this.uncheckedMoves.push([this.x +this.direction, this.y - 1])
        }
        
        if(!allLocs[(this.x + this.direction) * 8 + this.y]){
            this.uncheckedMoves.push([this.x + this.direction, this.y])
        }
        super.calcMoves()
    }
}

class Tower extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
    }

    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(8, 1, 0)
        super.calcMoves()
    }
}

class Knight extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
    }

    setUnchecked(){
        this.uncheckedMoves = []
        this.uncheckedMoves = [
            //right up and down
            [this.x + 2, this.y + 1],
            [this.x + 2, this.y - 1],
            //left up and down
            [this.x - 2, this.y + 1],
            [this.x - 2, this.y - 1],
            //up left and right
            [this.x - 1, this.y + 2],
            [this.x + 1, this.y + 2],
            //down left and right
            [this.x - 1, this.y - 2],
            [this.x + 1, this.y - 2],
        ]

        super.calcMoves()
    }
}

class Bishop extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
    }

    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(8, 1, 1)
        super.calcMoves()
    }
}

class Queen extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
    }
    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(8, 1, 1)
        super.diagonalAndHorizontal(8, 1, 0)
        super.calcMoves()
    }
}

class King extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
    }
    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(1, 1, 1)
        super.diagonalAndHorizontal(1, 1, 0)
        console.log(this.uncheckedMoves)
        super.calcMoves()
    }
}

function movePiece(x, y){
    let sqr = document.querySelector(`.row${x} .column${y}`)
    if (sqr.className.includes('possibleMove')){
        resetSelected()
        //removes any opponent pieces that would have been on the sqr
        let piece = allPieces[document.querySelector('.selected').id]
        if (piece){
            let nextSqrId = x * 8 + y
            let moveIntoSqr = document.querySelector(`.row${x} .column${y} .piece`)
            if (moveIntoSqr){
                delete allPieces[moveIntoSqr.id]
                allIds.splice(allIds.indexOf(nextSqrId), 1)
                delete allLocs[nextSqrId]
            }

            //changes the location of the piece to the new location
            delete allLocs[piece.x * 8 + piece.y]
            allLocs[nextSqrId] = piece.color
            piece.x = x
            piece.y = y
            display()
        }
        reCalcAll()
    }
}

//creates all the divs for the squares and adds starter class names
function createGrid(){
    for (let row = 0; row < 8; row++){
        let curNewRow = document.createElement('div')
        document.querySelector('.gameBoard').append(curNewRow)
        curNewRow.classList.add('row')
        curNewRow.classList.add(`row${row}`)
        
        for (let column = 0; column < 8; column++){
            let curNewColumn = document.createElement('div')
            curNewRow.append(curNewColumn)
            curNewColumn.classList.add('column')
            curNewColumn.classList.add(`column${column}`)

            //make the tiles clickable for detecting tile choice
            curNewColumn.addEventListener('click', () => {
                movePiece(row, column)
                // resetSelected()
                //reCalcAll()
            })
            
            //check color of the boards square
            if ((column + row) % 2 == 1){
                curNewColumn.classList.add('white')
            }
            else{
                curNewColumn.classList.add('black')
            }

            //add a piece in sqr if present at loc at start
            if (row <= 1 || row >= 6){
                piecesStartingLocation(row, column)
            }
        }
    }
}

function piecesStartingLocation(row, col){
    let color
    if (row <= 1){
        color = 'white'
    }
    else{
        color = 'black'
    }
    let id = row*8 + col

    if (row == 0 || row == 7){
        if (col == 0 || col == 7){
            new Tower(row, col, color, 'tower', id)
        }
        else if (col == 1 || col == 6){
            new Knight(row, col, color, 'knight', id)
        }
        else if (col == 2 || col == 5){
            new Bishop(row, col, color, 'bishop', id)
        }
        // make it so it checks where queen goes based on which color the tile is cuz queen on its color at start
        else if (col == 3){
            new Queen(row, col, color, 'queen', id)
        }
        else{
            new King(row, col, color, 'king', id)
        }
    }
    else{
        new Pawn(row, col, color, 'pawn', id)
    }
}

function display(){
    let shownPieces = document.querySelectorAll('.piece')
    shownPieces.forEach(e => e.remove())
    allIds.forEach(id => {
        //get the piece obj
        let curPiece = allPieces[id]
        //selects sqr it needs to be placed in and adds piece
        let sqr = document.querySelector(`.row${curPiece.x} .column${curPiece.y}`)
        let newPiece = document.createElement('div')
        sqr.append(newPiece)
        newPiece.classList.add('piece')
        newPiece.classList.add(`${curPiece.color}`) 
        newPiece.setAttribute('id', curPiece.id)
        newPiece.textContent = curPiece.name

        //allows u to select a piece
        newPiece.addEventListener('click', () => {
            document.querySelectorAll('.selected').forEach(e => e.classList.remove('selected'))
            newPiece.classList.add('selected')
            resetSelected()
            curPiece.setUnchecked()
            curPiece.showMoves()
        })
    })
}

function resetSelected(){
    //removes all of the markings on the previous pieces possible moves
    document.querySelectorAll('.possibleMove').forEach(e => e.classList.remove('possibleMove'))
}

function reCalcAll(){
    allIds.forEach(id => {
        allPieces[id].calcMoves()
    })
}

createGrid()
display()