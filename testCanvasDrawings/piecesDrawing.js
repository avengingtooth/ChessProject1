let inc = 5
let side = 5

function pieceBottom(ctx, start){
  for (let i = 9; i < 11; i++){
    ctx.fillRect(start - inc, start + inc*i, side, side)
    ctx.fillRect(start + inc*6, start + inc*i, side, side)
  }

  widthBar(ctx, start, 11, 6, 0)
}

function widthBar(ctx, start, h, w, xStart){
  for(let i = 0; i < w; i++){
    ctx.fillRect(start + i*inc + xStart*inc, start + inc*h, side, side)
  }
}

function symetricalColumns(ctx, start, end, times, xInc, yInc){
  for (let i = 1; i <= times; i++){
    ctx.fillRect(start + inc*xInc, start + inc*i + inc*yInc, side, side)
    ctx.fillRect(start + inc*end, start + inc*i + inc*yInc, side, side)
  }
}

function drawPawn(start){
  ctx = setUpCanvas()
  
  for (let i = 1; i <= 4; i++){
    ctx.fillRect(start + inc*i, start, side, side)
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

function drawTower(start){
  ctx = setUpCanvas()
  ctx.fillRect(start + inc*0, start + inc*0, side, side)
  widthBar(ctx, start, 1, 2, 1)
  ctx.fillRect(start + inc*5, start + inc*1, side, side)
  widthBar(ctx, start, 0, 2, 3)
  symetricalColumns(ctx, start, -1, 4, 6, -1)
  widthBar(ctx, start, 4, 8, -1)
  symetricalColumns(ctx, start, 0, 4, 5, 3)
  widthBar(ctx, start, 8, 6, 0)
  pieceBottom(ctx, start)
}

function drawBishop(start){
  ctx = setUpCanvas()
}

function setUpCanvas(){
  const canvas = document.getElementById('example')
  document.querySelector('body').style.backgroundColor = 'white'
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  return ctx
}

drawPawn(20)
drawTower(150)
