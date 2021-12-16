
    // this function takes a FEN string as input and fills the board array with values for the initial render

import { algebraic, is_digit } from "./utils";

    export const fenBoard = (fen) => {


        const board = [];

        const white_pieces = [];
        const black_pieces = [];

		const items = fen.split(/\s+/); // split the FEN pieces from other info
		const pieces = items[0];  // idgaf about anything but the pieces
        let square = 0
    
        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces.charAt(i)
            //console.log('FEN cur piece:', piece)
            if (piece === '/') {
                square += 8
                for (let i = 0; i < 8; i++) {
                    board.push(null)
                }
            } else if (is_digit(piece)) {
                // empty squares
                // is a number = create blank spaces
                const numEmpty = parseInt(piece, 10)
                for (let i = 0; i < numEmpty; i++) {
                    board.push({
                        //algebraicId: Object.keys(SQUARES)[square],
                        hexId: square,
                        algId: algebraic(square),
                        piece: null,
                        pieceColor: null,
                        controlledBy: []
                    })
                    square ++
                }
            } else {
                // pieces on a square
                // if a piece is present on a square
                // add that info to the square's Object
                // then calculate the ADC info for that piece
                // finally update the controlledBy array for those pieces
                // this is where our calculations might get stupidly expensive
                
                const pieceInfo = {
                        piece: piece,
                        squareHex: square,
                        squareAlg: algebraic(square)

                    }

                piece.match(/[A-Z]/)
                ? white_pieces.push(pieceInfo)
                : black_pieces.push(pieceInfo)

                board.push({
                    //algebraicId: Object.keys(SQUARES)[square],
                    hexId: square,
                    algId: algebraic(square),
                    piece: piece.toLowerCase(),
                    pieceColor: piece.match(/[A-Z]/)? 'w': 'b',
                    controlledBy: []
                })
                square++
            }
        }

        return {board, white_pieces, black_pieces}
    }
