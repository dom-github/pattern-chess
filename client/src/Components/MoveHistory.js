import styled from "styled-components";

const MoveHistory = ({moveHistory, setFen}) => {

    // console.log(
    //     "b:", "b".charCodeAt(0), //98
    //     "k:", "k".charCodeAt(0), //107
    //     "n:", "n".charCodeAt(0), //110
    //     "p:", "p".charCodeAt(0), //112
    //     "q:", "q".charCodeAt(0), //113
    //     "r:", "r".charCodeAt(0), //114
    // )
    
    // alphabetical order: bishop, king, (k)night, pawn, queen, rook
    const pieces = "bknpqrBKNPQR";
    const pieceChars = "♗♔♘♙♕♖♝♚♞♟♛♜"

    // chess piece characters 
    // ♜	♞	♝	♛	♚	♝	♞	♜
    // ♟	♟	♟	♟	♟	♟	♟	♟

    // ♙	♙	♙	♙	♙	♙	♙	♙
    // ♖	♘	♗	♕	♔	♗	♘	♖

    return (
        <Wrapper>Move History:
            <Moves>
                {moveHistory.current.map((move, index) => {
                    const san = move.san
                    const piece = move.piece
                    const fen = move.fen
                    const pieceChar = pieceChars.charAt(pieces.indexOf(piece));

                    const comma = (index + 1) === moveHistory.current.length ? '' : ", "
                    const space = "\u00A0";

                    const number = index % 2 === 0 ? `${(index / 2) + 1}. ` : '';
                    return <Move 
                        key={index}
                        onClick={() => {
                            setFen(fen)
                        }}>{number}{pieceChar}{san}</Move>
                })}
            </Moves>
        </Wrapper>


    )
    
}

const Wrapper = styled.div`
padding: 20px 40px;
    margin-top: 20px;
    border: 2px solid whitesmoke;
    
    width: 95%;
  @media (min-width: 1280px) {
    width: 25vw;
    height: auto;
  }
    min-height: 200px;
    text-align: center;
`

const Moves = styled.div`
    text-decoration: none;
    max-height: 25vh;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

`
const Move = styled.span`
    width: 50%;
    display: flex;
    justify-content: left;
    text-decoration: none;
    cursor: pointer;

`

export default MoveHistory;



