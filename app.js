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

function getKingPosition(color) {
  // Loop through all squares to find the king's position
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var square = String.fromCharCode('a'.charCodeAt(0) + j) + (i + 1);
      var piece = game.get(square);
      if (piece && piece.type === 'k' && piece.color === color) {
        return square;
      }
    }
  }
  return null; // If no king is found 
}

// Update the game status
function updateStatus() {
  var status = '';
  var moveColor = game.turn() === 'b' ? 'Black' : 'White';


  // Remove red glow from any square
  $('.square-55d63').removeClass('in-check');

  // Find the king's position using the custom function
  var kingPos = getKingPosition(game.turn() === 'w' ? 'w' : 'b');
  if (game.inCheck()) {
    // If the king is in check, add the red glow class
    $('#myBoard .square-' + kingPos).addClass('in-check');
  }

  // Checkmate?
  if (game.isCheckmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
    // Add red glow to the king's square
    $('#myBoard .square-' + kingPos).addClass('in-check');
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

function removeGraySquares(){
  $('#myBoard .square-55d63').removeClass('highlight')
}

function graySquare(square){
  $('#myBoard .square-' + square).addClass('highlight')
}

function onMouseoverSquare(square, piece){
  // Get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // Exit if there are no moves available for this square
  if(moves.length === 0) return



  // Highlight the possible squares for this piece with a gray dot
  for (var i = 0; i < moves.length; i++) {
    if (moves[i].from !== moves[i].to) { // Make sure we don't highlight the current square
      graySquare(moves[i].to);
    }
  }

}

function onMouseoutSquare(square, piece){
  removeGraySquares()
}


var config = {
  draggable: true,
  position: 'start',
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare

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


// testing 

