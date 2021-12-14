import { useState } from "react";
import styled from "styled-components";
import DisplayFEN from "./Components/DisplayFEN";
import GameBoard from "./Components/GameBoard";
import MoveHistory from "./Components/MoveHistory";
import GameInfo from "./Components/GameInfo";


function App() {
  const startingPosition = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`;
  const [fen, setFen] = useState(startingPosition);
  const [moveHistory, setMoveHistory] = useState([]);

  return (
    <div className="App">
      <Page>
        <GameBoard fen={fen} setFen={setFen} moveHistory={moveHistory} setMoveHistory={setMoveHistory}/>
        <Info>
          <GameInfo />
          <DisplayFEN  fen={fen} setFen={setFen} start={startingPosition}/>
          <MoveHistory moveHistory={moveHistory} setFen={setFen}/>
        </Info>
      </Page>
    </div>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: row;
`
const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
`

export default App;
