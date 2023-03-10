import { inCheck, causingCheck, checkmate } from "./check.js"
import {drawPawn, drawTower} from './pieceDrawing.js'
let kings = {
    'white' : undefined,
    'black' : undefined
}

let scores = {
    'black': 0,
    'white': 0
}

let oppositeColors = {
    'black': 'white',
    'white': 'black'
}

let history = []
let allPieces = {}
let piecesByColor = {
    'white': [],
    'black': []
}
let allIds = []
let allLocs = {}

let checked = {
    'black': false,
    'white': false
}

let turn = 0

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
            this.checkMoveValid(move, this)
        })
    }

    checkMoveValid (coords, obj){
        let pieceColor = obj.color
        let x = coords[0]
        let y = coords[1]
        if(0 <= x && x < 8 && 0 <= y && y < 8){
            if(!checked[pieceColor]){
                if (inCheck(piecesByColor[pieceColor], allPieces, kings[oppositeColors[pieceColor]], true)){
                    let kingCoords = kings[oppositeColors[pieceColor]]
                    let cur = document.querySelector(`.row${kingCoords[0]} .column${kingCoords[1]}`)
                    cur.classList.add('checked')
                    checked[oppositeColors[pieceColor]] = true
                }
                let sqrPieceColor = allLocs[x * 8 + y]
                if(!sqrPieceColor || sqrPieceColor != pieceColor){
                    this.movements.push([x, y])
                }
            }
            else{
                let sqrPieceColor = allLocs[x * 8 + y]
                if(!sqrPieceColor || sqrPieceColor != pieceColor){
                    this.movements.push([x, y])
                }
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
                //right, bottom right
                [this.x + yInc * i, this.y + xInc * i],
                // down, bottom left
                [this.x + xInc * i, this.y - yInc * i],
                // left, top left
                [this.x - yInc * i, this.y - xInc * i],
                // up, top right
                [this.x - xInc * i , this.y + yInc * i]
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
        this.value = 1
        this.draw = drawPawn
        setScore(this.value, this.color)
    }

    // recalculates all of the possible moves and checks if they are valid
    setUnchecked(){
        this.uncheckedMoves = []
        //checks if pawn is still at start so it can move two squares
        if (allLocs[(this.x +this.direction) * 8 + this.y + 1]){
            this.uncheckedMoves.push([this.x +this.direction, this.y + 1])
        }
        if (allLocs[(this.x +this.direction) * 8 + this.y - 1]){
            this.uncheckedMoves.push([this.x +this.direction, this.y - 1])
        }

        if(!allLocs[(this.x + this.direction) * 8 + this.y]){
            if (((this.x == 1 && this.direction == 1) || (this.x == 6 && this.direction == -1)) && (allLocs[this.x + (2 * this.direction), this.y])){
                this.uncheckedMoves.push([this.x + (2 * this.direction), this.y])
            }
            this.uncheckedMoves.push([this.x + this.direction, this.y])
        }

    }
}

class Tower extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
        this.value = 5
        this.draw = drawTower
        setScore(this.value, this.color)
    }

    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(8, 1, 0)

    }
}

class Knight extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
        this.value = 3
        setScore(this.value, this.color)
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

    }
}

class Bishop extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
        this.value = 3
        setScore(this.value, this.color)
    }

    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(8, 1, 1)

    }
}

class Queen extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
        this.value = 9
        setScore(this.value, this.color)
    }
    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(8, 1, 1)
        super.diagonalAndHorizontal(8, 1, 0)

    }
}

class King extends Pieces{
    constructor(x, y, color, name, id){
        super(x, y , color, name, id)
        this.uncheckedMoves = []
        kings[this.color] = [this.x, this.y]
        this.checked = false
    }
    setUnchecked(){
        this.uncheckedMoves = []
        super.diagonalAndHorizontal(1, 1, 1)
        super.diagonalAndHorizontal(1, 1, 0)

    }
}

function movePiece(x, y){
    let sqr = document.querySelector(`.row${x} .column${y}`)
    if (sqr.className.includes('possibleMove')){
        resetSelected()
        let piece = allPieces[document.querySelector('.selected').id]
        //removes any opponent pieces that would have been on the sqr
        if (turn % 2 == 0 && piece.color == 'white' || (turn % 2 == 1 && piece.color == 'black')){
            document.querySelectorAll('.checked').forEach(e => e.classList.remove('checked'))
            turn++
            if (piece){
                let nextSqrId = x * 8 + y
                let moveIntoSqr = document.querySelector(`.row${x} .column${y} .piece`)
                if (moveIntoSqr){
                    deletePiece(moveIntoSqr, nextSqrId)
                }

                //changes the location of the piece to the new location
                delete allLocs[piece.x * 8 + piece.y]
                allLocs[nextSqrId] = piece.color
                piece.x = x
                piece.y = y
                if (piece.name == 'king'){
                    kings[piece.color] = [piece.x, piece.y]
                }
                display()
            }
            reCalcAll()
            let kingCoords = kings[oppositeColors[piece.color]]
            let cur = document.querySelector(`.row${kingCoords[0]} .column${kingCoords[1]}`)
            if (cur.className.includes('checked')){
                if (checkmate(allPieces, allLocs, piecesByColor, kings[oppositeColors[piece.color]], piece.color, oppositeColors)){
                    cur.classList.add('checkmate')
                    gameEnd(oppositeColors[piece.color])
                }
            }
        }
    }
}

