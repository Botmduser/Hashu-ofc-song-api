const express = require("express")
const ytdl = require("@distube/ytdl-core")
const ytSearch = require("yt-search")
const cors = require("cors")

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("🔥 Song Download API Running")
})

/**
 * 🎧 SONG SEARCH + DOWNLOAD API
 * /api/song?name=shape of you
 */
app.get("/api/song", async (req, res) => {
    try {

        const name = req.query.name

        if (!name) {
            return res.json({
                status: false,
                message: "Song name required"
            })
        }

        // 🔎 search youtube
        const search = await ytSearch(name)

        if (!search?.videos?.length) {
            return res.json({
                status: false,
                message: "No song found"
            })
        }

        const video = search.videos[0]

        const url = video.url
        const title = video.title
        const thumbnail = video.thumbnail

        if (!ytdl.validateURL(url)) {
            return res.json({
                status: false,
                message: "Invalid video"
            })
        }

        // 🎧 audio stream
        const stream = ytdl(url, {
            filter: "audioonly",
            quality: "highestaudio"
        })

        res.header("Content-Disposition", `attachment; filename="${title}.mp3"`)

        // optional metadata
        res.setHeader("X-Title", title)
        res.setHeader("X-Thumbnail", thumbnail)

        stream.pipe(res)

    } catch (e) {
        console.log(e)
        res.json({
            status: false,
            message: e.message
        })
    }
})

app.listen(PORT, () => {
    console.log("🔥 Song API running on port " + PORT)
})
