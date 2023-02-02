function inCheck(attackingIds, allPieces, king){
    let checked = false
    attackingIds.forEach(attackerId => {
        let attacker = allPieces[attackerId]
        attacker.setUnchecked()
        attacker.uncheckedMoves.forEach(move => {
            if(move[0] == king[0] && move[1] == king[1]){
                checked = true
            }
        })
    })
    return checked
}

//checks if moving my piece will cause me to be in check
function causingCheck(piece, allPieces, allLocs, attackingIds, king){
    piece.calcMoves()
    let checked = false
    delete allLocs[piece.x * 8 + piece.y]
    piece.movements.forEach(move => {
        allLocs[move[0] * 8 + move[1]] = piece.color
        checked = inCheck(attackingIds, allPieces, king)
        delete allLocs[move[0] * 8 + move[1]]
    })
    allLocs[piece.x * 8 + piece.y] = piece.color
    return checked
}

function checkmate(allPieces, allLocs, idsByColor, king, color, oppositeColors){
    let attackers = idsByColor[oppositeColors[color]]
    attackers.forEach(id => {
        let curPiece = allPieces[id]
        if (!causingCheck(curPiece, allPieces, allLocs, idsByColor[color], king)){
            console.log('yeyyy', curPiece)
        }
    })
}

export {inCheck, causingCheck, checkmate}