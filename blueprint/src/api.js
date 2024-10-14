import { collection, getDocs, query, where, updateDoc, doc, arrayUnion, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// Scoring functions
function getDifficultyScore(difficulty, prepLevel) {
  const scores = {
    beginner: { Easy: 1.0, Medium: 0.5, Hard: 0.1 },
    intermediate: { Easy: 0.5, Medium: 1.0, Hard: 0.5 },
    advanced: { Easy: 0.1, Medium: 0.5, Hard: 1.0 }
  };
  return scores[prepLevel.toLowerCase()][difficulty];
}

function getDifficultyRank(difficulty) {
  const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
  return difficultyOrder[difficulty];
}

// Function to fetch and process LeetCode problems from Firestore
export async function getLeetCodeProblems(timeLeft, prepLevel, targetCompany) {
  // Fetch all problems without filtering by company tag
  const q = collection(db, "problems");

  const querySnapshot = await getDocs(q);
  const fetchedProblems = querySnapshot.docs.map((doc) => ({
    id: doc.id, // Add document ID
    ...doc.data() // Spread the rest of the document data
  }));

  // Step 1: Estimate Total Problems
  const problemsPerDay = { beginner: 2, intermediate: 4, advanced: 6 };
  const totalProblems = problemsPerDay[prepLevel.toLowerCase()] * timeLeft;

  // Step 2: Define Weights
  let weights = {
    w_f: 0.3,
    w_c: 0.4, // Higher weight for problems tagged with target company
    w_d: 0.2,
    w_t: 0.1
  };

  if (timeLeft < 7) {
    weights.w_f = 0.4;
    weights.w_c = 0.5;
  }

  // Step 3: Calculate Scores for Each Problem
  const maxFrequency = Math.max(...fetchedProblems.map(p => p.frequency));

  const scoredProblems = fetchedProblems.map(problem => {
    const S_f = problem.frequency / maxFrequency;
    const S_c = targetCompany && problem.company_tags.includes(targetCompany) ? 1 : 0; // Company tag score
    const S_d = getDifficultyScore(problem.difficulty, prepLevel);
    const S_t = 0.1; // For now, we can keep topic score constant

    // Total score based on frequency, company match, difficulty, and topic
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
    return difficultyRankA - difficultyRankB;
  });

  return sortedForDisplay; // Return the sorted problems
}

// Function to update the completed status of a LeetCode problem in Firestore
export async function updateProblemCompletionStatus(problemId, isCompleted) {
  try {
    const problemRef = doc(db, "problems", problemId); // Reference to the specific problem document
    await updateDoc(problemRef, { completed: isCompleted }); // Update the 'completed' field
  } catch (error) {
    console.error("Error updating completion status:", error);
  }
}

// Function to find a problem by URL
export async function findProblemByURL(url) {
  const q = query(collection(db, "problems"), where("url", "==", url));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  }
  return null;  // Return null if problem is not found
}

// Function to update the problem contribution
export async function updateProblemContribution(problemId, frequency, newCompany = null) {
  const problemRef = doc(db, "problems", problemId);
  const updateData = { frequency };
  if (newCompany) {
    // Use Firestore's arrayUnion to add the new company to the existing company_tags array
    updateData.company_tags = arrayUnion(newCompany);  
  }
  await updateDoc(problemRef, updateData);
}

// Function to add a new problem to Firestore
export async function addNewProblem(problemData) {
  try {
    const problemsRef = collection(db, "problems");  // Reference to 'problems' collection
    await addDoc(problemsRef, problemData);  // Add the new problem to Firestore
    console.log("Problem added successfully:", problemData);
  } catch (error) {
    console.error("Error adding new problem:", error);
  }
}
