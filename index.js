const express = require("express")
const cors = require("cors")
const ytSearch = require("yt-search")
const ytdl = require("@distube/ytdl-core")

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("🔥 API Running")
})

app.get("/api/song", async (req, res) => {
    try {

        const name = req.query.name
        if (!name) return res.json({ status: false, message: "Song name required" })

        const search = await ytSearch(name)
        if (!search?.videos?.length) {
            return res.json({ status: false, message: "No song found" })
        }

        const video = search.videos[0]

        const stream = ytdl(video.url, {
            filter: "audioonly",
            quality: "highestaudio"
        })

        res.setHeader("Content-Type", "audio/mpeg")

        stream.pipe(res)

    } catch (e) {
        console.log(e)
        res.json({ status: false, message: e.message })
    }
})

app.listen(PORT, () => {
    console.log("Server running on " + PORT)
})
