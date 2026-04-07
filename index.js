const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const MANGADEX_BASE = "https://api.mangadex.org";

app.use(cors());

// Proxy all requests to MangaDex
app.get("/mangadex/*", async (req, res) => {
  try {
    const path = req.params[0];
    const query = req.url.includes("?") ? req.url.split("?")[1] : "";
    const url = `${MANGADEX_BASE}/${path}${query ? "?" + query : ""}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "MangaReaderApp/1.0" },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

// Health check
app.get("/", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
