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
    gameOver: false,

    ships: [{locations: [0,0,0], hits: ["", "", ""]},
            {locations: [0,0,0], hits: ["", "", ""]},
            {locations: [0,0,0], hits: ["", "", ""]}
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

    generateShipLocations: function(){
        let locations; 
        console.log ("locations before the for loop " + locations);
        
        for (let i=0; i<this.numShips; i++){
            console.log (i);
            console.log(this.ships[i]);
           do{
               locations=this.generateShip();
               console.log (i);
            } while (this.collision(locations));
          console.log ("locations within the for loop after the generateShip and collision check " + locations);
          console.log(i);
          console.log(this.ships[i]);
          this.ships[i].locations = locations;
        };
    },

    generateShip: function(){
        
        let newShipLocations = [];
        let row;
        let col; 

        // firs define an orientation for a new ship (horizontal = 1)
        let orientation = Math.floor(Math.random() * 2);

        if(orientation===1){
            // generate a starting location for a horizontal ship
            row = Math.floor(Math.random()*this.boardsize);
            col = Math.floor(Math.random()*((this.boardsize-3)+1));
        } else {
            // generate a starting location for a vertical ship
            row = Math.floor(Math.random()*((this.boardsize-3)+1));
            col = Math.floor(Math.random()*this.boardsize);
        };

        for(let i=0; i<this.shipLength; i++){
            if(orientation===1){
                // generate locatioin array for a vertical ship
                newShipLocations.push(row + "" + (col+i));
            } else {
                // generate location array for a horizontal ship
                newShipLocations.push((row+i) + "" + col);
            };
        };

        return newShipLocations;
    }, 

    collision: function(locations){
        for (let i=0; i<this.numShips; i++ ){
            for (let j=0; j<locations.length; j++){
                if(this.ships[i].locations.indexOf(locations[j])>=0){
                    return true;
                };
            };
        };
        return false
    },

};


const controller = {
    // counter of guesses
    guesses: 0,
    guessHistory: [],

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
            } else if (this.guessHistory.indexOf(rowIndex + colIndex)>=0){
                alert("Ooops, this location has already been tested, so continue with a new one!") 
            } else { 
                this.guessHistory.push((rowIndex + colIndex));
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
                view.displayMessage("You sank all the enemy bastards in " + this.guesses + " guesses! Please reload the page to play again!");
                let fireBtn = document.getElementById("fireButton");
                fireBtn.disabled = true;
            }
        };
    },
};


// function that initiates the game

function init (){
    let fireBtn = document.getElementById("fireButton");
    fireBtn.onclick = handleFireButton;
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeydown = handleKeyDown;
    model.generateShipLocations();
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




