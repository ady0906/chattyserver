// server.js

const express = require('express');
const WebSocket = require('ws');
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 4001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({ port: PORT });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

// broadcast
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  });
};

wss.on('connection', (ws) => {

  console.log('Client connected');

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  let usersConnected = {id: uuid.v4(), type: 'howMany', usersRN: wss.clients.size};
  wss.broadcast(JSON.stringify(usersConnected));

  ws.on('message', function incoming(message) {
    let data = JSON.parse(message);

    // that's where the conditional components should come to differentiate b/w messages and notifications
    if (data.type === 'postMessage') {

      data.id = uuid.v4();
      data.type = 'incomingMessage';
      console.log(`User ${data.username} said, ${data.content}`);
      wss.broadcast(JSON.stringify(data));

    } else if (data.type === 'postNotification') {

      data.id = uuid.v4();
      data.type = 'incomingNotification';

      wss.broadcast(JSON.stringify(data));
    }

  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    let usersDisonnected = {id: uuid.v4(), type: 'howMany', usersRN: wss.clients.size};
    wss.broadcast(JSON.stringify(usersDisonnected));
  })
});
