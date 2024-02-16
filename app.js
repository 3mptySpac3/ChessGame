
import $ from 'jquery';
import { Chess } from 'chess.js';


const game = new Chess();

// Configuration object for the Chessboard.js
var boardConfig = {
  draggable: true,
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  // This event is called after the piece is dropped on the board
  onDrop: function(source, target, piece, newPos, oldPos, orientation) {
    // See if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';
    
    // Log the move
    console.log(move);
    
    // Handle end of game scenarios like checkmate or stalemate here
    if (game.in_checkmate()) {
      console.log('Checkmate');
    } else if (game.in_draw()) {
      console.log('Draw');
    }
  },
  // Update board positions after a move
  onSnapEnd: function() {
    board.position(game.fen());
  }
};

// Initialize the Chessboard.js board
var board = Chessboard('board2', boardConfig)


var board2 = Chessboard('board2', {
  draggable: true,
  dropOffBoard: 'trash',
  sparePieces: true,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
})

$('#startBtn').on('click', board2.start)
$('#clearBtn').on('click', board2.clear)

// Resize the board based on the current width
function resizeBoard() {
  // Calculate the maximum width the board can have
  const boardWidth = Math.min(
    document.querySelector('.chess-container').clientWidth,
    window.innerWidth * 0.95 // 95% of the viewport width
  );
  // Set the board size based on the calculated width
  board.resize(boardWidth);
}

// Call resizeBoard on window resize
window.addEventListener('resize', resizeBoard);

// Initial resize
resizeBoard();



export default board2;

