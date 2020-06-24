const express  = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const http = require("http");
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const visited = []
app.get("/", function(req, res){
   res.render("landing");
})