const express = require('express');
const app = express();
const PORT = 3000;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
    "cors": "*"
});

const MAX_MESSAGES = 5;
const TIME_WINDOW = 5000;
const spamTracker = new Map();

io.on("connection", (socket) => {
    socket.broadcast.emit("connected");
    console.log("Connected to: " + socket.id);


    spamTracker.set(socket.id, []);

    const checkSpam = (socket) => {
        const now = Date.now();
        let timestamps = spamTracker.get(socket.id) || [];

        timestamps = timestamps.filter(time => now - time < TIME_WINDOW);
        timestamps.push(now);
        spamTracker.set(socket.id, timestamps);


        if (timestamps.length > MAX_MESSAGES) {
            return true;
        }
        return false; 
    };


    socket.on("message", (obj) => {
        if (checkSpam(socket)) {

            socket.emit("banned", { reason: "Wysyłasz za dużo wiadomości! Zostałeś odłączony." });
            socket.disconnect(true);
            return; 
        }
        socket.broadcast.emit("message", obj);
    });

    socket.on("messageIMG", (obj) => {
        if (checkSpam(socket)) {
            socket.emit("banned", { reason: "Wysyłasz za dużo plików! Zostałeś odłączony." });
            socket.disconnect(true);
            return;
        }
        socket.broadcast.emit("messageIMG", obj);
    });

    socket.on("typing", (obj) => {

        socket.broadcast.emit("typing", obj);
    });


    socket.on("disconnect", () => {
        spamTracker.delete(socket.id);
        console.log("Disconnected: " + socket.id);
    });
});

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});