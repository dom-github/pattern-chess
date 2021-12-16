import useFetch from "../CustomHooks/useFetch";
import styled from "styled-components";
import { submitMove } from "../Functions/submitMove";
import { fenBoard } from "../Functions/fenBoard";
import { pawn_moves, startingPosition } from "../Constants/constants";
import { initADC } from "../Functions/ADC";
import { algebraic, alg_to_hex, stripped_san, trim } from "../Functions/utils";
import { useState } from "react";


const GameInfo = ({moveHistory, setFen}) => {

    const [viewDetails, setViewDetails] = useState('examples')
    const [inputHandle, setInputHandle] = useState('')

    const loggedIn = sessionStorage.getItem("currentUser") 
    
    const [url, setUrl] = useState('/api/db/players')

    const {state} = useFetch(url)

    //const {state} = useFetch(`https://api.chess.com/pub/player/connordontknowme/games/2021/10`)

    // temp disable
    // const state = {status: 'done'}


    // This is a PGN parser built to handle nice,
    // logically laid-out PGNs. Maybe there can be bugs
    // with non-standard notations, or notation errors
    // "Regex, I love you, but you're bringing me down..."

    const lazyPGN = (pgn) => {    

        //const terminations = ['1-0', '0-1', '1/2-1/2', '*']
  
        // split headers and moves
        let parsed = pgn.split(/\n\n/);
    

        // I can use some of the headers info maybe
        //const headers = parsed[0]
        //console.log(parsed[0])

        //only moves etc
        parsed = parsed[(parsed.length - 1)]

        /* delete recursive annotation variations */
        // whoever thought it was a good idea to nest PGN comments...
        // with alternate move lines... with nested comments... with alternate move lines...
        const rav_regex = /(\([^\(\)]+\))+?/g
        while (rav_regex.test(parsed)) {
            parsed = parsed.replace(rav_regex, '')
        }

        // delete comments from move info
        parsed = parsed.replace(/{(.*?)}|\((.*?)\)/g, '')
        

        // deleting move numbers 
        parsed = parsed.replace(/\d+\.(\.\.)?/g, '')

        // delete ... indicating black to move 
        parsed = parsed.replace(/\.\.\./g, '')
    
        // deleting numeric annotation glyphs 
        parsed = parsed.replace(/\$\d+/g, '')

        /* trim and get array of moves */
        parsed = trim(parsed).split(new RegExp(/\s+/))

        // remove ending result
        parsed.pop(parsed.length)


        //load_pgn(parsed);

        return parsed;

    }


    
    const infer_piece_type = (san) => {
        var piece_type = san.charAt(0)
        if (piece_type >= 'a' && piece_type <= 'h') {
            var matches = san.match(/[a-h]\d.*[a-h]\d/)
            if (matches) {
            return undefined
            }
            
            return 'p'
        }
        piece_type = piece_type.toLowerCase()
        if (piece_type === 'o') {
            return 'k'
        }
        return piece_type
    }
    
    // this takes a lazy-parsed PGN string and recreates all the moves
    // pushing them into 'history'

    // functionality:
    // assume white to start (I don't think I need to handle exceptions for this)
    // get last 2 letters for each string ("to" square)
    // then we need to parse the remainder:
    // blank === pawn move... we need to grab the right colour pawn,
    // check first for 1sq then 2sq in appropriate colour side (in case doubled pawns)

    // if capital letter is first, get pieces of type per turn colour 
    // then if there are multiples of a piece we need to check valid move 
    // if we get multiple matches we need to check for disambiguation, 
    // get file or rank of origin from string
    // if this information is missing, I guess just take whichever and 
    // blame the bad notation... calculating ahead to infer is overkill!

    // if the "to:" square is occupied, the piece will be removed
    // so capture notation can be ignored in the process but still included

    // make sure that checks + and checkmates # are ignored in the move parse
    // but still appear in the history notation

    // when the move is castling, we process 2 moves (king and rook) but only
    // submit 1 event to history, with proper notation (O-O or O-O-O)

    // if a pawn is taken en-passant the notation can be dicey or ambiguous
    // try to handle this -- but it is the least common move in chess
    // if "to" square is unoccupied, but takes is specified ('x'), and piece is pawn
    // check 1sq "up" and if it's a pawn, assume an EP capture
    // if notation specifies e.p. above should handle, but parser will need to ignore

    // finally, we should specify the piece in our notation using the chesspiece symbols

    //accepts an array of individual moves in PGN notation 
    const load_pgn = (pgn) => {

        // clear history when starting load 
        moveHistory.current = []

        // init board
        let {board, white_pieces, black_pieces} = fenBoard(startingPosition)

        initADC(board, white_pieces, black_pieces);

        // this gets updated per-move
        let fend = startingPosition;

        pgn.forEach((move, index) => {

            // get the color of move (white/black)
            const color = index % 2 === 0 ? 'w' : 'b'

            //remove unnecessary symbols for calculation
            const clean_move = stripped_san(move)

            //console.log("Move:", move, "Clean Move:", clean_move, "Turn:", color)

            // get "to" square: last digit in string, preceded by a letter 
            //const targetSquare = move.match(/[a-h][1-8]/);

            // new stacked regex, nice 
            const matches = clean_move.match(
                /([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/
            )

            const piece_type = infer_piece_type(clean_move);

            if (matches) {
                const piece = matches[1];
                const from = matches[2];
                const to = matches[3];
                const promotion = matches[4];

                const target = (alg_to_hex(to))

            const origin = determinePiece(board, color, board[target], piece_type, from)
            
            fend = submitMove(board, origin, target, piece_type, color, move, moveHistory, promotion);
            
            board = fenBoard(fend).board
            white_pieces = fenBoard(fend).white_pieces
            black_pieces = fenBoard(fend).black_pieces
            
            initADC(board, white_pieces, black_pieces);

            } else if (
                // castle short and long
                clean_move === 'O-O-O' 
                || clean_move === 'O-O') {

                fend = submitMove(board, null, null, null, color, clean_move, moveHistory);

                board = fenBoard(fend).board
                white_pieces = fenBoard(fend).white_pieces
                black_pieces = fenBoard(fend).black_pieces
                
                initADC(board, white_pieces, black_pieces);
    
            }


        })

    setFen(fend)

    }

    // this function selects the proper piece to move 
    // output is the numeric ID of the origin square
    const determinePiece = (board, color, target, piece_type, from) => {

        let result;

        let enPassant = false;


        //first check if we are doing a pawn move 
        if (piece_type === 'p' && target.piece === null) {
            // test backwards from target square to find a valid pawn move
            const pawnMove = pawn_moves[color].find((move) => {
                const testSquare = target.hexId - move;
                // if our pawn is moving to an empty square, but pawns behind are wrong colour, 
                // then we must be taking a pawn en passant
                if (board[testSquare].piece === 'p' && board[testSquare].pieceColor !== color) {
                    
                    enPassant = true;
                    // the captured piece is removed before the board is sent to SubmitMove
                    board[testSquare].piece = null;
                } else {
                    result = testSquare;
                    return board[testSquare].piece === piece_type && board[testSquare].pieceColor === color
                }

               })

        } 
        
        if (piece_type !== 'p' || (piece_type === 'p' && target.piece !== null) || enPassant === true) {

            // filter ControlledBy array on our target square to find valid piece for move
            const testPieces = target.controlledBy.filter((piece) => {
                return (piece.piece.toLowerCase() === piece_type.toLowerCase()) && piece.color === color
            })
            

            // disambiguate result if there are multiple possible moves
            if (testPieces.length > 1 && from !== undefined) {
                const testPiece = testPieces.find((piece) => {
                    return algebraic(piece.square).includes(from)
                })
            result = testPiece.square;
            
            } else {
                
                result = testPieces[0].square
            }
        }
    

        return result;


    }

    // chess.com player profile data:
    // state.data.data: games: (array)
    // game: .accuracies, .black, .white, etc
    // for me: 
    // fen (ending position) 
    // initial_setup: (fen string)
    // pgn: /n line breaks 
    // uuid is included 
    // end_time could be used for pagination cursor? 

    if (state.status === 'done') {
        

                    
        return (
            <Info>
                <Tabs>
                <Happy 
                className={viewDetails === 'profile' ? 'selected' : ''}
                onClick={() => {setViewDetails('profile')}}
                >PROFILE</Happy>
                <Happy
                className={viewDetails === 'archive' ? 'selected' : ''}
                onClick={() => {
                    setViewDetails('archive')
                    if (loggedIn !== null) {
                        setUrl(`https://api.chess.com/pub/player/${loggedIn}/games/archives`)
                    } else {
                        setUrl(`/api/db/players`) 
                    }}}
                >ARCHIVE</Happy>

                <Happy
                className={viewDetails === 'examples' ? 'selected' : ''}
                onClick={() => {
                    
                    setUrl(`/api/db/players`)
                    setViewDetails('examples')
                }}
                
                >EXAMPLES</Happy>

                </Tabs>
                {viewDetails === 'archive' && state.data?.archives && <GamesList>
                    {state.data.archives.map((arch, index) => {
                    const yyyymm = arch.match(/\d+\/\d\d/)
                    return <Game
                    key={index}
                    onClick={
                        () => {
                            setUrl(`https://api.chess.com/pub/player/${loggedIn}/games/${yyyymm}`)
                        }
                    }
                    >
                        {yyyymm}
                    </Game>
                })}
                </GamesList>}
                
                {viewDetails === 'archive' && state.data?.games && <GamesList>
                {state.data.games.map((game, index) => {
                        return <Game
                        key={index}
                        onClick={
                            () => {
                                
                                const pgn = lazyPGN(game.pgn);
                                load_pgn(pgn);
                            }
                        }
                        >
                            {game.white.username} vs {game.black.username}
                        </Game>
                    })}
                    </GamesList>}
                
                {state.data?.data && (viewDetails === 'examples' || (!loggedIn && viewDetails === 'archive')) && <GamesList>
                {state.data.data.map((player) => {             
                    return player.games.map((game, index) => {
                        return <Game
                        key={index}
                        onClick={() => {
                            //const pgn = lazyPGN(games[3].pgn)
                            const pgn = lazyPGN(game)
                            load_pgn(pgn);
                        }}
                        >{player.name} game {index + 1}</Game>
                    })
                })} 
                </GamesList>}
                {viewDetails === 'profile' && 
                <Profile>
                    <Handle
                    placeholder={'Chess.com username'}
                    value={inputHandle}
                    onChange={(ev) => {
                        setInputHandle(ev.target.value)
                    }}
                    />
                    {
                        <Login
                        onClick={() => {
                            sessionStorage.setItem("currentUser", inputHandle)
                            setUrl(`https://api.chess.com/pub/player/${inputHandle}/games/archives`) 
                        }}
                        >Log In</Login>}
                        {loggedIn}
                </Profile>}
            </Info>
            )

    } else if (state.status === 'error') {
        return <Info>There doesn't seem to be anything here!</Info>
    } else {
        return <Info>Loading Profile...</Info>
    }

}


const Login = styled.button`
padding: 5px;
`
const Handle = styled.input`
    padding: 10px;
    width: 15vw;
    height: 1vh;
    min-width: 150px;
    min-height: 30px;
`

const Profile = styled.div`
    padding: 10px;
    width: 23vw;
    height: 16vh;
    min-width: 190px;
    min-height: 50px;
`

const Tabs = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

//have a happy time
const Happy = styled.button`
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    margin: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 7vw;
    height: 20px;
    border-bottom: 1px solid gray;
    background-color: #181A1B;
    border-radius: 15%;
    &.selected{
        border-bottom: none;
    }
`

const Info = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center; 
    flex-direction: column;
    border: 1px solid gray;
    padding: 10px;
    width: 25vw;
    height: 25vh;
    min-width: 200px;
    min-height: 100px;
`

const GamesList = styled.div`
    background-color: #555;
    padding: 10px;
    width: 23vw;
    height: 16vh;
    min-width: 190px;
    min-height: 50px;
    overflow-y: scroll;
`
const Game = styled.div`
    background-color: #555;
    padding: 5px;
    cursor: pointer;
`

export default GameInfo;