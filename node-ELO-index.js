// Made by Russell Rounds

const express  = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const http = require("http");
const port = 3000;
const app = express();

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
	
	if(playerArray.length){
		console.log("Resetting playerArray...");
		playerArray = [];
	}
	if(!playerArray.length){
		console.log("playerArray Empty!");
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
	//let image = req.body.playerImage;
	playerArray.push(winnerLoserArray);
	logArray(winnerLoserArray); // Print Array
	console.log("Redirecting to / ...");
	res.redirect("/");
});

function logArray(theArray){
	console.log("Logging Array...");
	Array.from(Object.keys(theArray)).forEach(function(key){
		console.log(key + ": " + theArray[key]);
	});
};