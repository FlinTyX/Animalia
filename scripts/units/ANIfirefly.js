const morse = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    " ": "&",
}

//string -> morse code
const decode = (str) => {
    str = str.toUpperCase().split("").map(e => {
        return "|" + (morse[e] ? morse[e] : e);
    }).join("");

    return str.split("|" + morse[" "] + "|").map(e => {
        return morse[" "] + e; 
    }).join("").substr(morse[" "].length + 1);
};

//array shuffle
const shuffle = (array) => {
    for(var i = 0, length = array.length, swap = 0, temp = ""; i < length; i++){
        swap    = Math.floor(Math.random() * (i + 1));
        temp    = array[swap];
        array[swap] = array[i];
        array[i]    = temp;
    }
    return array;
}

//sorts an array by percentage
const sortByPercentage = (values, chances) => {
    const pool = [];
    for(let i = 0; i < chances.length; i++){
        for(let i2 = 0; i2 < chances[i]; i2++){
            pool.push(i);
        }
    }
    return values[shuffle(pool)["0"]];
}
