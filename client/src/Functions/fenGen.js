import { SQUARES } from "../Constants/constants"


export const fenGen = (board) => {
  let empty = 0
  let fen = ''

  for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (board[i].piece == null) {
      empty++
      } else {
      if (empty > 0) {
          fen += empty
          empty = 0
      }

      
      const piece = board[i].piece
      const color = board[i].pieceColor

      fen += color === 'w' ? piece.toUpperCase() : piece.toLowerCase()
      }

      if ((i + 1) & 0x88) {
      if (empty > 0) {
          fen += empty
      }

      if (i !== SQUARES.h1) {
          fen += '/'
      }

      empty = 0
      i += 8
      }
  }

  //console.log(fen)
  return fen
}
