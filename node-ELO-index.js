// Made by Russell Rounds

// Node Modules
const http = require("http");
const fs = require("fs");

// NPM Modules
const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const sizeOf = require("image-size");

console.log("Starting...");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(port);

const namePath = "Dopples/Actress_Name/";
const scorePath = "Dopples/Actress_Score/";
const photoPath  = "Dopples/Actress_Picture/";
const dirLength = fs.readdirSync(namePath).length;
const k = 32;
let maxPlayers = 2;
let playerArray = [];
let newPlayers = [];
let resetPressed = false; // if reset pressed
newPlayers[6] = []; // last player array
newPlayers[7] = false;  // Variable which the checkbox sets to true when checked.
// playerArray[0].lockPlayer = 0; // WHY CAN'T I DO THIS!??!!??!?!?!?

if(isEven(dirLength)){
	maxPlayers = (dirLength / 2);
}else{
	//console.log("Number of players in directory not even number!");
}

app.get("/", function(req, res){
	console.log("Serving / ...");
	
	//console.log("playerArray: ");
	//logArray(playerArray[0]);
	
	//console.log("newPlayers: ");
	//logArray(newPlayers);
	
	let playerOne = getRandomIntInclusive(1, maxPlayers);
	
	// Begin form handling logic
	let playerIsLocked = 0;
	let lockPlayerCheckBox = newPlayers[7];
	
	if(playerArray[0] != undefined){ // Answer button pressed
		
		if(lockPlayerCheckBox === true && resetPressed === false){ // Answer button pressed, checkbox CHECKED
			console.log("Answer button pressed and checkbox checked (players locked!)");
			playerOne = playerArray[0].winner.charAt(0);
			playerIsLocked = 1;
		}else{ // Answer button pressed, checkbox NOT checked
			playerIsLocked = 0;
		}
		
	}else{
		//console.log("playerArray undefined!");
	}
	
	if(lockPlayerCheckBox === false && resetPressed === true){ // Reset pressed, checkbox NOT checked.
		console.log("Reset pressed, checkbox NOT checked.");
		playerIsLocked = 0;
	}
	
	if(lockPlayerCheckBox === true && resetPressed === true){ // Reset pressed, checkbox CHECKED
			console.log("Reset pressed, checkbox CHECKED.");
			playerOne = newPlayers[6][1]; // choose locked player
			playerIsLocked = 1;
	}
	// End form logic
	
	
	if(playerArray[0] != undefined && Array.isArray(playerArray[0]) && playerIsLocked === 0){ // So two players not chosen in a row
		console.log("Players not locked!");
		if(playerOne == playerArray[0].winner.charAt(0)){ 
			//console.log("New players are the same as old players!  Choosing different...");
			while(playerOne == playerArray[0].winner.charAt(0)){
				playerOne = getRandomIntInclusive(1, maxPlayers);
			}
			//console.log("Successfully chose two different players!");
		}
	}
	
		if(playerArray[0] == undefined){
			//playerArray[0] = [];
			console.log("playerArray[0] == undefined!!!!!!! 1");
		}
	
		if(playerIsLocked === 1){ // Will it ever be undefined if the player isn't locked, since they need to submit it to lock it?????
			console.log("Players locked!");
			//newPlayers[7] = true;  // Should I not change newPlayers[7] right before page load?
			if(playerArray[0] != undefined){
				playerArray[0].lockPlayer = 1;
				playerOne = playerArray[0].winner.charAt(0);
			}else{
				console.log("playerArray[0] == undefined!!!!!!! 2");
			}
		}else{
			 if(playerArray[0] != undefined){
				playerArray[0].lockPlayer = 0;
			}else{
				console.log("playerArray[0] == undefined!!!!!!! 3");	
			}
			playerOne = getRandomIntInclusive(1, maxPlayers);
			//newPlayers[7] = false;
		}
		
	
	let playerTwo = playerOne + "D";
	
	const playerOneNamePath = namePath + playerOne + ".txt";
	const playerTwoNamePath = namePath + playerTwo + ".txt";
	
	const playerOneScorePath = scorePath + playerOne + ".txt";
	const playerTwoScorePath = scorePath + playerTwo + ".txt";
	
	const playerOneImage = photoPath + playerOne + ".jpg";
	const playerTwoImage = photoPath + playerTwo + ".jpg";
	
	// Calculate original aspect ratio of pictures
	const dimensions1 = sizeOf(playerOneImage);
	const dimensions2 = sizeOf(playerTwoImage);
	const aspectRatioP1 = getAspectRatio(dimensions1.width, dimensions1.height);
	const aspectRatioP2 = getAspectRatio(dimensions2.width, dimensions2.height);
	
	let playerOneName = "Namefile Not Found";
	if(fs.existsSync(playerOneNamePath)){
		playerOneName = fs.readFileSync(playerOneNamePath).toString();
	}
		
	let playerTwoName = "Namefile Not Found";
	if(fs.existsSync(playerTwoNamePath)){
		playerTwoName = fs.readFileSync(playerTwoNamePath).toString();
	}
		
	let playerOneScore = 0;
	if(fs.existsSync(playerOneScorePath)){
		playerOneScore = Number(fs.readFileSync(playerOneScorePath));
	}
		
	let playerTwoScore = 0;
	if(fs.existsSync(playerTwoScorePath)){
		playerTwoScore = Number(fs.readFileSync(playerTwoScorePath));
	}
	
	let playerOneELO = (ELO(playerOneScore, playerTwoScore) * 100).toFixed(2); // Two decimal places
	let playerTwoELO = (ELO(playerTwoScore, playerOneScore) * 100).toFixed(2); // Two decimal places
		
	newPlayers[0] = [];
	newPlayers[1] = [];
	
	newPlayers[0][0] = playerOne;
	newPlayers[0][1] = playerOneName;
	newPlayers[0][2] = playerOneScore;
	newPlayers[0][3] = playerOneELO;
	newPlayers[0][4] = aspectRatioP1;
	
	newPlayers[1][0] = playerTwo;
	newPlayers[1][1] = playerTwoName;
	newPlayers[1][2] = playerTwoScore;
	newPlayers[1][3] = playerTwoELO;
	newPlayers[1][4] = aspectRatioP2;

	newPlayers[5] = resetPressed; // indicate reset not pressed last time, so scoreboard doesn't show (is there another way to do this???)
	resetPressed = false; // so it doesn't stay true
	
	Debugging:
	logArray(newPlayers);
    	
	res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers})
	
})

