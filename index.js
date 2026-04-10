import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// ✅ At-home server (for images)
app.get("/mangadex/at-home/server/:chapterId", async (req, res) => {
  try {
    const { chapterId } = req.params;

    const response = await fetch(
      `https://api.mangadex.org/at-home/server/${chapterId}`
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chapter data" });
  }
});

// 🔥 UNIVERSAL PROXY (handles EVERYTHING else)
app.use("/mangadex/*", async (req, res) => {
  try {
    const url =
      "https://api.mangadex.org" +
      req.originalUrl.replace("/mangadex", "");

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Proxy error" });
  }
});

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("MangaDex Proxy Running ✅");
});

// ✅ START SERVER (ONLY ONCE, ALWAYS LAST)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
