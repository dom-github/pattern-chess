import useFetch from "../CustomHooks/useFetch";
import styled from "styled-components";


const GameInfo = () => {
    const {state} = useFetch(`https://api.chess.com/pub/player/birdsnearherhouse/games/2021/07`)

    return <Info>(external) Game and Player Info</Info>

}

const Info = styled.div`
    border: 1px solid black;
    padding: 10px;
    width: 300px;
    height: 100px;
`

export default GameInfo;