// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock LeetCode problem data
const leetcodeProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
];

// API route to get LeetCode problems
app.get('/api/leetcode-problems', (req, res) => {
  res.json(leetcodeProblems);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
