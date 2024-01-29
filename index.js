const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  videoUrl: { type: String, trim: true },
});

const Item = mongoose.model("Item", itemSchema);

app.post("/download", async (req, res) => {
  const { videoUrl } = req.body;

  try {
    // Run the Python script as a subprocess with the videoUrl parameter
    const pythonProcess = spawn("python3", [
      "/Users/Sakil/Desktop/projects/BoofTube/youtube-video-downloader.py",
      videoUrl,
    ]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python script output: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        res.status(200).json({ message: "Video downloaded successfully!" });
      } else {
        res.status(500).json({ message: "Error downloading video" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error downloading video" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

app.get("/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item" });
  }
});

app.post("/items", async (req, res) => {
  const { name, description, videoUrl } = req.body;

  try {
    let embeddedUrl = "";
    if (videoUrl.includes("watch?v=")) {
      embeddedUrl = videoUrl.replace("watch?v=", "embed/");
    } else if (videoUrl.includes("youtu.be")) {
      embeddedUrl = videoUrl.replace("youtu.be", "www.youtube.com/embed");
    } else {
      embeddedUrl = videoUrl;
    }

    const newItem = new Item({ name, description, videoUrl: embeddedUrl });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error adding item" });
  }
});

app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, videoUrl } = req.body;

  try {
    let embeddedUrl = "";
    if (videoUrl.includes("watch?v=")) {
      embeddedUrl = videoUrl.replace("watch?v=", "embed/");
    } else if (videoUrl.includes("youtu.be")) {
      embeddedUrl = videoUrl.replace("youtu.be", "www.youtube.com/embed");
    } else {
      embeddedUrl = videoUrl;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, description, videoUrl: embeddedUrl },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item" });
  }
});

app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
