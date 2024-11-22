const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 4000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Proxy API route to fetch transaction data
app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://leger.rahulluthra.in/api/tasks/d"
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
