const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(80, () => {
  console.log("server started on http://localhost:80");
});

// 두 객체는 id를 공유
let sockets = []; // 소켓 객체 저장
let userInfo = []; // 유저 정보 저장

let id = 0;

wss.on("connection", (socket) => {
  socket.id = id++;
  sockets[socket.id] = socket;

  console.log("client connected with id", socket.id);
  console.log(userInfo)
  socket.send(makeMessage("message", "Welcome to the together town! ✨"));
  socket.send(makeMessage("update_positions", userInfo.filter((u, i) => i !== socket.id)));

  socket.on("message", (message) => {
    const parsed = JSON.parse(message);

    switch (parsed.type) {
      case "user_info":
        userInfo[socket.id] = {
          nickname: parsed.data.nickname,
          position: parsed.data.position,
          direction: parsed.data.direction,
          blocksize: parsed.data.blocksize,
        };
        sockets.forEach((sk) => {
          if (sk.id === socket.id) return;
          sk.send(
            makeMessage(
              "update_positions",
              userInfo.filter((u, i) => i !== sk.id),
            ),
          );
        });
        break;
      case "nickname":
        userInfo[socket.id].nickname = parsed.data.nickname;
        sockets.forEach((sk) => {
          if (sk.id === socket.id) return;
          sk.send(
            makeMessage(
              "update_positions",
              userInfo.filter((u, i) => i !== sk.id),
            ),
          );
        });
        break;
      case "avatar_info":
        userInfo[socket.id].position = parsed.data.position;
        userInfo[socket.id].direction = parsed.data.direction;
        sockets.forEach((sk) => {
          if (sk.id === socket.id) return;
          sk.send(
            makeMessage(
              "update_positions",
              userInfo.filter((u, i) => i !== sk.id),
            ),
          );
        });
      default:
        break;
    }
  });

  socket.on("close", () => {
    console.log("client disconnected with id", socket.id);
    delete sockets[socket.id];
    delete userInfo[socket.id];

    sockets.forEach((sk) => {
      sk.send(
        makeMessage(
          "update_positions",
          userInfo.filter((u, i) => i !== sk.id),
        ),
      );
    });
  });
});

function makeMessage(type, data) {
  return JSON.stringify({ type, data });
}
