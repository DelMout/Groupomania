const express = require("express");
const app = require("./app");
const http = require("http");

const db = require("./models");

const server = http.createServer(app);

db.sequelize.sync().then((req) => {
	server.listen(3001, () => {
		console.log("server running !");
	});
});
