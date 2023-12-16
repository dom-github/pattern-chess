import { useState } from "react";
import styled from "styled-components";
import {  
    ranks, 
    files, } from "../Constants/constants";
import { initADC } from "../Functions/ADC";
import { fenBoard } from "../Functions/fenBoard";
import { submitMove } from "../Functions/submitMove";
import { algebraic } from "../Functions/utils";

import empty from '../assets/pieceslisa/em.png';
//why must I suffer
import  bb  from '../assets/pieceslisa/bb.png';
import  bw  from '../assets/pieceslisa/bw.png';
import  kb  from '../assets/pieceslisa/kb.png';
import  kw  from '../assets/pieceslisa/kw.png';
import  nb  from '../assets/pieceslisa/nb.png';
import  nw  from '../assets/pieceslisa/nw.png';
import  pb  from '../assets/pieceslisa/pb.png';
import  pw  from '../assets/pieceslisa/pw.png';
import  qb  from '../assets/pieceslisa/qb.png';
import  qw  from '../assets/pieceslisa/qw.png';
import  rb  from '../assets/pieceslisa/rb.png';
import  rw  from '../assets/pieceslisa/rw.png';

//workaround to package images in React instead of serving thru public folder
const pieceImages = [bb, bw, kb, kw, nb, nw, pb, pw, qb, qw, rb, rw];
const pieceStrings = ["bb", "bw", "kb", "kw", "nb", "nw", "pb", "pw", "qb", "qw", "rb", "rw"];
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

const GameBoard = ({
    fen, 
    setFen, 
    moveHistory,    
    showBlkCtrl,
    showWhtCtrl
    }) => {

    const [selected, setSelected] = useState();

    const clickSquare = (ev) => {
        //prints the info stored in the clicked square
        const square = board[ev.target.id]

        if (selected) {
            const piece = selected.piece;
            const color = selected.pieceColor;
            const moveSAN = algebraic(ev.target.id)
            
            if (selected.hexId !== parseInt(ev.target.id)) {
                const newHistory = submitMove(board, selected.hexId, ev.target.id, piece, color, moveSAN, moveHistory)
                setFen(newHistory);
            }
            setSelected();
            } else {
            square.piece 
            ? setSelected(square)
            : setSelected()
            }
    }

    // load and reload board
    const {board, white_pieces, black_pieces} = fenBoard(fen)

    initADC(board, white_pieces, black_pieces);

    let whtScore = 0;
    let blkScore = 0;
    
    return (
        <InfoWrapper>
        <Wrapper>
            <Ranks>
                {ranks.map((rank) => {
                    return <Rank key={rank}>{rank}</Rank>
                })}
            </Ranks>
            {files.map((file, findex) => {
                return <Board 
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
                    // occupied squares are brighter
                    const multiplier = piece ? 1 : 0.75;

                    
                    const isSelected = id === selectedId 
                        || controlledBy.find((obj) => {
                            return Object.values(obj).includes(selectedId, 0)
                                //&& !(Object.values(obj).includes('p', 0))
                            })
                         ? true : false;
                    //
                    const allyControl = controlledBy.filter(x => x.color === 'w')
                    const enemyControl = controlledBy.filter(x => x.color === 'b')
                    
                    const alpha = 0.33 //0.15 * ((allyControl.length * showWhtCtrl) + (enemyControl.length * showBlkCtrl)) * multiplier;
                    const importance = 5 * ((allyControl.length * showWhtCtrl) + (enemyControl.length * showBlkCtrl));
                    const blue = ((allyControl?.length * 100) * multiplier * showWhtCtrl);
                    const red = ((enemyControl?.length * 100) * multiplier * showBlkCtrl);
                    whtScore += blue;
                    blkScore += red;
                    console.log("White:", whtScore, "Black:", blkScore)
                    // green value is set only for uncontested squares 
                    const green = 15;
                        // controlledBy 
                        // && square.piece === null
                        // && (allyControl.length === 0 
                        //     || enemyControl.length === 0) 
                        //     ? 75 * controlledBy.length 
                        //     : 0;
                    const img = pieceStrings.indexOf(`${piece}${color}`)

                    return <Square 
                    id={id}
                    key={rank}
                    className={
                        (findex % 2 === 0 && rindex % 2 === 0)
                        || (findex % 2 !== 0 && rindex % 2 !== 0) 
                        || (showBlkCtrl || showWhtCtrl)
                        ? 'white'
                        : 'black'
                    }
                    ><Piece
                            id={id}
                            onClick={clickSquare}
                            src={piece ? `./assets/pieceslisa/${piece}${color}.png` : `./assets/pieceslisa/em.png`}
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
                })}</Board>
            })}
        </Wrapper>
            <Files>
                {files.map((file) => {
                    return <File key={file}>{file}</File>
                })}
            </Files>
        </InfoWrapper>
    )
}

//temp
//

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const InfoWrapper = styled.div`
    width: 95vw;
    height: 95vw;
    max-height: 900px;
    padding-right: 5vw;
    @media (min-width: 1280px) {
    width: 60vw;
    height: 98vh;
    }
`

const Square = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10vw;
    height: 10vw;
    max-width: 100px;
    max-height: 100px;
    border: 1px solid gray;
    background-color: #181A1B;
    &.black{
        //disabled
        background-color: #333;
    }
`

const Piece = styled.img`
    position: absolute;
    width: inherit;
    height: inherit;
    max-width: 100px;
    max-height: 100px;
    &.selected{
        
        box-shadow: 0 0 10px 0 yellow;
        //border-radius: 50%;
    }
`
const Ranks = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const Rank = styled.div`
    text-align: center;
    align-items: center;
    width: 10vw;
    height: 10vw;
    max-width: 100px;
    max-height: 100px;
    position: relative;
    top: 5vh;
`

const Files = styled.div`
    display: flex;
    flex-direction: row;
    
    width: 100%;
    @media (min-width: 1280px) {
        width: 60vw;
    }
    justify-content: center;
`
const File = styled.div`
    display: flex;
    justify-content: center;
    width: 10vw;
    height: 10vw;
    max-width: 100px;
    max-height: 100px;
    position: relative;
    left: 5px;
    top: 5px;
`
const Board = styled.div`
margin-top: 20px;
`

export default GameBoard;