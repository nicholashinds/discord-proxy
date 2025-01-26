require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

app.post("/create-invite", async (req, res) => {
    const { channelId } = req.body;

    if (!channelId) {
        return res.status(400).json({ error: "Missing channelId in request" });
    }

    try {
        const response = await axios.post(
            `https://discord.com/api/v10/channels/${channelId}/invites`,
            { max_uses: 1, unique: true, max_age: 86400 },
            { headers: { Authorization: `Bot ${DISCORD_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("Request received.");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Unknown error" });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
