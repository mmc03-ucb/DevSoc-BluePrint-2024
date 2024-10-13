// src/components/DynamicLeetCodeList.js

import React, { useState, useEffect } from 'react';
import { Typography, Container, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

function DynamicLeetCodeList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the data from the backend API
    fetch('http://localhost:5001/api/leetcode-problems')
      .then((response) => response.json())
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Dynamic LeetCode List
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
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
                secondary={`Difficulty: ${problem.difficulty}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default DynamicLeetCodeList;
