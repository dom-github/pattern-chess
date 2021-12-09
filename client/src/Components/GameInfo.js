import useFetch from "../CustomHooks/useFetch";


const GameInfo = () => {
    const {state} = useFetch(`https://api.chess.com/pub/player/birdsnearherhouse/games/2021/07`)
}

export const GameInfo;