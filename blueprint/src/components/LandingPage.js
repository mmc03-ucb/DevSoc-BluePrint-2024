import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Box,
  IconButton,
  useTheme, // Import useTheme hook
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  ListAlt,
  Business,
  Book,
  People,
  Work,
} from '@mui/icons-material';

// Custom styles
const useStyles = makeStyles((theme) => ({
  heroSection: {
    backgroundImage: 'url(https://source.unsplash.com/random/1920x600?technology)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    padding: theme.spacing(10, 0),
    textAlign: 'center',
  },
  cardIcon: {
    fontSize: 60,
    color: theme.palette.primary.main,
  },
  cardContent: {
    textAlign: 'center',
  },
  featureCard: {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
}));

function LandingPage() {
  const classes = useStyles();
  const theme = useTheme(); // Access the current theme

  const features = [
    { name: 'Dynamic LeetCode List', path: '/dynamic-leetcode-list', icon: <ListAlt /> },
    { name: 'Alumni Connect', path: '/alumni-connect', icon: <People /> },
    { name: 'Company Overviews', path: '/company-overviews', icon: <Business /> },
    { name: 'General Resources', path: '/general-resources', icon: <Book /> },
    { name: 'Job Board', path: '/job-board', icon: <Work /> },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box className={classes.heroSection}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              fontWeight: 700,  // Make the heading bold
              letterSpacing: 1.2, // Add slight letter spacing for a modern look
              fontSize: '3rem', // Adjust the size for better readability
            }}
          >
            Welcome to HireVerse
          </Typography>
          <Typography
            variant="h6" // Use a smaller variant for better hierarchy
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              fontWeight: 400, // Lighten the subtitle
              letterSpacing: 0.8, // Add subtle spacing to the subtitle
              fontSize: '1.2rem', // Adjust size for better balance
            }}
          >
            Your one-stop platform to ace interviews and streamline your job search
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: -10, mb: 4 }}>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item key={feature.name} xs={12} sm={6} md={4}>
              <Card variant="outlined" className={classes.featureCard}>
                <CardActionArea component={Link} to={feature.path}>
                  <CardContent className={classes.cardContent}>
                    <IconButton disableRipple className={classes.cardIcon}>
                      {feature.icon}
                    </IconButton>
                    <Typography 
                      variant="h6" // Use h6 for slightly smaller text on cards
                      component="div" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 500, // Medium weight for emphasis
                        fontSize: '1.2rem', // Smaller size for card titles
                        letterSpacing: 0.5, // Keep consistent with modern look
                      }}
                    >
                      {feature.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default LandingPage;
