const express = require("express")
const ytSearch = require("yt-search")
const youtubedl = require("youtube-dl-exec")
const cors = require("cors")

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("🔥 Full Song API Running")
})

app.get("/api/song", async (req, res) => {
    try {

        const name = req.query.name
        if (!name) return res.json({ status: false, message: "Song name required" })

        // 🎵 SEARCH
        const search = await ytSearch(name)

        if (!search?.videos?.length) {
            return res.json({ status: false, message: "No song found" })
        }

        const video = search.videos[0]

        // 🎧 DOWNLOAD AUDIO STREAM
        const stream = youtubedl(video.url, {
            extractAudio: true,
            audioFormat: "mp3",
            audioQuality: "0",
            output: "-"
        })

        res.setHeader("Content-Type", "audio/mpeg")
        res.setHeader("Content-Disposition", `attachment; filename="${video.title}.mp3"`)

        stream.stdout.pipe(res)

    } catch (e) {
        console.log(e)
        res.json({ status: false, message: e.message })
    }
})

app.listen(PORT, () => {
    console.log("Server running on " + PORT)
})
