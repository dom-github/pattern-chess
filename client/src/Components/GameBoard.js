import { useState } from "react";
import styled from "styled-components";

//import { parsePGN, loadPGN, move_from_san } from "../Functions/parsePGN";

//rendering the basic game board 

//FEN setup:
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

// r = rookb R = rookw
// n = knightb N = knightw
// b = bishopb B = bishopw
// q = queenb Q = queenw
// k = kingb K = kingw
// p = pawnb P = pawnw

const GameBoard = ({fen, setFen, moveHistory, setMoveHistory}) => {


    const [selected, setSelected] = useState();


    const board = [];

    //0x88
    const piece_moves88 = {
        n: [-18, -33, -31, -14, 18, 33, 31, 14],
        b: [-17, -15, 17, 15],
        r: [-16, 1, 16, -1],
        q: [-17, -16, -15, 1, 17, 16, 15, -1],
        k: [-17, -16, -15, 1, 17, 16, 15, -1],
    }

    //decimal
    const piece_moves = {
        n: [-15, -17, -10, -6, 6, 10, 15, 17],
        b: [-7, -9, 7, 9],
        r: [-8, -1, 1, 8],
        q: [-9, -8, -7, -1, 1, 7, 8, 9],
        k: [-9, -8, -7, -1, 1, 7, 8, 9],
    }

    //0x88
    const pawn_captures88 = {
        b: [17, 15],
        w: [-17, -15],
    }
    
    //decimal
    const pawn_captures = {
        b: [7, 9],
        w: [-7, -9],
    }
    

    const ranks = [8, 7, 6, 5, 4, 3, 2, 1]
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"]

    // table of valid board squares in 0x88 format 
    const SQUARES = {
        a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
        a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
        a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
        a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
        a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
        a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
        a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
        a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };

    const white_pieces = [];
    const black_pieces = [];

    //obj template - example 
    const squareInfo = {
        algebraicId: 'a1', // square's ID in algebraic notation, e.g. a1, f3, h8
        hexId: 0,   // ID in 0x88 board representation, e.g. 0-7, 16-23, 32-39...
        piece: 'empty', // current piece on this square 
        pieceColor: 'empty',    // current piece's color - maybe unnecessary, implicit piece color W vs b
        controlledBy: [],   // array of all pieces that attack, defend, or control this square 
    }
//

const generate_fen = () => {
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

    console.log(fen)
    return fen
  }


  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
    
    const rank = (i) => {
        return i >> 4
    }
    
    const file = (i) => {
        return i & 15
    }

    const algebraic = (i) => {
        var f = file(i),
        r = rank(i)
        return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
    }

    const swap_color = (c) => {
        return c === 'w' ? 'b' : 'w'
    }
    
    // util function to determine if string is a number
    const is_digit = (d) => {
        return '0123456789'.indexOf(d) !== -1
    }
    
    // this function takes a FEN string as input and fills the board array with values for the initial render
    // placeholder for now
    const fenBoard = (fen) => {

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
                    piece: piece,
                    pieceColor: piece.match(/[A-Z]/)? 'w': 'b',
                    controlledBy: []
                })
                square++
            }
        }

    }

    // calculate the Attacked, Defended, and Controlled squares of a given piece
    // this has to be done after the full board is rendered and all piece positions are placed
    // square refers to decimal ID for now
    const setADC = (piece, square, color) => {
        if (piece === 'p') {
            pawn_captures88[color].forEach((move) => {
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
            piece_moves88[piece].forEach((move) => {

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

    const initADC = () => {
        //console.log('ADC init')
        white_pieces.forEach((info) => {
            const pieceType = info.piece.toLowerCase();
            const square = info.squareHex;
            const color = 'w'

            setADC(pieceType, square, color)
        })

        black_pieces.forEach((info) => {
            const pieceType = info.piece.toLowerCase();
            const square = info.squareHex;
            const color = 'b'

            setADC(pieceType, square, color)
        })
    }


    const printKey = (ev) => {
        //prints the info stored in the clicked square
        const square = board[ev.target.id]
        console.log(square, ev.target.id, selected);
        if (selected) {
            const piece = selected.piece;
            const color = selected.pieceColor;
            const moveSAN = algebraic(ev.target.id)
            
            board[selected.hexId].piece = null;
            square.piece = piece;
            square.pieceColor = color;

            const fen = generate_fen()
            setMoveHistory([...moveHistory, {san: moveSAN, piece: piece, fen: fen}])
            setSelected();
            setFen(fen);
            } else {
            square.piece 
            ? setSelected(square)
            : setSelected()
            }
    }

    //placeholder until user decides board loading 
    fenBoard(fen)

    initADC();

    //console.log(board);
    //console.log('White Pieces:', white_pieces);
    //console.log('Black Pieces:', black_pieces);

    
    return (
        <Wrapper>
            {files.map((file, findex) => {
                return <div 
                id={file}
                key={file}>{ranks.map((rank, rindex) => {

                    // 1 render sets the entire board including tiles and pieces
                    // helper constants are set conditionally so we can display an empty board
                    const id = (findex) + (16 * rindex)
                    const selectedId = selected ? selected.hexId : -1;
                    const square = board[id]
                    const piece = square ? square.piece : 0;
                    const color = square ? square.pieceColor : 0;
                    const controlledBy = square ? square.controlledBy : [];
                    // occupied squares are always brighter
                    const multiplier = piece ? 1 : 0.75;

                    const isSelected = id == selectedId 
                        || controlledBy.find((obj) => {
                            return Object.values(obj).includes(selectedId, 0)
                                //&& !(Object.values(obj).includes('p', 0))
                            })
                         ? true : false;
                    //

                    const allyControl = controlledBy.filter(x => x.color === 'w')
                    const enemyControl = controlledBy.filter(x => x.color === 'b')

                    
                    const alpha = 0.15 * ((allyControl.length) + (enemyControl.length)) * multiplier;
                    const importance = 5 * ((allyControl.length) + (enemyControl.length * 1));
                    const blue = (allyControl?.length * 100) * multiplier;
                    const red = (enemyControl?.length * 100) * multiplier;
                    // green value is set only for uncontested squares 
                    const green = 35;
                        // controlledBy 
                        // && square.piece === null
                        // && (allyControl.length === 0 
                        //     || enemyControl.length === 0) 
                        //     ? 75 * controlledBy.length 
                        //     : 0;

                    //console.log("red:", red, "green:", green, "blue:", blue)

                    return <Square 
                    id={id}
                    key={rank}
                    className={
                        (findex % 2 === 0 && rindex % 2 === 0)
                        || (findex % 2 !== 0 && rindex % 2 !== 0)
                        ? 'white'
                        : 'black'
                    }
                    ><Piece
                            id={id}
                            onClick={printKey}
                            src={piece ? `./assets/pieces/${piece}${color}.png` : `./assets/pieces/em.png`}
                            className={
                                isSelected === true
                                ? 'selected'
                                : 'none'
                            }   
                            style={{...styled,
                                filter: `drop-shadow(0px 0px ${importance}px rgba(${red}, 0, ${blue}, 0.75))`,
                                backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`
                            }}
                            />
                    </Square>
                })}</div>
            })}
        </Wrapper>
    )
}

//temp
//

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction:row;
`

const Square = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border: 1px solid black;
    background-color: whitesmoke;
    &.black{
        //background-color: rgb(225,225,225);
    }
`

const Piece = styled.img`
    position: absolute;
    width: inherit;
    height: inherit;
    &.selected{
        
        box-shadow: 0 0 10px 0 yellow;
        //border-radius: 50%;
    }
`
const Highlight = styled.div`
    width: 100px;
    height: 100px;
`

export default GameBoard;