const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const path=require("path");
app.use(express.static(path.join(__dirname+ "/Public")));


io.on("connection",function(socket){
    socket.on("newuser",function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });

    socket.on("exituser",function(username){
        socket.broadcast.emit("update", username + " left the conversation");
    });

    socket.on("chat",function(message){
        socket.broadcast.emit("chat", message);
    });
    


});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});