import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, MenuItem, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getLeetCodeProblems, updateProblemCompletionStatus } from '../api'; // Import the Firestore API function
import { Checkbox } from '@mui/material';

function DynamicLeetCodeList() {
  const [interviewDate, setInterviewDate] = useState(null);  // Interview date from calendar
  const [prepLevel, setPrepLevel] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  // Fetch all problems on initial load
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        // Fetch all problems without personalization
        const fetchedProblems = await getLeetCodeProblems(1000, 'Beginner'); // No filter initially
        setProblems(fetchedProblems);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Calculate number of days between today and the interview date
  const calculateDaysLeft = () => {
    if (interviewDate) {
      const today = dayjs();
      const daysLeft = interviewDate.diff(today, 'day') + 1; // Get the difference in days
      return daysLeft >= 0 ? daysLeft : 0; // If negative, return 0
    }
    return 0; // If no date is selected, default to 0
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timeLeft = calculateDaysLeft();
    setLoading(true);

    try {
      // Fetch personalized problems from the backend (api.js)
      const fetchedProblems = await getLeetCodeProblems(timeLeft, prepLevel, targetCompany);
      setProblems(fetchedProblems); // Set the personalized problems to state
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Leetcode a day, keeps unemployment away
      </Typography>

      {/* Personalize Button */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setShowForm(!showForm)} // Toggle form visibility
      >
        {showForm ? 'Hide Personalization' : 'Personalize'}
      </Button>

      {/* Conditional Form Rendering */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          {/* Interview Date Input */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="When is your interview?"
              value={interviewDate}
              onChange={(newValue) => setInterviewDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>

          {/* Preparation Level Input */}
          <TextField
            label="Preparation Level"
            select
            value={prepLevel}
            onChange={(e) => setPrepLevel(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </TextField>

          {/* Target Company Input */}
          <TextField
            label="Target Company (optional)"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Generate Personalized List
          </Button>
        </form>
      )}

      {/* Display the list of problems */}
      {loading ? (
  <CircularProgress sx={{ mt: 4 }} />
) : (
  <List sx={{ mt: 4 }}>
    {problems.map((problem, index) => (
      <ListItem key={index} button>
        {/* Checkbox for marking the problem as completed */}
        <Checkbox
  checked={problem.completed || false} // Default to false if "completed" does not exist
  onChange={async (e) => {
    // Update the completed status locally
    const updatedProblems = [...problems];
    updatedProblems[index].completed = e.target.checked;
    setProblems(updatedProblems);

    // Call the function to update the completed status in Firestore
    await updateProblemCompletionStatus(problem.id, e.target.checked); // Pass the problem ID and the new status
  }}
  sx={{
    color: 'primary.main',
    '&.Mui-checked': {
      color: 'primary.main',
    },
  }}
/>
        <ListItemText
          primary={
            <a href={problem.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }} >
              {problem.title}
            </a>
          }
          secondary={`Difficulty: ${problem.difficulty} | Frequency: ${problem.frequency} | Company Tags: ${problem.company_tags.join(', ')}`}
        />
      </ListItem>
    ))}
  </List>
)}
    </Container>
  );
}

export default DynamicLeetCodeList;
