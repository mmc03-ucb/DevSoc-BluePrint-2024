const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Mock Problem Database
const problemList = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', frequency: 90, topics: ['Array', 'Hashing'], company_tags: ['Google', 'Facebook'] },
  { id: 2, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', frequency: 70, topics: ['Binary Search'], company_tags: ['Google', 'Amazon'] },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', frequency: 85, topics: ['String', 'Sliding Window'], company_tags: ['Microsoft', 'Facebook'] },
  // Add more problems...
];

// Helper function to get problem difficulty score based on user's preparation level
function getDifficultyScore(difficulty, prepLevel) {
  const scores = {
    beginner: { Easy: 1.0, Medium: 0.5, Hard: 0.1 },
    intermediate: { Easy: 0.5, Medium: 1.0, Hard: 0.5 },
    advanced: { Easy: 0.1, Medium: 0.5, Hard: 1.0 }
  };
  return scores[prepLevel.toLowerCase()][difficulty];
}

// Helper function to rank difficulties
function getDifficultyRank(difficulty) {
  const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
  return difficultyOrder[difficulty];
}

// API route to generate a dynamic list based on user input
app.post('/api/generate-list', (req, res) => {
  const { time_left, prep_level, target_company } = req.body;

  // Step 1: Estimate Total Problems
  const problemsPerDay = { beginner: 2, intermediate: 4, advanced: 6 };
  const totalProblems = problemsPerDay[prep_level.toLowerCase()] * time_left;

  // Step 2: Define Weights
  let weights = {
    w_f: 0.4,
    w_c: 0.3,
    w_d: 0.2,
    w_t: 0.1
  };

  if (time_left < 7) {
    weights.w_f = 0.5;
    weights.w_c = 0.4;
  }

  // Step 3: Calculate Scores for Each Problem
  const maxFrequency = Math.max(...problemList.map(p => p.frequency));

  const scoredProblems = problemList.map(problem => {
    const S_f = problem.frequency / maxFrequency;
    const S_c = target_company && problem.company_tags.includes(target_company) ? 1 : 0;
    const S_d = getDifficultyScore(problem.difficulty, prep_level);
    const S_t = 0.1; // For now, we're keeping topic score constant; can be expanded later.

    const totalScore = (weights.w_f * S_f) + (weights.w_c * S_c) + (weights.w_d * S_d) + (weights.w_t * S_t);

    return { ...problem, totalScore };
  });

  // Step 4: Sort by total score and select top problems
  const topProblems = scoredProblems
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, totalProblems);

  // Step 5: Sort the selected problems by difficulty for display
  const sortedForDisplay = topProblems.sort((a, b) => {
    const difficultyRankA = getDifficultyRank(a.difficulty);
    const difficultyRankB = getDifficultyRank(b.difficulty);

    return difficultyRankA - difficultyRankB;  // Sort by difficulty
  });

  // Return the sorted problems
  res.json(sortedForDisplay);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
