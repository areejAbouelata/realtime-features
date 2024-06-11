const jwt = require('jsonwebtoken');
const app = require('express')();
const http = require('http').createServer(app);
var io = require('socket.io')(http);
http.listen(3000);

// io.use(function(socket, next){
//   if (socket.handshake.query && socket.handshake.query.token){
//     // jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
//     //   if (err) return next(new Error('Authentication error'));
//     //   socket.decoded = decoded;
//       next();
//     // });
//   }
//   else {
//     next(new Error('Authentication error'));
//   }    
// })
// .on('connection', function(socket) {
//     // Connection now authenticated to receive further events

//     socket.on('message', function(message) {
//         io.emit('message', message);
//     });
// });

app.get("/get_test", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.use((socket, next) => {
    const token = socket.handshake.auth;
    console.log(token);
    if (token.user_type == "client") {
        next();
    } else {
        next(new Error("auth is faild"));
    }

});
io.on('connection', (socket) => {
    console.log("connection established");
    socket.on('hi', (data) => {
        console.log(data);
    });
});