//creates all the divs for the squares and adds starter class names
function createGrid(){
    // document.querySelector('.restart').addEventListener('click', reset)
    document.querySelector('.centeringDeadPieces').style.visibility = 'hidden'
    let board = document.createElement('section')
    board.classList.add('gameBoard')
    document.querySelector('.boardBoarder').append(board)
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
            })
            
            //check color of the boards square
            if ((column + row) % 2 == 1){
                curNewColumn.classList.add('white')
            }
            else{
                curNewColumn.classList.add('black')
            }

            // add a piece in sqr if present at loc at start
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
    else if (row == 1 || row == 6){
        new Pawn(row, col, color, 'pawn', id)
    }
}

function display(){
    // turn++
    // history.push({
    //     'allIds' : allIds, 
    //     'allLocs' : allLocs, 
    //     'allPieces' :allPieces
    // })

    let shownPieces = document.querySelectorAll('.piece')
    console.log(shownPieces)
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
        // if(curPiece.draw){
        //     const canvas = document.createElement('canvas')
        //     const ctx = canvas.getContext('2d')
        //     newPiece.append(canvas)
        //     curPiece.draw(0, ctx)
        // }
        // else{
            newPiece.textContent = curPiece.name
        // }

        //allows u to select a piece
        newPiece.addEventListener('click', () => {
            if (sqr.className.includes('possibleMove')){
                movePiece(curPiece.x, curPiece.y)
            }
            else{
                document.querySelectorAll('.selected').forEach(e => e.classList.remove('selected'))
                resetSelected()
                newPiece.classList.add('selected')
                curPiece.setUnchecked()
                if (!checked[curPiece.color]){
                    if (causingCheck(curPiece, allPieces, allLocs, piecesByColor[oppositeColors[curPiece.color]], kings[curPiece.color], true)){
                        sqr.classList.add('pinned')
                    }
                    else{
                        curPiece.calcMoves()
                        curPiece.showMoves()
                    }

                }
                else{
                    console.log(causingCheck(curPiece, allPieces, allLocs, piecesByColor[oppositeColors[curPiece.color]], kings[curPiece.color], false))
                    if (!causingCheck(curPiece, allPieces, allLocs, piecesByColor[oppositeColors[curPiece.color]], kings[curPiece.color], false)){
                        sqr.classList.add('pinned')
                    }
                    else{
                        curPiece.movements = causingCheck(curPiece, allPieces, allLocs, piecesByColor[oppositeColors[curPiece.color]], kings[curPiece.color], false)
                        curPiece.showMoves()
                    }
                }
            }
        })
    })
}

function resetSelected(){
    //removes all of the markings on the previous pieces possible moves
    document.querySelectorAll('.possibleMove').forEach(e => e.classList.remove('possibleMove'))
    document.querySelectorAll('.pinned').forEach(e => e.classList.remove('pinned'))
}

function reCalcAll(){
    allIds.forEach(id => {
        let curPiece = allPieces[id]
        curPiece.calcMoves()
    })
}

function deletePiece(moveIntoSqr){
    document.querySelector('.centeringDeadPieces').style.visibility = 'visible'
    //moves the dead piece to the div with all the dead pieces on the side and removes the classes so it doesnt get deleted with the reset
    moveIntoSqr.classList.remove('piece')
    moveIntoSqr.classList.add('deadPiece')
    document.querySelector('.deadPieces').append(moveIntoSqr)

    //selects the piece obj so that i can be removed from the arrays and objs used to check for check and if moves are possible
    let killedObj = allPieces[moveIntoSqr.id]
    let killedId = killedObj.id
    //all locs remove
    delete allLocs[killedId]
    //pieces by color remove
    let pieceColorArr = piecesByColor[killedObj.color]
    piecesByColor[killedObj.color].splice(pieceColorArr.indexOf(killedId), 1)
    //all ids
    allIds.splice(allIds.indexOf(killedId), 1)
    //all pieces
    delete allPieces[killedId]
    setScore(-killedObj.value, killedObj.color)
    if(killedObj.name == 'king'){
        gameEnd(oppositeColors[killedObj.color])
    }
}

function setScore(value, color){
    scores[color] += value
    let scoresSelect = document.querySelector('.scores span')
    let difference = scores[color] - scores[oppositeColors[color]]
    if (difference <= 0){
        scoresSelect.classList.add(oppositeColors[color])
        scoresSelect.classList.remove(color)
        difference *= -1
    }
    document.querySelector('.scores span').textContent = difference
}

function gameEnd(winningColor){
    console.log('idk')
    let popUp = document.querySelector('.gameEnd')
    popUp.style.display = 'flex'
    document.querySelector('.gameEnd p').textContent = `${winningColor} won!!`.toUpperCase()
}

function gameStart(){
    document.querySelector('.gameEnd').style.display = 'none'
    createGrid()
    display()
}

function reset(){
    console.log('reset')
    // let board = document.querySelector('.gameBoard')
    // let child = board.lastElementChild; 
    // while (child) {
    //     board.removeChild(child);
    //     child = board.lastElementChild;
    // }
    // console.log(document)
    // gameStart()
}

gameStart()