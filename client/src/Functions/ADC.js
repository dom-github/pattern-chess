
import {  
    piece_moves, 
    pawn_captures
    } from "../Constants/constants";

    // calculate the Attacked, Defended, and Controlled squares of a given piece
    // this has to be done after the full board is rendered and all piece positions are placed
    // square refers to decimal ID for now
    const setADC = (board, piece, square, color) => {
        if (piece === 'p') {
            pawn_captures[color].forEach((move) => {
                const targetSquare = square + move;
                if (targetSquare & 0x88) {
                    //console.log(targetSquare)
                    return;
                } else {
                    //console.log(board[targetSquare])

                    board[targetSquare]?.controlledBy.push({piece: piece, color: color, square: square})
                }
            })
        } else {
            piece_moves[piece].forEach((move) => {

                // for non-pawn pieces 
                // set a target square according to move offset 
                // if king or knight, break
                // for bishop, rook, queen (sliding pieces):
                // while targetSquare.piece === null
                // set controlled and += offset 
                // break when hits invalid or occupied square
                let targetSquare = square + move;

                while (!(targetSquare & 0x88)) {
                    //console.log('Target:', targetSquare, 'Piece:', piece)
                    board[targetSquare]?.controlledBy.push({piece: piece, color: color, square: square})
                    //stop immediately for kings and knights 
                    if (piece === 'n' || piece === 'k') break;

                    if (board[targetSquare]?.piece !== null) {
                        //console.log('Break!', 'piece:', piece)
                        break};

                    //bishops, rooks, queens do the calculation again
                    targetSquare += move;
                }
                
            })
        }
    }

    export const initADC = (board, white_pieces, black_pieces) => {
        //console.log('ADC init')
        white_pieces.forEach((info) => {
            const pieceType = info.piece.toLowerCase();
            const square = info.squareHex;
            const color = 'w'

            setADC(board, pieceType, square, color)
        })

        black_pieces.forEach((info) => {
            const pieceType = info.piece.toLowerCase();
            const square = info.squareHex;
            const color = 'b'

            setADC(board, pieceType, square, color)
        })
    }

