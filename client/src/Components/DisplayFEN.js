import { useState } from "react";
import styled from "styled-components";

const DisplayFEN = ({fen, setFen, start}) => {

    const [input, setInput] = useState(fen);

    const boardInits = [
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
            console.log("wrong number of rows!")
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
                        console.log("wrong numbas!")
                        validate = false;
                    }

                    sum += parseInt(rows[i][j], 10)
                    previous_was_number = true;

                } else {

                    if (!/^[prnbqkPRNBQK]$/.test(rows[i][j])) {
                        console.log("wrong letters!")
                        validate = false;
                    }

                    sum += 1;
                    previous_was_number = false;
                }
            }
            if (sum !== 8) {
                console.log("one row ain't eight!")
                validate = false;
            }
        }

        return validate;
    }

    return <Fen 
    type={'text'}
    value={validateFEN(input) ? fen : input}
    onChange={(ev) => {
            console.log(ev.target.value)
            setInput(ev.target.value);
        if (validateFEN(ev.target.value)) {
            console.log("Nice FEN, fren!")
            setFen(ev.target.value);
        } else if (boardInits.includes(ev.target.value, 0)) {
            setFen(start);
            setInput(start);
        } else if (boardCurrents.includes(ev.target.value, 0)) {
            setInput(fen);
        }

        }
    }
    />

}

const Fen = styled.input`
    margin-top: 20px;
    width: 400px;
    border: 1px solid black;
    border-radius: 10px;
    padding: 20px;
`

export default DisplayFEN;
