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

app.set("view engine", "ejs");

app.listen(port);

let playerArray = [];

app.get("/", function(req, res){
	console.log("Serving / ...");
	
	if(playerArray.length){
		console.log(playerArray);
	}
    
	res.render("node-dopple-main", {playerArray: playerArray})
	
	if(playerArray.length){ // Make sure array empty before user clicks
		console.log("Resetting playerArray...");
		playerArray = [];
	}	
})

app.get("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (get) ...");
    res.render("node-dopple-main", {playerArray: playerArray})
})

app.post("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (post) ..");
	
	let name = req.body.playerName;
	let unserialized = JSON.parse(name);
	let winner = unserialized[0];
	let loser = unserialized[1];
	let winnerLoserArray = {winner: winner, loser: loser};
	
	let winnerScoreFile = "Dopples/Actress_Score/" + winner + ".txt";
	let loserScoreFile = "Dopples/Actress_Score/" + loser + ".txt";
	
	let winnerOldScore = Number(fs.readFileSync(winnerScoreFile));
	console.log("Winner Old Score:" + winnerOldScore);
	let loserOldScore = Number(fs.readFileSync(loserScoreFile));
	console.log("Loser Old Score:" + loserOldScore);

	let winnerELO = ELO(winnerOldScore, loserOldScore);
	console.log("Winner ELO Rating: " + winnerELO);
	let loserELO = ELO(loserOldScore, winnerOldScore);
	console.log("Loser ELO Rating: " + loserELO);
	
	let k = 32;
	let winnerNewScore = winnerOldScore + (k * (1 - winnerELO));
	console.log("Winner New Score: " + winnerNewScore);
	let loserNewScore = loserOldScore + (k * (0 - loserELO));
	console.log("Loser New Score: " + loserNewScore);
	
	//let image = req.body.playerImage;
	
	winnerLoserArray = {winner: winner, loser: loser, winnerOldScore: winnerOldScore, loserOldScore: loserOldScore, winnerNewScore: winnerNewScore, loserNewScore: loserNewScore};
	
	console.log(winnerLoserArray);
	
	// logArray(winnerLoserArray); // Print Array
	
	playerArray.push(winnerLoserArray);
	console.log("Redirecting to / ...");
	res.redirect("/");
});

function ELO(A, B){
	let C = B - A;
	return 1 / (1 + Math.pow(10,(C/400)));
}

function logArray(theArray){
	console.log("Logging Array...");
	Array.from(Object.keys(theArray)).forEach(function(key){
		console.log(key + ": " + theArray[key]);
	});
};