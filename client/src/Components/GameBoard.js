import styled from "styled-components";

//rendering the basic game board 

//FEN setup:
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

// r = rookb R = rookw
// n = knightb N = knightw
// b = bishopb B = bishopw
// q = queenb Q = queenw
// k = kingb K = kingw
// p = pawnb P = pawnw

const GameBoard = () => {

    const board = [];

    //this function takes a FEN string as input and fills the board array with values for the initial render
    //placeholder for now
    const fenBoard = (fen) => {

		const items = fen.split(/\s/g); //split the FEN pieces from other info
		const pieces = items[0];  //idgaf about anything but the pieces

        //just for testing
        let fenRank = 0;
        //add pieces to board array
        //and convert numbers to "empty" pieces 
        pieces.split("/").forEach((rank) => {
            fenRank++
            //split into individual pieces (letters) and empty squares (numbers)
            rank.split("").forEach((piece) => {
                console.log(fenRank, piece)
                if (Number.isInteger(parseInt(piece))) {
                    //is a number = create blank spaces
                    for (let i = 0; i < piece; i++)
                    board.push('em')
                } else {
                    board.push(piece)
                }
            })
        })
		
    }

    fenBoard(`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`)

    console.log(board)

    const printKey = (ev) => {
        console.log(ev.target.id)
    }
    
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1]
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"]

    return (
        <Wrapper>
            {files.map((file, findex) => {
                return <div 
                id={file}
                key={file}>{ranks.map((rank, rindex) => {
                    return <Square 
                    id={file+rank}
                    onClick={printKey}
                    key={rank}
                    className={
                        (findex % 2 === 0 && rindex % 2 === 0)
                        || (findex % 2 !== 0 && rindex % 2 !== 0)
                        ? 'white'
                        : 'black'
                        
                    }
                    >{findex}{rindex}<div>{board[(findex) + (8 * rindex)]}</div></Square>
                })}</div>
            })}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction:row;
`

const Square = styled.div`
    width: 100px;
    height: 100px;
    border: 1px solid black;
    &.black{
    background-color: gray;
    }
`

export default GameBoard;