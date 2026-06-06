const express = require("express")
const cors = require("cors")
const ytSearch = require("yt-search")

const app = express()
app.use(cors())

app.get("/", (req, res) => {
    res.send("🔥 API Running")
})

app.get("/api/song", async (req, res) => {
    try {

        const name = req.query.name
        if (!name) return res.json({ status: false, message: "name required" })

        const search = await ytSearch(name)

        if (!search.videos.length) {
            return res.json({ status: false, message: "not found" })
        }

        const video = search.videos[0]

        return res.json({
            status: true,
            title: video.title,
            url: video.url
        })

    } catch (e) {
        res.json({ status: false, message: e.message })
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Running")
})
