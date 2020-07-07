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
let maxPlayers = 2;
let playerArray = [];
let newPlayers = [];

if(isEven(dirLength)){
	maxPlayers = (dirLength / 2);
}else{
		console.log("Number of players in directory not even number!");
}

app.get("/", function(req, res){
	console.log("Serving / ...");

	let playerOne = getRandomIntInclusive(1, maxPlayers);
	// playerOne = "1"; // manually set playerOne
	
	// Doppleganger-specific player selection (if app is ever changed to accomodate two numerical players)
	if(playerArray[0] != undefined){ // If winner/loser chosen -- to prevent showing same two people consequtively
		//console.log("playerArray[0].winner: " + playerArray[0].winner.charAt(0));
		//console.log("playerArray[0].loser: " + playerArray[0].loser.charAt(0));
		if(playerOne == playerArray[0].winner.charAt(0) && playerOne == playerArray[0].winner.charAt(0)){ 
			console.log("New players are the same as old players!  Choosing different...");
			while(playerOne == playerArray[0].winner.charAt(0) && playerOne == playerArray[0].winner.charAt(0)){
				//console.log("New players are STILL the same as old players!  Choosing different...");
				playerOne = getRandomIntInclusive(1, maxPlayers);
			}
			//console.log("Successfully chose different player than old player!");
		}
	}
	let playerTwo = playerOne + "D";
	//End Doppleganger-specific code
	
	let playerOneNamePath = namePath + playerOne + ".txt";
	let playerTwoNamePath = namePath + playerTwo + ".txt";
	
	let playerOneScorePath = scorePath + playerOne + ".txt";
	let playerTwoScorePath = scorePath + playerTwo + ".txt";
	
	let playerOneImage = photoPath + playerOne + ".jpg";
	let playerTwoImage = photoPath + playerTwo + ".jpg";
	
	// Calculate original aspect ratio of pictures, for later
	let dimensions1 = sizeOf(playerOneImage);
	let dimensions2 = sizeOf(playerTwoImage);
	let aspectRatioP1 = getAspectRatio(dimensions1.width, dimensions1.height, 4);
	let aspectRatioP2 = getAspectRatio(dimensions2.width, dimensions2.height, 4);
	
	let playerOneName = "File Not Found";
	if(fs.existsSync(playerOneNamePath)){
		playerOneName = fs.readFileSync(playerOneNamePath).toString();
	}
		
	let playerTwoName = "File Not Found";
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
	//let playerOneELO = (ELO(playerOneScore, playerTwoScore) * 100);
	//let playerTwoELO = (ELO(playerTwoScore, playerOneScore) * 100);
		
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

	// Debugging:
	//console.log("Player One Score: " + playerOneScore);
	//console.log("Player Two Score: " + playerTwoScore);
	//console.log(playerOneELO);
	//console.log(playerTwoELO);
	//console.log("Aspect Ratio P1: " + aspectRatioP1);
	//console.log("Aspect Ratio P2: " + aspectRatioP2);
	logArray(newPlayers);
    	
	res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers})
	
	if(playerArray.length){ // Make sure array empty before user clicks
		//console.log("Player Array: " + JSON.stringify(playerArray));
		//console.log("Resetting playerArray...");
		//playerArray = [];
	}	
})

app.post("/resetScores", function(req, res){
	console.log("Resetting Scores...");
	let reset = Number(req.body.reset);
	
	if(reset === 1){
		console.log("Resetting Scores: " + reset);
		
		let startingScore = 0;
		
		for (let i = 0; i < dirLength; i++) {
			//console.log("i: " + i);
			
			let scoreFileTemp1 = scorePath + i + ".txt";
			let scoreFileTemp2 = scorePath + i + "D" + ".txt";
			console.log("Resetting " + scoreFileTemp1);
			console.log("Resetting " + scoreFileTemp2);
			fs.writeFileSync(scoreFileTemp1, "0");
			fs.writeFileSync(scoreFileTemp2, "0");
			//console.log("Done Resetting Scores.");
		}
		res.redirect("/");
	}
})

app.post("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (post) ..");
	
	let name = req.body.playerName;
	//let image = req.body.playerImage;
	let unserialized = JSON.parse(name);
	let winner = unserialized[0].toString();
	let loser = unserialized[1].toString();
	
	let winnerScoreFile = "Dopples/Actress_Score/" + winner + ".txt";
	let loserScoreFile = "Dopples/Actress_Score/" + loser + ".txt";
	
	let winnerOldScore = Number(fs.readFileSync(winnerScoreFile));
	let loserOldScore = Number(fs.readFileSync(loserScoreFile));
	//console.log("Winner Old Score:" + winnerOldScore);
	//console.log("Loser Old Score:" + loserOldScore);

	let winnerELO = ELO(winnerOldScore, loserOldScore);
	let loserELO = ELO(loserOldScore, winnerOldScore);
	//console.log("Winner ELO Rating: " + winnerELO);
	//console.log("Loser ELO Rating: " + loserELO);
	
	// ELO score distribution
	const k = 32;
	let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
	let loserNewScore = loserOldScore + (k * (0 - loserELO));
	//console.log("Winner New Score: " + winnerNewScore);
	//console.log("Loser New Score: " + loserNewScore);
	
	let winnerNewELO = ELO(winnerNewScore, loserNewScore);
	let loserNewELO = ELO(loserNewScore, winnerNewScore);
	
	let winnerNamePath = namePath + winner + ".txt";
	let loserNamePath = namePath + loser + ".txt";
	let winnerName = fs.readFileSync(winnerNamePath).toString();
	let loserName = fs.readFileSync(loserNamePath).toString();
	//console.log("Winer Name: " + winnerName + " Loser Name: " + loserName);
	
	fs.writeFileSync(winnerScoreFile, String(winnerNewScore));
	fs.writeFileSync(loserScoreFile, String(loserNewScore));
	
	winnerLoserArray = {winner: winner, loser: loser, winnerName: winnerName, loserName: loserName, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerELO: winnerELO, loserELO: loserELO, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore, winnerNewELO: winnerNewELO, loserNewELO: loserNewELO};
	
	console.log(winnerLoserArray);
	
	playerArray[0] = winnerLoserArray; //playerArray.push(winnerLoserArray); 
	//console.log("Redirecting to / ...");
	res.redirect("/");
});

function getAspectRatio(w, h, decimalPlaces){
	let ar = Number((h / w).toString().substr(0, decimalPlaces));
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