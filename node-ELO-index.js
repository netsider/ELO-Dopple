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
	playerArray = [];
})

app.get("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (get) ...");
    res.render("node-dopple-main", {playerArray: playerArray})
})

app.post("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (post) ..");
	let name = req.body.playerName;
	//let image = req.body.playerImage;
	let unserialized = JSON.parse(name);
	//console.log("unserialized[0]: " + unserialized[0]);
	//console.log("unserialized[0]: " + unserialized[1]);
	let winner = unserialized[0];
	let loser = unserialized[1];
	let winnerLoserArray = {winner: winner, loser: loser};
	//console.log("name: " + name);
	playerArray.push(winnerLoserArray);
	logArray(winnerLoserArray); // Print Array
	console.log("Redirecting to / ...");
	//res.redirect("/node-dopple-main");
	res.redirect("/");
});

function logArray(theArray){
	console.log("Logging Array...");
	Array.from(Object.keys(theArray)).forEach(function(key){
		console.log(key + ": " + theArray[key]);
	});
};