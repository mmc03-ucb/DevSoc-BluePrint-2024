import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, MenuItem, List, ListItem, ListItemText, CircularProgress, Card, CardContent, CardActionArea } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getLeetCodeProblems, updateProblemCompletionStatus, findProblemByURL, updateProblemContribution, addNewProblem, getCompanyOverview } from '../api'; // Import the Firestore API function
import { Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';

function DynamicLeetCodeList() {
  const [interviewDate, setInterviewDate] = useState(null);  // Interview date from calendar
  const [prepLevel, setPrepLevel] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [showContributeForm, setShowContributeForm] = useState(false); // Toggle contribute form visibility
  const [contributeLink, setContributeLink] = useState(''); // Leetcode link for contribution
  const [contributeCompany, setContributeCompany] = useState(''); // Company for contribution
  const [contributeDifficulty, setContributeDifficulty] = useState(''); // Add difficulty field
  const [showDifficultyField, setShowDifficultyField] = useState(false);
  const [contributeMessage, setContributeMessage] = useState(''); // Message for contribution feedback
  const [companyOverview, setCompanyOverview] = useState(null);

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

  // Helper function to trim the URL
  const trimLeetCodeURL = (url) => {
    if (url.includes('/description/')) {
      return url.replace('/description/', '');
    }
    return url;
  };

  // Modified onChange for contributeLink to trim the URL
  const handleContributeLinkChange = (e) => {
    const trimmedURL = trimLeetCodeURL(e.target.value);
    setContributeLink(trimmedURL);
  };

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

      if (targetCompany) {
        const overview = await getCompanyOverview(targetCompany); // Fetch the company overview data
        setCompanyOverview(overview || null); // Set the company overview if exists, otherwise set to null
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the progress percentage (completed problems / total problems)
  const totalProblems = problems.length;
  const completedProblems = problems.filter(problem => problem.completed).length;
  const progress = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

  const extractTitleFromURL = (url) => {
    const slug = url.split("/problems/")[1].split("/")[0];  // Extract the problem slug
    const title = slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");  // Capitalize each word
    return title;
  };

  // Handle contribution
  const handleContribute = async (e) => {
    e.preventDefault();
    setContributeMessage('');  // Clear previous messages

    // Check if the problem exists by URL
    const existingProblem = await findProblemByURL(contributeLink);

    if (existingProblem) {
      // Problem exists, check if the company is tagged
      if (existingProblem.company_tags.includes(contributeCompany)) {
        // Company is already tagged, increment the frequency
        await updateProblemContribution(existingProblem.id, existingProblem.frequency + 1);
        setContributeMessage('Thank you for contributing!');
      } else {
        // Company is not tagged, add the company and set frequency to 1
        await updateProblemContribution(existingProblem.id, existingProblem.frequency + 1, contributeCompany);
        setContributeMessage('Thank you for contributing!');
      }

      // Fetch updated problems and update the state
      const updatedProblems = await getLeetCodeProblems(1000, 'Beginner');
      setProblems(updatedProblems);  // Update the problems list in the state

      // Clear input fields and hide the form
      setContributeLink('');
      setContributeCompany('');
      setShowContributeForm(false);  // Hide form after successful contribution

      // Automatically clear the message after 3 seconds
      setTimeout(() => {
        setContributeMessage('');
      }, 3000);

    } else {
      setShowDifficultyField(true);
    }
  };

  const handleAddNewProblem = async (e) => {
    e.preventDefault();

    const title = extractTitleFromURL(contributeLink);  // Extract title from URL
    console.log("Adding new problem with title:", title, "and difficulty:", contributeDifficulty);
    const newProblem = {
      url: contributeLink,
      title,
      difficulty: contributeDifficulty,
      frequency: 1,
      company_tags: [contributeCompany],
    };

    // Add the new problem to Firestore
    await addNewProblem(newProblem);
    setContributeMessage('New problem added successfully!');

    const updatedProblems = await getLeetCodeProblems(1000, 'Beginner');
    setProblems(updatedProblems);
    setContributeLink('');
    setContributeCompany('');
    setContributeDifficulty('');  // Clear difficulty field
    setShowContributeForm(false);
    setShowDifficultyField(false);  // Hide difficulty field after submission

    setTimeout(() => setContributeMessage(''), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          fontSize: 'clamp(1rem, 2.5vw, 2.5rem)',  // Adjust font size between 1rem and 2.5rem based on viewport width
          whiteSpace: 'nowrap',                    // Prevents the text from wrapping
          overflow: 'hidden',                      // Ensure no overflow occurs
          textOverflow: 'clip',                    // No ellipsis, just clip text if needed (though it won't happen with clamp)
        }}
      >
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

      {/* Add the "Contribute" Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => {
          setShowContributeForm(!showContributeForm);  // Toggle contribute form visibility
          setContributeLink('');  // Clear link field
          setContributeCompany('');  // Clear company field
          setContributeMessage('');  // Clear contribution message
          setShowDifficultyField(false);
        }}
      >
        {showContributeForm ? 'Hide Contribution' : 'Contribute'}
      </Button>

      {/* Conditional Contribution Form */}
      {showContributeForm && (
        <form onSubmit={showDifficultyField ? handleAddNewProblem : handleContribute} style={{ marginTop: '16px' }}>
          {/* Leetcode Link Input with URL trimming */}
          <TextField
            label="Leetcode Problem Link"
            value={contributeLink}
            onChange={handleContributeLinkChange}
            fullWidth
            margin="normal"
            required
          />

          {/* Company Input */}
          <TextField
            label="Company"
            value={contributeCompany}
            onChange={(e) => setContributeCompany(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {showDifficultyField && (
            <TextField
              label="Problem Difficulty"
              select
              value={contributeDifficulty}
              onChange={(e) => setContributeDifficulty(e.target.value)}
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </TextField>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {showDifficultyField ? 'Add New Problem' : 'Submit Contribution'}
          </Button>

          {/* Contribution Message */}
          {contributeMessage && (
            <Typography variant="body1" color="success" align="center" sx={{ mt: 2 }}>
              {contributeMessage}
            </Typography>
          )}
        </form>
      )}

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

      {/* Display the progress bar */}
      {totalProblems > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '16px', position: 'relative' }}>
          <div style={{
            position: 'relative',
            display: 'inline-flex',
          }}>
            {/* Circular Progress Bar */}
            <CircularProgress 
              variant="determinate" 
              value={progress} 
              size={100}  // Adjust size of the circular progress bar
              thickness={5}  // Adjust thickness of the circular progress bar
            />
            {/* Centered Text */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}>
              <Typography variant="h6" component="div" color="textPrimary">
                {completedProblems} / {totalProblems}
              </Typography>
              <Typography variant="caption" component="div" color="textSecondary">
                Completed
              </Typography>
            </div>
          </div>
        </div>
      )}

      {/* Display the list of problems */}
      {loading ? (
        <CircularProgress sx={{ mt: 1 }} />
      ) : (
        <List sx={{ mt: 1 }}>
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
      {/* Display Company Overview if available */}
      {companyOverview && (
        <Card sx={{ mt: 4 }}>
          <CardActionArea component={Link} to={`/company-details/${companyOverview.id}`}>
            <CardContent>
              <Typography variant="h5" component="h3">
                {companyOverview.name}
              </Typography>
              <Typography variant="body1">
                Tech Stack: {companyOverview.techStack.join(', ')}
              </Typography>
              <Typography variant="body1">
                Recruiters: {companyOverview.recruiterList?.join(', ')}
              </Typography>
              <Typography variant="body1">
                Pay and Perks: {companyOverview.payAndPerks}
              </Typography>
              <Typography variant="body1">
                Employee Reviews: {companyOverview.employeeReviews}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </Container>
  );
}

export default DynamicLeetCodeList;
