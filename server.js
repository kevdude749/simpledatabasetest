const express = require('express');

const app = express();
const MongoClient = require('mongodb').MongoClient
var db;


const WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({host:process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",port:process.env.OPENSHIFT_NODEJS_PORT || 8080});

MongoClient.connect('mongodb://KeVdUdE:kupiter749666@ds029476.mlab.com:29476/database_test', function(err, database){
	if (err) return console.log(err);
	db = database;
	app.listen(3000, function() {
	  console.log('listening on 3000');
	})
	 
})

app.use(express.static(__dirname + '/public'));


wss.on('connection', function(ws) {
	
  ws.on('message', function(message) {
	dataObject = JSON.parse(message);
	evt = dataObject.event;
	data = dataObject.data; 
	  
	if (evt == "database_add"){
		console.log(data.name + " saved this message to the database: " + data.message);
		db.collection('messages').save({name:data.name,message:data.message})
	}
	if (evt == "database_get"){
		console.log("requested database");
		db.collection('messages').find().toArray((err, result) => {
			if (err) return console.log(err)
			ws.send(JSON.stringify({event:"database",data:result}));
		})
  
	}
  });
  
});
  