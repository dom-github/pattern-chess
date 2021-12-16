import { fenGen } from "./fenGen";

export const submitMove = (board, from, to, piece, color, moveSAN, moveHistory, promotion) => {
    
    console.log(board, from, to, piece, color, moveSAN)
    
    let pieceCase;

    // handle castling manually 
    if (moveSAN === 'O-O' || moveSAN === 'O-O-O') {
        // short: move king to G file, rook to F
        // k: 4 r: 7 | K: 116 R: 119
        // long: move king to C file, rook to D file
        // k: 4 r: 0 | K: 116 R: 112
        const ksq = color === 'w' ? 116 : 4
        const rside = moveSAN === 'O-O' ? 7 : 0

        const rsq = rside + (color === 'w' ? 112 : 0)

        //short: k: 6 r: 5 | K: 118 R: 117
        //long:  k: 2 r: 3 | K: 114 R: 115
        const kDest = ksq + (moveSAN === 'O-O' ? 2 : -2)
        const rDest = rsq + (moveSAN === 'O-O' ? -2 : 3)

        board[ksq].piece = null;
        board[ksq].pieceColor = null;

        board[rsq].piece = null;
        board[rsq].pieceColor = null;
        
        board[kDest].piece = 'k';
        board[kDest].pieceColor = color;

        board[rDest].piece = 'r';
        board[rDest].pieceColor = color;
        pieceCase = color === 'w' ? 'K' : 'k'

    } else {

        board[from].piece = null;
        board[from].pieceColor = null;

        board[to].piece = promotion ? promotion : piece;
        board[to].pieceColor = color;

        pieceCase = color === 'w' ? piece.toUpperCase() : piece.toLowerCase()

    }


    const fen = fenGen(board)
    const newHistory = ([...moveHistory.current, {san: moveSAN, piece: pieceCase, fen: fen}])
    moveHistory.current = newHistory
    
    return fen
}