import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// ✅ Test route (optional)
app.get("/", (req, res) => {
  res.send("MangaDex Proxy Running ✅");
});

// ✅ MangaDex At-Home Server (IMPORTANT FIX)
app.get("/mangadex/at-home/server/:chapterId", async (req, res) => {
  try {
    const { chapterId } = req.params;

    const response = await fetch(
      `https://api.mangadex.org/at-home/server/${chapterId}`
    );

    const data = await response.json();

    // 🔥 DO NOT MODIFY — send full response
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chapter data" });
  }
});

// ✅ (Optional) Manga details route
app.get("/mangadex/manga/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.mangadex.org/manga/${id}`
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch manga" });
  }
});

// ✅ (Optional) Chapters list
app.get("/mangadex/chapter", async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();

    const response = await fetch(
      `https://api.mangadex.org/chapter?${query}`
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
