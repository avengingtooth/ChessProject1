let side = 3

function pieceBottom(ctx, start){
  for (let i = 9; i < 11; i++){
    ctx.fillRect(start - side, start + side*i, side, side)
    ctx.fillRect(start + side*6, start + side*i, side, side)
  }

  widthBar(ctx, start, 11, 6, 0)
}

function widthBar(ctx, start, h, w, xStart){
  for(let i = 0; i < w; i++){
    ctx.fillRect(start + i*side + xStart*side, start + side*h, side, side)
  }
}

function symetricalColumns(ctx, start, end, times, xside, yside){
  for (let i = 1; i <= times; i++){
    ctx.fillRect(start + side*xside, start + side*i + side*yside, side, side)
    ctx.fillRect(start + side*end, start + side*i + side*yside, side, side)
  }
}

function drawPawn(start, ctx){
  
  for (let i = 1; i <= 4; i++){
    ctx.fillRect(start + side*i, start, side, side)
  }

  symetricalColumns(ctx, start, 5, 3, 0, 0)

  symetricalColumns(ctx, start, 4, 1, 1, 3)

  symetricalColumns(ctx, start, 0, 2, 5, 4)

  symetricalColumns(ctx, start, 4, 1, 1, 6)
  symetricalColumns(ctx, start, 5, 1, 0, 7)

  pieceBottom(ctx, start)

  ctx.fill()
  ctx.stroke()
}

function drawTower(start, ctx){
  ctx.fillRect(start + side*0, start + side*0, side, side)
  widthBar(ctx, start, 1, 2, 1)
  ctx.fillRect(start + side*5, start + side*1, side, side)
  widthBar(ctx, start, 0, 2, 3)
  symetricalColumns(ctx, start, -1, 4, 6, -1)
  widthBar(ctx, start, 4, 8, -1)
  symetricalColumns(ctx, start, 0, 4, 5, 3)
  widthBar(ctx, start, 8, 6, 0)
  pieceBottom(ctx, start)
}

export {drawPawn, drawTower} 