
/*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
    
const rank = (i) => {
    return i >> 4
}

const file = (i) => {
    return i & 15
}

export const algebraic = (i) => {
    var f = file(i),
    r = rank(i)
    return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
}

const swap_color = (c) => {
    return c === 'w' ? 'b' : 'w'
}

// util function to determine if string is a number
export const is_digit = (d) => {
    return '0123456789'.indexOf(d) !== -1
}


    // alg square to 0x88
    export const alg_to_hex = (an) => {
        // always returns two strings: file, rank
        const a = "a".charCodeAt(0)
        const splitAN = an.split("")
        const fileVal = splitAN[0].charCodeAt(0) - a
        const rankVal = ( 8 - (parseInt(splitAN[1])) ) * 16

        return (rankVal + fileVal)

            

    }
    //trim whitespace around string
    export const trim = (str) => {
        return str.replace(/^\s+|\s+$/g, '')
    }

    // parses all of the decorators out of a SAN string
    export const stripped_san = (move) => {
        return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
    }