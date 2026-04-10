import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Helper fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "User-Agent": "MangaApp/1.0",
        ...options.headers,
      },
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// At-home server (chapter images)
app.get("/mangadex/at-home/server/:chapterId", async (req, res) => {
  try {
    const { chapterId } = req.params;
    const url = `https://api.mangadex.org/at-home/server/${chapterId}`;

    console.log("📘 Chapter Images:", url);

    const data = await fetchWithTimeout(url);

    res.json(data);
  } catch (error) {
    console.error("❌ Chapter Error:", error.message);
    res.status(500).json({
      error: "Failed to fetch chapter data",
    });
  }
});

// Universal proxy
app.use("/mangadex/*", async (req, res) => {
  try {
    const url =
      "https://api.mangadex.org" +
      req.originalUrl.replace("/mangadex", "");

    console.log("🌐 Proxy Request:", url);

    const data = await fetchWithTimeout(url);

    res.json(data);
  } catch (error) {
    console.error("❌ Proxy Error:", error.message);

    res.status(500).json({
      error: "Proxy failed",
      message: error.message,
    });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("MangaDex Proxy Running ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
