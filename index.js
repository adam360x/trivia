const express = require('express');
const router = express.Router();
const bp = require('body-parser')
const { Server } = require('ws');
const { title } = require('process');

let time = 0;
let album = "";
let song_name = "";
let artist = "";

const server = express()
  .use("/", router)
  .listen(3000, () => console.log(`Listening on ${3000}`));

router.use(bp.json())
router.use(bp.urlencoded({extended:true}))

const ws_server = new Server({ server });

ws_server.on('connection', (ws) => {
    console.log('New client connected!');
    ws.send(JSON.stringify({"time" : time,
    "album": " From: " + album,
    "title": song_name,
    "artist": " By: " + artist
   }));
    ws.on('close', () => console.log('Client has disconnected!'));
  });

router.get('/',(req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// POST method route
router.post('/5762643302', (req, res) => {

    time = (new Date().getTime()) + (req.body.data.metadata.music[0].duration_ms - req.body.data.metadata.music[0].play_offset_ms);

    song_data = req.body.data.metadata.music[0]

    album = song_data.album.name
    song_name = song_data.title
    artist = ""

    for (let i = 0; i < song_data.artists.length; i++){
        artist += song_data.artists[i].name + " "
    }


    ws_server.clients.forEach((client) => {
        client.send(JSON.stringify({"time" : time,
            "album": " From: " + album,
            "title": song_name,
            "artist": " By: " + artist
        }));
    });
    res.sendStatus(200);
  })