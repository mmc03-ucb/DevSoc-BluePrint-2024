import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box, List, ListItem, ListItemText } from '@mui/material';
import { companyData } from '../data/companyData'; // Example data source for company information

function CompanyDetails() {
  const { companyId } = useParams();
  const company = companyData.find((c) => c.id === parseInt(companyId));

  if (!company) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2">
          Company not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" component="h2">
          {company.name}
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
          {company.description}
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Tech Stack
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {company.techStack.join(', ')}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Pay and Perks
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {company.payAndPerks}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Recruiter List
      </Typography>
      <List>
        {company.recruiters.map((recruiter, index) => (
          <ListItem key={index}>
            <ListItemText primary={recruiter} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Employee Reviews
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {company.reviews}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Alumni Connections
      </Typography>
      <Typography variant="body1">
        <a href={company.linkedinLink} target="_blank" rel="noopener noreferrer">
          View UNSW Alumni on LinkedIn
        </a>
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Related Interview Questions
      </Typography>
      <List>
        {company.relatedQuestions.map((question, index) => (
          <ListItem key={index}>
            <ListItemText primary={question} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default CompanyDetails;