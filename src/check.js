function inCheck(attackingIds, allPieces, king, checkingFor){
    let checked = false
    attackingIds.forEach(attackerId => {
        let attacker = allPieces[attackerId]
        attacker.setUnchecked()
        attacker.uncheckedMoves.forEach(move => {
            if((move[0] == king[0] && move[1] == king[1]) == checkingFor){
                checked = true
            }
        })
    })
    return checked
}

//checks if moving my piece will cause me to be in check
function causingCheck(piece, allPieces, allLocs, attackingIds, king, checkingFor){
    //piece.calcMoves()
    let checked = false
    delete allPieces[piece.x * 8 + piece.y]
    delete allLocs[piece.x * 8 + piece.y]
    piece.movements.forEach(move => {
        let oldPiece = allPieces[move[0] * 8 + move[1]]
        let oldLoc = allLocs[move[0] * 8 + move[1]]
        allLocs[move[0] * 8 + move[1]] = piece.color
        allPieces[move[0] * 8 + move[1]] = piece
        checked = inCheck(attackingIds, allPieces, king, checkingFor)
        delete allLocs[move[0] * 8 + move[1]]
        delete allPieces[move[0] * 8 + move[1]]
        if(oldPiece){
            allPieces[move[0] * 8 + move[1]] = oldPiece
        }
        if(oldLoc){
            allLocs[move[0] * 8 + move[1]] = oldLoc
        }
    })
    piece.setUnchecked()
    allLocs[piece.x * 8 + piece.y] = piece.color
    allPieces[piece.x * 8 + piece.y] = piece
    return checked
}

function checkmate(allPieces, allLocs, idsByColor, king, color, oppositeColors){
    let defenders = idsByColor[oppositeColors[color]]
    defenders.forEach(id => {
        let curDefender = allPieces[id]
        if (!causingCheck(curDefender, allPieces, allLocs, idsByColor[color], king, false)){
           console.log('uncheck')
        }
    })
}

export {inCheck, causingCheck, checkmate}