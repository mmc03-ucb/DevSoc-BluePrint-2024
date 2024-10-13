// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import LandingPage from './components/LandingPage';
import DynamicLeetCodeList from './components/DynamicLeetCodeList';
import CompanyOverviews from './components/CompanyOverviews';
import GeneralResources from './components/GeneralResources';
import AlumniConnect from './components/AlumniConnect';
import JobBoard from './components/JobBoard';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* AppBar/Header */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div">
              Interview Prep Hub
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content - fills remaining height */}
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dynamic-leetcode-list" element={<DynamicLeetCodeList />} />
            <Route path="/company-overviews" element={<CompanyOverviews />} />
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
            backgroundColor: '#f5f5f5',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body1" align="center">
              © {new Date().getFullYear()} Interview Prep Hub. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
