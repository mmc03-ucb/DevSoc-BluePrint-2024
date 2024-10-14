// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, CssBaseline, Switch, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import LandingPage from './components/LandingPage';
import DynamicLeetCodeList from './components/DynamicLeetCodeList';
import CompanyOverviews from './components/CompanyOverviews';
import CompanyDetails from './components/CompanyDetails';
import GeneralResources from './components/GeneralResources';
import AlumniConnect from './components/AlumniConnect';
import JobBoard from './components/JobBoard';

function App() {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  // Toggle between light and dark mode
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  // Create light and dark themes
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures the background and text colors adjust to the theme */}
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* AppBar/Header */}
          <AppBar position="static" color="primary">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div">
                Interview Prep Hub
              </Typography>
              {/* Dark Mode Toggle Switch */}
              <Box display="flex" alignItems="center">
                <IconButton color="inherit" onClick={handleThemeChange}>
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dynamic-leetcode-list" element={<DynamicLeetCodeList />} />
              <Route path="/company-overviews" element={<CompanyOverviews />} />
              <Route path="/company-details/:companyId" element={<CompanyDetails />} />
              <Route path="/general-resources" element={<GeneralResources />} />
              <Route path="/alumni-connect" element={<AlumniConnect />} />
              <Route path="/job-board" element={<JobBoard />} />
            </Routes>
          </Box>

          {/* Sticky Footer */}
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: theme.palette.background.default,
              textAlign: 'center',
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body1" align="center">
                Created by Muqueet and Farhan
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;