app.post("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (post) ..");
	
	console.log("req.body.lockPlayer: " + req.body.lockPlayer);
	let lockPlayer = Number(req.body.lockPlayer);
	
	let name = req.body.playerName;
	//let image = req.body.playerImage;
	
	if(Number(req.body.lockPlayer) === 1){
		newPlayers[7] = true;
	}else{
		newPlayers[7] = false;
	}
	
	resetPressed = false;
	
	let unserialized = JSON.parse(name);
	let winner = unserialized[0].toString();
	let loser = unserialized[1].toString();
	
	let winnerScoreFile = "Dopples/Actress_Score/" + winner + ".txt";
	let loserScoreFile = "Dopples/Actress_Score/" + loser + ".txt";
	
	let winnerOldScore = Number(fs.readFileSync(winnerScoreFile));
	let loserOldScore = Number(fs.readFileSync(loserScoreFile));

	let winnerELO = ELO(winnerOldScore, loserOldScore);
	let loserELO = ELO(loserOldScore, winnerOldScore);
	
	// ELO score distribution
	let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
	let loserNewScore = loserOldScore + (k * (0 - loserELO));
	
	let winnerNewELO = ELO(winnerNewScore, loserNewScore);
	let loserNewELO = ELO(loserNewScore, winnerNewScore);
	
	let winnerNamePath = namePath + winner + ".txt";
	let loserNamePath = namePath + loser + ".txt";
	let winnerName = fs.readFileSync(winnerNamePath).toString();
	let loserName = fs.readFileSync(loserNamePath).toString();
	
	fs.writeFileSync(winnerScoreFile, String(winnerNewScore));
	fs.writeFileSync(loserScoreFile, String(loserNewScore));
	
	winnerLoserObject = {winner: winner, loser: loser, winnerName: winnerName, loserName: loserName, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerELO: winnerELO, loserELO: loserELO, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore, winnerNewELO: winnerNewELO, loserNewELO: loserNewELO, lockPlayer: lockPlayer};
	
	console.log(winnerLoserObject);
	
	playerArray[0] = winnerLoserObject; //playerArray.push(winnerLoserObject); 
	//console.log("Redirecting to / ...");
	res.redirect("/");
});

app.post("/resetScores", function(req, res){
		console.log("Resetting Scores...");
		
		//console.log("----req.body----");
		//logArray(req.body);
		
		let playerOneOnReset = req.body.playerOneHidden;
	
		if(Number(req.body.reset) === 1){
			
			resetPressed = true;
			
			if(Number(req.body.lockPlayer) === 1){
				
				newPlayers[6][1] = playerOneOnReset; // last player
				newPlayers[6][2] = playerOneOnReset + "D";
				newPlayers[7] = true; // Checkbox checked
			}else{
				newPlayers[7] = false; // Checkbox NOT checked
			}
			
			let startingScore = "0";
			for (let i = 1; i <= dirLength; i++) {
				let scoreFileTemp1 = scorePath + i + ".txt";
				let scoreFileTemp2 = scorePath + i + "D.txt";
				console.log("Resetting " + scoreFileTemp1);
				console.log("Resetting " + scoreFileTemp2);
				fs.writeFileSync(scoreFileTemp1, startingScore);
				fs.writeFileSync(scoreFileTemp2, startingScore);
				if(dirLength == i){
					//console.log("All " + dirLength +  " score files reset!");
			}
		}
		
		//console.log("Redirecting to / ...");
		res.redirect("/");
	}else{
		resetPressed = false;
	}
})

function getAspectRatio(w, h){
	let ar = Number((h / w).toString().substr(0, 4));
	return ar;
};
	
function ELO(A, B){
	return 1 / (1 + Math.pow(10,((B - A)/400)));
};

function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
}

function logArray(theArray){
	//console.log("Logging Array...");
	Array.from(Object.keys(theArray)).forEach(function(key){
		console.log(key + ": " + theArray[key]);
	});
};