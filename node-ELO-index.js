// Made by Russell Rounds

const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const http = require("http");
const port = 3000;
const app = express();
const fs = require('fs');

console.log("Starting...");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(port);

let playerArray = [];
let newPlayers = [];
let namePath = "Dopples/Actress_Name/";
let scorePath = "Dopples/Actress_Score/";

let maxPlayers = 5;

app.get("/", function(req, res){
	console.log("Serving / ...");

	let playerOne = getRandomIntInclusive(1, maxPlayers);
	let playerTwo = playerOne + "D";
	let playerOneNamePath = namePath + playerOne + ".txt";
	let playerTwoNamePath = namePath + playerTwo + ".txt";
	let playerOneScorePath = scorePath + playerOne + ".txt";
	let playerTwoScorePath = scorePath + playerTwo + ".txt";
		
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
	
	let playerOneELO = (ELO(playerOneScore, playerTwoScore) * 100).toFixed(2);
	let playerTwoELO = (ELO(playerTwoScore, playerOneScore) * 100).toFixed(2);
		
	newPlayers[0] = [];
	newPlayers[1] = [];
	newPlayers[0][0] = playerOne;
	newPlayers[0][1] = playerOneName;
	newPlayers[0][2] = playerOneScore;
	newPlayers[0][3] = playerOneELO;
	newPlayers[1][0] = playerTwo;
	newPlayers[1][1] = playerTwoName;
	newPlayers[1][2] = playerTwoScore;
	newPlayers[1][3] = playerTwoELO;
		
	// Debugging:
	//console.log("Player One Score: " + playerOneScore);
	//console.log("Player Two Score: " + playerTwoScore);
	//console.log(playerOneELO);
	//console.log(playerTwoELO);
	logArray(newPlayers);
    	
	res.render("node-dopple-main", {playerArray: playerArray, newPlayers: newPlayers})
	
	if(playerArray.length){ // Make sure array empty before user clicks
		//console.log("Player Array: " + JSON.stringify(playerArray));
		//console.log("Resetting playerArray...");
		playerArray = [];
	}	
})

app.post("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (post) ..");
	
	let name = req.body.playerName;
	//let image = req.body.playerImage;
	let unserialized = JSON.parse(name);
	let winner = unserialized[0];
	let loser = unserialized[1];
	let winnerLoserArray = {winner: winner, loser: loser};
	
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
	
	const k = 32;
	let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
	let loserNewScore = loserOldScore + (k * (0 - loserELO));
	//console.log("Winner New Score: " + winnerNewScore);
	//console.log("Loser New Score: " + loserNewScore);
	
	fs.writeFileSync(winnerScoreFile, String(winnerNewScore));
	fs.writeFileSync(loserScoreFile, String(loserNewScore));
	
	winnerLoserArray = {winner: winner, loser: loser, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerELO: winnerELO, loserELO: loserELO, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore};
	
	console.log(winnerLoserArray);
	
	playerArray[0] = winnerLoserArray; //playerArray.push(winnerLoserArray); 
	//console.log("Redirecting to / ...");
	res.redirect("/");
});

function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};
	
function ELO(A, B){
	return 1 / (1 + Math.pow(10,((B - A)/400)));
};

function logArray(theArray){
	//console.log("Logging Array...");
	Array.from(Object.keys(theArray)).forEach(function(key){
		console.log(key + ": " + theArray[key]);
	});
};