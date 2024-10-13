import React, { useState } from 'react';
import { Typography, Container, TextField, Button, MenuItem, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

function DynamicLeetCodeList() {
  const [timeLeft, setTimeLeft] = useState('');
  const [prepLevel, setPrepLevel] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('http://localhost:5001/api/generate-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time_left: parseInt(timeLeft),
        prep_level: prepLevel,
        target_company: targetCompany
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Generate Your Dynamic LeetCode List
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Time Left (days)"
          type="number"
          value={timeLeft}
          onChange={(e) => setTimeLeft(e.target.value)}
          fullWidth
          margin="normal"
        />

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

        <TextField
          label="Target Company (optional)"
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Generate List
        </Button>
      </form>

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <List sx={{ mt: 4 }}>
          {problems.map((problem) => (
            <ListItem
              key={problem.id}
              component="a"
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              button
            >
              <ListItemText
                primary={problem.title}
                secondary={`Difficulty: ${problem.difficulty} | Frequency: ${problem.frequency}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default DynamicLeetCodeList;
