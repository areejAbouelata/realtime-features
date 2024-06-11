const app = require('express')();
const http = require('http').createServer(app);
var io = require('socket.io')(http);
const {
    path
} = require('path');
var fs = require('fs');
http.listen(3000);

const users = {};
var json = JSON.stringify(users);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

io.on('connection', (socket) => {
    console.log("connection Established");

    socket.on('login', (data) => {
        // users[socket.id] = data['id'];
        addUser({'socket_id': socket.id, 'user_id': data['id']}, 'users.json');

        io.emit("dashboard_update", "look at the file :)");
    });
    socket.on("disconnect", () => {
        deletUser(socket.id, 'users.json');
        io.emit('dashboard_update', "look at the file :)");
    })
});

// function to create file if note exist then append passed data
function addUser(user, fileName) {
    if (fs.existsSync(fileName)) {
        // append user to file 
        fs.readFile(fileName, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                old_users = JSON.parse(data);
                console.log(old_users);
                console.log(user);
                old_users.push(user);
                json = JSON.stringify(old_users);
                fs.writeFile(fileName, json, 'utf8', function (error) {
                    console.log(error);
                });
            }
        });
    } else {
        json = JSON.stringify([user]);
        fs.writeFile(fileName, json, 'utf8', function (error) {
            console.log(error)
        });

    }
}

function deletUser(socket_id, fileName) {
    if (fs.existsSync(fileName)) {
        // append user to file 
        fs.readFile(fileName, 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                old_users = JSON.parse(data);
                old_users = old_users.filter(child => child.socket_id != socket_id);
                json = JSON.stringify(old_users);
                fs.writeFile(fileName, json, 'utf8', function (error) {
                    console.log(error);
                });
            }
        });
    }
}