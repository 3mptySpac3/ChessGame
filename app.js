import $ from 'jquery';
import { Chess } from 'chess.js';

var board = Chessboard('myBoard', config);
var game = new Chess();
console.log(game); // Check the logged output for available methods

var $status = $('#status');
var $fen = $('#fen');
var $pgn = $('#pgn');

function onDragStart(source, piece, position, orientation) {
  // Do not pick up pieces if the game is over
  if (game.isGameOver()) return false;

  // Only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop(source, target) {
  // Check if the target is "offboard" and silently ignore the move
  if (source === target) {
    return 'snapback';
}
  // See if the move is legal
  try {
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: Always promote to a queen for example simplicity
    });

    if (move === null) throw new Error('Invalid move');
  } catch (error) {
    console.log(error.message); // This logs to the console instead of throwing an error that would trigger the overlay
    return 'snapback';
  }

  updateStatus();
}

function onSnapEnd() {
  // Update the board position after the piece snap for castling, en passant, pawn promotion
  board.position(game.fen());
}

function updateStatus() {
  var status = '';
  var moveColor = game.turn() === 'b' ? 'Black' : 'White';

  // Checkmate?
  if (game.isCheckmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }
  // Draw?
  else if (game.isDraw()) {
    status = 'Game over, drawn position';
  }
  // Game still on
  else {
    status = moveColor + ' to move';
    // Check?
    if (game.inCheck()) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());

  
}



var config = {
  draggable: true,
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};
board = Chessboard('myBoard', config);

updateStatus();

// Event handlers for buttons
$('#startBtn').on('click', function() {
    game.reset();
    board.start();
    updateStatus();
});

$('#clearBtn').on('click', function() {
    game.clear();
    board.clear();
});


