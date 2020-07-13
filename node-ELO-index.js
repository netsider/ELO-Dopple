// Made by Russell Rounds

// Node Modules
const http = require("http");
const fs = require("fs");

// NPM Modules
const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const sizeOf = require("image-size");

const app = express();
const port = 3000;

console.log("Starting...");

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
let resetArray = [];
resetArray[0] = 0;
resetArray[1] = 0;
resetArray[2] = false;
newPlayers[3] = false;
let playerIsLocked = 0;

if(isEven(dirLength)){
	maxPlayers = (dirLength / 2);
}else{
		console.log("Number of players in directory not even number!");
}

app.get("/", function(req, res){
	console.log("Serving / ...");

	let playerOne = getRandomIntInclusive(1, maxPlayers);
	
	if(playerArray[0] != undefined){
		if(playerArray[0].lockPlayer === 1){ // If answer button pressed and checkbox checked
			console.log("Players Locked!");
			//console.log(" playerArray[0].winner.charAt(0): " + playerArray[0].winner.charAt(0));
			playerOne = playerArray[0].winner.charAt(0);
			playerIsLocked = 1;
			newPlayers[3] = "true";
		}else{ // If answer button pressed and checkbox NOT checked
			newPlayers[3] = "false";
			playerIsLocked = 0;
		}
	}else{
			console.log("playerArray undefined!");
	}
	
	if(resetArray[0] == 0 && resetArray[1] == 0){ // Reset pressed without checkbox
		console.log("resetArray: " + resetArray);
		if(resetArray[3] == "false"){
			newPlayers[3] = "false";
		}
	}else{
		if(resetArray[0] == 1){ // player lock checkbox checked, and reset pressed
			console.log("Checkbox checked and reset pressed");
			playerOne = resetArray[1]; // choose locked player
			playerIsLocked = 1;
			newPlayers[3] = "true";
		}
	}
	
	if(playerArray[0] != undefined && playerArray[0] != NaN && playerIsLocked != 1 && newPlayers[3] == "false"){ // If winner/loser chosen -- to prevent showing same two people consequtively
		console.log("Player not locked!");
		if(playerOne == playerArray[0].winner.charAt(0)){ 
			console.log("New players are the same as old players!  Choosing different...");
			while(playerOne == playerArray[0].winner.charAt(0)){
				//console.log("New players are STILL the same as old players!  Choosing different...");
				playerOne = getRandomIntInclusive(1, maxPlayers);
			}
			//console.log("Successfully chose different player than old player!");
		}
	}
	
	
	
	let playerTwo = playerOne + "D";
	
	let playerOneNamePath = namePath + playerOne + ".txt";
	let playerTwoNamePath = namePath + playerTwo + ".txt";
	
	let playerOneScorePath = scorePath + playerOne + ".txt";
	let playerTwoScorePath = scorePath + playerTwo + ".txt";
	
	let playerOneImage = photoPath + playerOne + ".jpg";
	let playerTwoImage = photoPath + playerTwo + ".jpg";
	
	// Calculate original aspect ratio of pictures
	let dimensions1 = sizeOf(playerOneImage);
	let dimensions2 = sizeOf(playerTwoImage);
	let aspectRatioP1 = getAspectRatio(dimensions1.width, dimensions1.height);
	let aspectRatioP2 = getAspectRatio(dimensions2.width, dimensions2.height);
	
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
	
	newPlayers[4] = playerIsLocked;

	// Debugging:
	//console.log("Player One Score: " + playerOneScore);
	//console.log("Player Two Score: " + playerTwoScore);
	//console.log(playerOneELO);
	//console.log(playerTwoELO);
	//console.log("Aspect Ratio P1: " + aspectRatioP1);
	//console.log("Aspect Ratio P2: " + aspectRatioP2);
	logArray(newPlayers);
    	
	res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers})
	
})

app.post("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (post) ..");
	console.log("lockPlayer: " + req.body.lockPlayer);
	let lockPlayer = Number(req.body.lockPlayer);
	let name = req.body.playerName;
	resetArray[0] = 0;
	//let image = req.body.playerImage;
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
	//console.log("Winer Name: " + winnerName + " Loser Name: " + loserName);
	
	fs.writeFileSync(winnerScoreFile, String(winnerNewScore));
	fs.writeFileSync(loserScoreFile, String(loserNewScore));
	
	winnerLoserArray = {winner: winner, loser: loser, winnerName: winnerName, loserName: loserName, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerELO: winnerELO, loserELO: loserELO, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore, winnerNewELO: winnerNewELO, loserNewELO: loserNewELO, lockPlayer: lockPlayer};
	
	console.log(winnerLoserArray);
	
	playerArray[0] = winnerLoserArray; //playerArray.push(winnerLoserArray); 
	//console.log("Redirecting to / ...");
	res.redirect("/");
});

app.post("/resetScores", function(req, res){
		console.log("Resetting Scores...");
		
		//console.log("----playerArray----");
		//logArray(playerArray);
		//console.log(playerArray);
		
		console.log("----req.body----");
		logArray(req.body);
		
		
		let isLocked = Number(req.body.lockPlayer);
		let reset = Number(req.body.reset);
		let playerOneOnReset = req.body.playerOneHidden;
	
		if(reset === 1){
			
			resetArray[2] = true;
			
			if(isLocked === 1){
				resetArray[0] = isLocked;
				resetArray[1] = playerOneOnReset;
				newPlayers[3] = true;
			}else{
				resetArray[0] = 0;
				resetArray[1] = 0;
				playerArray[0].lockPlayer = 0;
				newPlayers[3] = false;
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
				console.log("All " + dirLength +  " score files reset!");
			}
		}
	
		console.log("----resetArray----");
		console.log(resetArray);
		
		console.log("Redirecting to / ...");
		res.redirect("/");
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