
function resizeBoard() {
  const boardWidth = Math.min(
    document.querySelector('.chess-container').clientWidth,
    window.innerWidth * 0.95 // 95% of the viewport width
  );
  board2.resize(boardWidth);
}

// Call resizeBoard on window resize
window.addEventListener('resize', resizeBoard);



var board2 = Chessboard('board2', {
  draggable: true,
  dropOffBoard: 'trash',
  sparePieces: true,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
})

$('#startBtn').on('click', board2.start)
$('#clearBtn').on('click', board2.clear)


// Initial resize
resizeBoard();

