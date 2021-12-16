import { useRef, useState } from "react";
import styled from "styled-components";
import DisplayFEN from "./Components/DisplayFEN";
import GameBoard from "./Components/GameBoard";
import MoveHistory from "./Components/MoveHistory";
import GameInfo from "./Components/GameInfo";
import { startingPosition } from "./Constants/constants";
import GlobalStyles from "./GlobalStyles";
import BoardOptions from "./Components/BoardOptions";


function App() {
  const [fen, setFen] = useState(startingPosition);
  const moveHistory = useRef([]);

  const [showBlkCtrl, setShowBlkCtrl] = useState(1);
  
  const [showWhtCtrl, setShowWhtCtrl] = useState(1);
  

  return (
    <div className="App" style={{backgroundColor: "#181A1B", margin: "0"}}>
      <GlobalStyles />
      <Page>
        <GameBoard 
        fen={fen}
        setFen={setFen}
        moveHistory={moveHistory}
        showBlkCtrl={showBlkCtrl}
        showWhtCtrl={showWhtCtrl}
        
          />
        <Info>
          <GameInfo setFen={setFen} moveHistory={moveHistory}/>
          <DisplayFEN  fen={fen} setFen={setFen}/>
          <BoardOptions 
          setShowBlkCtrl={setShowBlkCtrl}
          setShowWhtCtrl={setShowWhtCtrl}
          showBlkCtrl={showBlkCtrl}
          showWhtCtrl={showWhtCtrl}
          />
          <MoveHistory moveHistory={moveHistory} setFen={setFen}/>
        </Info>
      </Page>
    </div>
  );
}


const Page = styled.div`
  margin: 0;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #181A1B;
  color: whitesmoke;
`
const Info = styled.div`
  margin: 0;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  position: relative;
  font-size: larger;
`

export default App;
