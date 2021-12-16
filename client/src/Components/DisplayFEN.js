import { useState } from "react";
import styled from "styled-components";
import { startingPosition } from "../Constants/constants";

const DisplayFEN = ({fen, setFen}) => {

    const [input, setInput] = useState(fen);

    const boardInits = [
        "new",
        "start",
        "chess",
        "standard",
        "default",
        "init",
        "new",
        "reset",
        "normal",
        "regular"
        ]

    const boardCurrents = ["now", "current", "cur", "board", "update", "get"]

    const validateFEN = (fenCheck) => {
                
        // do some basic checks on our input string
        // to see if user is trying to generate their own FEN board layout

        //default to true
        let validate = true;

        const fenTokens = fenCheck.split(/\s+/)

        const rows = fenTokens[0].split('/')

        if (rows.length !== 8) {
            validate = false;
        }

        for (let i = 0; i < rows.length; i++) {
            // make sure it always adds up to 64, without invalid integers (e.g. 26 instead of 8)
            let sum = 0
            let previous_was_number = false 

            // processing each row 
            for (let j = 0; j < rows[i].length; j++) {
                if (!isNaN(rows[i][j])) {
                    if (previous_was_number) {
                        validate = false;
                    }

                    sum += parseInt(rows[i][j], 10)
                    previous_was_number = true;

                } else {

                    if (!/^[prnbqkPRNBQK]$/.test(rows[i][j])) {
                        validate = false;
                    }

                    sum += 1;
                    previous_was_number = false;
                }
            }
            if (sum !== 8) {
                validate = false;
            }
        }

        return validate;
    }

    return <Fen 
    type={'text'}
    value={validateFEN(input) ? fen : input}
    onChange={(ev) => {
            setInput(ev.target.value);
        if (validateFEN(ev.target.value)) {
            setFen(ev.target.value);
        } else if (boardInits.includes(ev.target.value, 0)) {
            setFen(startingPosition);
            setInput(startingPosition);
        } else if (boardCurrents.includes(ev.target.value, 0)) {
            setInput(fen);
        } else if (ev.target.value === 'blank' || ev.target.value === 'empty') {
            setFen("8/8/8/8/8/8/8/8")
            setInput("8/8/8/8/8/8/8/8");
        }

        }
    }
    />

}

const Fen = styled.input`
    margin-top: 20px;
    width: 24vw;
    min-width: 200px;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 10px 20px;
`

export default DisplayFEN;
