import styled from "styled-components";

const MoveHistory = ({moveHistory, setFen}) => {

    console.log(
        "b:", "b".charCodeAt(0), //98
        "k:", "k".charCodeAt(0), //107
        "n:", "n".charCodeAt(0), //110
        "p:", "p".charCodeAt(0), //112
        "q:", "q".charCodeAt(0), //113
        "r:", "r".charCodeAt(0), //114
    )
    
    // alphabetical order: bishop, king, (k)night, pawn, queen, rook
    const pieces = "bknpqrBKNPQR";
    const pieceChars = "♗♔♘♙♕♖♝♚♞♟♛♜"

    console.log("History:", moveHistory)
    // chess piece characters 
    // ♜	♞	♝	♛	♚	♝	♞	♜
    // ♟	♟	♟	♟	♟	♟	♟	♟

    // ♙	♙	♙	♙	♙	♙	♙	♙
    // ♖	♘	♗	♕	♔	♗	♘	♖

    return (
        <Wrapper>Move History:
            <Moves>
                {moveHistory.map((move, index) => {
                    const san = move.san
                    const piece = move.piece
                    const fen = move.fen
                    const pieceChar = pieceChars.charAt(pieces.indexOf(piece));

                    return <Move 
                        key={index}
                        onClick={() => {
                            setFen(fen)
                        }}>{pieceChar}{san}, </Move>
                })}
            </Moves>
        </Wrapper>


    )
    
}

const Wrapper = styled.div`
    margin-top: 20px;
    border: 2px solid black;
    width: 500px;
    height: 500px;
    text-align: center;
    text-decoration: underline;
`

const Moves = styled.div`
    text-decoration: none;

`
const Move = styled.span`
    display: inline-block;
    text-decoration: none;
    cursor: pointer;

`

export default MoveHistory;



