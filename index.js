const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* 🧠 MOCK SONG DATABASE */
const songs = [
    {
        id: "UcjVAR465ww",
        title: "Sindagana",
        artist: "Manjula Pushpakumara",
        views: 988224,
        duration: "3:37",
        thumbnail: "https://i.ytimg.com/vi/UcjVAR465ww/hq720.jpg",
        downloads: [
            { quality: "128kbps", url: "https://your-cdn.com/sindagana-128.mp3" },
            { quality: "320kbps", url: "https://your-cdn.com/sindagana-320.mp3" }
        ]
    },
    {
        id: "abc123",
        title: "Example Song",
        artist: "Sample Artist",
        views: 120000,
        duration: "4:10",
        thumbnail: "https://i.ytimg.com/vi/abc123/hq720.jpg",
        downloads: [
            { quality: "128kbps", url: "https://your-cdn.com/example-128.mp3" }
        ]
    }
];

/* 🔍 SEARCH API (song name search) */
app.get("/api/search", (req, res) => {
    const q = req.query.q?.toLowerCase();

    if (!q) {
        return res.json({ status: 400, message: "Query required" });
    }

    const results = songs.filter(song =>
        song.title.toLowerCase().includes(q)
    );

    res.json({
        status: 200,
        query: q,
        results: results.map(song => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            thumbnail: song.thumbnail,
            duration: song.duration,
            views: song.views
        }))
    });
});

/* 🎵 SONG DETAIL API */
app.get("/api/song/:id", (req, res) => {
    const song = songs.find(s => s.id === req.params.id);

    if (!song) {
        return res.json({ status: 404, message: "Song not found" });
    }

    res.json({
        status: 200,
        creator: "VajiraOfficial",
        data: {
            metadata: {
                type: "video",
                videoId: song.id,
                title: song.title,
                artist: song.artist,
                image: song.thumbnail,
                views: song.views,
                duration: song.duration
            },
            downloads: song.downloads
        }
    });
});

/* 🌐 SERVER */
app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});
