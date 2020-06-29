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
let maxPlayers = 5;

app.get("/", function(req, res){
	console.log("Serving / ...");

	if(playerArray.length){
		console.log("Player Array: " + JSON.stringify(playerArray));
	}
	if(Array.isArray(newPlayers)){
		console.log("Making New Player Array!");
		let playerOne = getRandomIntInclusive(1, maxPlayers);
		let playerTwo = playerOne + "D";
		let playerOneNamePath = namePath + playerOne + ".txt";
		let playerTwoNamePath = namePath + playerTwo + ".txt";
		let playerOneName = fs.readFileSync(playerOneNamePath).toString();
		let playerTwoName = fs.readFileSync(playerTwoNamePath).toString();
		newPlayers[0] = playerOne;
		newPlayers[1] = playerOneName;
		newPlayers[2] = playerTwo;
		newPlayers[3] = playerTwoName;
		console.log("New Players: " + newPlayers);
	}
    	
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
	//console.log("Winner Old Score:" + winnerOldScore);
	let loserOldScore = Number(fs.readFileSync(loserScoreFile));
	//console.log("Loser Old Score:" + loserOldScore);

	let winnerELO = ELO(winnerOldScore, loserOldScore);
	//console.log("Winner ELO Rating: " + winnerELO);
	let loserELO = ELO(loserOldScore, winnerOldScore);
	//console.log("Loser ELO Rating: " + loserELO);
	
	const k = 32;
	let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
	//console.log("Winner New Score: " + winnerNewScore);
	let loserNewScore = loserOldScore + (k * (0 - loserELO));
	//console.log("Loser New Score: " + loserNewScore);
	
	winnerLoserArray = {winner: winner, loser: loser, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerELO: winnerELO, loserELO: loserELO, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore};
	
	console.log(winnerLoserArray);
	
	playerArray.push(winnerLoserArray);
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