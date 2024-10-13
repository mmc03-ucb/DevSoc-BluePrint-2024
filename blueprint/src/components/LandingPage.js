import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Card, CardActionArea, CardContent, Container, Box } from '@mui/material';

function LandingPage() {
  const features = [
    { name: 'Dynamic LeetCode List', path: '/dynamic-leetcode-list' },
    { name: 'Company Overviews', path: '/company-overviews' },
    { name: 'General Resources', path: '/general-resources' },
    { name: 'Alumni Connect', path: '/alumni-connect' },
    { name: 'Job Board', path: '/job-board' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Interview Prep Hub
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Your one-stop platform to ace technical interviews and streamline your job search.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item key={feature.name} xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardActionArea component={Link} to={feature.path}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {feature.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default LandingPage;
