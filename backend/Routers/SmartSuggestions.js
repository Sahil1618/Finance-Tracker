// routes/SmartSuggestions.js
import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/getSuggestions", async (req, res) => {
  try {
    const { transactions } = req.body;
    const response = await axios.post("http://localhost:5001/analyze", {
      transactions,
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
