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
    res.render("node-dopple-main", {playerArray: playerArray})
})

app.get("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main ...");
    res.render("node-dopple-main", {playerArray: playerArray})
})

app.post("/node-dopple-main", function(req, res){
	console.log("Serving /node-dopple-main (post) ..");
	let name = req.body.playerName;
	let image = req.body.playerImage;
	let winner = name[1]; // Why is Node treating this as a string, accessing each character as one element?
	let loser = name[3];
	console.log("name: " + name);
	let winnerLoserArray = {winner: winner, loser: loser};
	console.log("Pushing new player to array...");
	logArray(winnerLoserArray); // Print Array
	playerArray.push(winnerLoserArray);
	console.log("Redirecting...");
	res.redirect("/node-dopple-main");
});

function logArray(theArray){
	console.log("Logging Array...");
	Array.from(Object.keys(theArray)).forEach(function(key){
		console.log(key + ": " + theArray[key]);
	});
};