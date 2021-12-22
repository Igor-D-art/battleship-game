const view = {

    displayMessage: function(msg){
        let messageArea = document.getElementById('message');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    }, 

    displayMiss: function(location){
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
};

const model = {
    boardsize: 7, // now hardcoded
    numShips: 3,  // now hardcoded
    shipLength: 3,  // number of cells in one ship - now hardcoded
    shipSunk: 0,  // now hardcoded

    ships: [{locations: ["06","16","26"], hits: ["", "", ""]},
            {locations: ["24","34","44"], hits: ["", "", ""]},
            {locations: ["10","11","12"], hits: ["", "", ""]}
    ],

    fire: function(guess){
        for (let i=0; i<this.numShips; i++){
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if(index>=0){
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage("You've HIT that bastard!");
                if(this.isSunk(ship)){  // checking if a ship isSunk
                    this.shipSunk++;
                    view.displayMessage("You sank that bastard!");
                };
                return true;
            };
        };
       view.displayMiss(guess);
       view.displayMessage("You fucking missed! I don't believe it!") 
       return false; 
    },

    isSunk: function(ship){  
        while (ship.hits.indexOf("")!==-1){
            return false;
        };
        return true; 
    },
};


const controller = {
    // counter of guesses
    guesses: 0,

    parseGuess: function(guess){
        
        let validLetters = ["A", "B", "C", "D", "E", "F", "G"];

        // validation of input as a whole

            if(guess===null || guess.length!==2){
                alert("Ooops, to sink these bastards please enter a letter A-G with a number 1-6 to have something like A3 or C6");
            } else { 
                // validation of the first character (has to ba a valid letter and the second that has to be a valid number)

            let firstChar = guess.charAt(0).toUpperCase();
            let rowIndex = validLetters.indexOf(firstChar);
            let colIndex = guess.charAt(1);

            if (isNaN(rowIndex)||isNaN(colIndex)){
                alert("Oooops, that isn't on the board!");
            } else if (rowIndex<0 || rowIndex>=model.boardsize || colIndex<0 || colIndex>=model.boardsize){  
                alert("Oooops, that isn't on the board!");
            } else {
                return rowIndex + colIndex; // concatinating row and column indexes
            };
        };
        return null;
    },

    processGuess: function(guess){
        let location = this.parseGuess(guess);
        if(location){ // null is a falsy value, so if the location is a valid value we continue with the conditional
            this.guesses++;
            let hit = model.fire(location); // model.fire returns true or false (hit or miss)

            // checking for how many ships have been sunk
            if(hit && model.shipSunk===model.numShips){
                view.displayMessage("You sank all the enemy bastards in " + this.guesses + " guesses!");
            }
        };
    },
};

function init (){
    let fireBtn = document.getElementById("fireButton");
    fireBtn.onclick = handleFireButton;
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeydown = handleKeyDown;
};

function handleFireButton(){
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value="";
};

function handleKeyDown(event){
    let fireButton = document.getElementById("fireButton");
    if (event.code === "Enter"){
        fireButton.click();
        return false; // needed to make sure that the form won't do anything else (like trying to submit itself)
    }
};

init();

// controller.processGuess("A0");
// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");
// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("E4");
// controller.processGuess("B0");
// controller.processGuess("B1");
// controller.processGuess("B2");


